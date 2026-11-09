// Group storage + live sync between browser tabs. Owner: Abhijith.
// Spec: docs/BUILD_PLAN.md → "The group record" and "Functions in db.js".
//
// How it works:
//   - Each group is saved as JSON in localStorage under  mmh:group:<CODE>
//   - Each tab's own member ID is saved in sessionStorage under  mmh:me:<CODE>
//     (sessionStorage is per tab, so every tab is a different person)
//   - Other tabs hear changes through the browser's "storage" event.
//     The tab that made the change notifies its own listeners directly.
//
// Screens only ever call these functions, never localStorage directly.
// Later (User Study 2) only this file changes to use Firebase.

import { STATUS, BUDGET, MAX_GROUP_SIZE } from './constants.js'

const CODE_CHARS = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789' // no 0/O or 1/I
const groupKey = (code) => `mmh:group:${code}`
const meKey = (code) => `mmh:me:${code}`

// Listeners in THIS tab, per group code: code -> Set of callbacks
const listeners = new Map()

// ---------- small helpers ----------

function normalizeCode(code) {
  return String(code || '').trim().toUpperCase()
}

function randomCode() {
  let code = ''
  for (let i = 0; i < 6; i++) code += CODE_CHARS[Math.floor(Math.random() * CODE_CHARS.length)]
  return code
}

function randomMemberId() {
  return 'm_' + Math.random().toString(36).slice(2, 8)
}

function read(code) {
  try {
    const raw = localStorage.getItem(groupKey(code))
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

function notify(code, group) {
  const set = listeners.get(code)
  if (set) set.forEach((cb) => cb(group))
}

function write(group) {
  group.updatedAt = Date.now()
  localStorage.setItem(groupKey(group.code), JSON.stringify(group))
  notify(group.code, group) // other tabs get the "storage" event automatically
}

// Read → change → save. Throws if the group does not exist.
function update(code, change) {
  const c = normalizeCode(code)
  const group = read(c)
  if (!group) throw new Error('No group with that code')
  change(group)
  write(group)
  return group
}

function newMember(name) {
  return { name: name.trim(), cuisines: [], dietary: [], budget: BUDGET.default, ready: false }
}

// ---------- public API ----------

/** Create a group; the creator is host. Returns { code, memberId }. */
export function createGroup(name, start, hostName) {
  if (!name?.trim()) throw new Error('Please enter a group name')
  if (!hostName?.trim()) throw new Error('Please enter your name')

  let code = randomCode()
  while (read(code)) code = randomCode() // avoid the rare clash

  const memberId = randomMemberId()
  const group = {
    code,
    name: name.trim(),
    hostId: memberId,
    start,
    status: STATUS.LOBBY,
    members: { [memberId]: newMember(hostName) },
    shortlist: [],
    proposal: null,
    lastRejection: null,
    finalId: null,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  }
  write(group)
  sessionStorage.setItem(meKey(code), memberId)
  return { code, memberId }
}

/** Join a group still in the lobby. Returns memberId. */
export function joinGroup(code, name) {
  const c = normalizeCode(code)
  if (!name?.trim()) throw new Error('Please enter your name')

  const group = read(c)
  if (!group) throw new Error('No group with that code')
  if (group.status !== STATUS.LOBBY) throw new Error('This group has already started')
  if (Object.keys(group.members).length >= MAX_GROUP_SIZE) throw new Error('This group is full')

  const memberId = randomMemberId()
  group.members[memberId] = newMember(name)
  write(group)
  sessionStorage.setItem(meKey(c), memberId)
  return memberId
}

/** Read the group once, or null. */
export function getGroup(code) {
  return read(normalizeCode(code))
}

/** This tab's member ID for the group, or null. */
export function getMyMemberId(code) {
  return sessionStorage.getItem(meKey(normalizeCode(code)))
}

/** Members as an array: [{ id, name, cuisines, dietary, budget, ready }, ...] */
export function getMembers(group) {
  if (!group) return []
  return Object.entries(group.members).map(([id, m]) => ({ id, ...m }))
}

/** Call callback(group) now and on every change from any tab. Returns unsubscribe(). */
export function subscribeGroup(code, callback) {
  const c = normalizeCode(code)

  if (!listeners.has(c)) listeners.set(c, new Set())
  listeners.get(c).add(callback)

  const onStorage = (e) => {
    if (e.key === groupKey(c)) callback(e.newValue ? JSON.parse(e.newValue) : null)
  }
  window.addEventListener('storage', onStorage)

  callback(read(c))

  return () => {
    listeners.get(c)?.delete(callback)
    window.removeEventListener('storage', onStorage)
  }
}

/** prefs = { cuisines: [], dietary: [], budget: 20 }. Empty cuisines = no preference. Sets ready: true. */
export function savePreferences(code, memberId, prefs) {
  update(code, (g) => {
    const m = g.members[memberId]
    if (!m) throw new Error('You are not in this group')
    g.members[memberId] = {
      ...m,
      cuisines: prefs.cuisines ?? [],
      dietary: prefs.dietary ?? [],
      budget: prefs.budget ?? BUDGET.default,
      ready: true,
    }
  })
}

/** Host only: status → browsing. Needs 2+ members, all ready. */
export function startBrowsing(code, memberId) {
  update(code, (g) => {
    if (g.hostId !== memberId) throw new Error('Only the host can start')
    const members = Object.values(g.members)
    if (members.length < 2) throw new Error('Wait for at least one friend to join')
    if (!members.every((m) => m.ready)) throw new Error('Not everyone is ready yet')
    g.status = STATUS.BROWSING
  })
}

/** Add/remove from the shared shortlist (max 2). Returns the new shortlist. */
export function toggleShortlist(code, restaurantId) {
  const g = update(code, (g) => {
    if (g.shortlist.includes(restaurantId)) {
      g.shortlist = g.shortlist.filter((id) => id !== restaurantId)
    } else {
      if (g.shortlist.length >= 2) throw new Error('Shortlist is full. Remove one to add another.')
      g.shortlist.push(restaurantId)
    }
  })
  return g.shortlist
}

/** Propose a restaurant; proposer votes yes; status → voting. */
export function propose(code, memberId, restaurantId) {
  update(code, (g) => {
    if (!g.members[memberId]) throw new Error('You are not in this group')
    if (g.status === STATUS.VOTING) throw new Error('A vote is already happening')
    g.proposal = {
      restaurantId,
      by: memberId,
      votes: { [memberId]: { vote: 'yes', reason: '' } },
    }
    g.lastRejection = null
    g.status = STATUS.VOTING
  })
}

/** yes = true/false. All yes → confirmed. Any no → browsing + lastRejection. */
export function vote(code, memberId, yes, reason = '') {
  update(code, (g) => {
    if (!g.proposal) throw new Error('There is nothing to vote on')
    const m = g.members[memberId]
    if (!m) throw new Error('You are not in this group')

    if (!yes) {
      g.lastRejection = {
        memberId,
        name: m.name,
        restaurantId: g.proposal.restaurantId,
        reason: reason.trim(),
      }
      g.proposal = null
      g.status = STATUS.BROWSING
      return
    }

    g.proposal.votes[memberId] = { vote: 'yes', reason: '' }
    const allYes = Object.keys(g.members).every((id) => g.proposal.votes[id]?.vote === 'yes')
    if (allYes) {
      g.finalId = g.proposal.restaurantId
      g.status = STATUS.CONFIRMED
    }
  })
}

/** Forget this tab's membership (Create Another Group). */
export function leaveGroup(code) {
  sessionStorage.removeItem(meKey(normalizeCode(code)))
}