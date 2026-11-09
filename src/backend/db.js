// Group storage + live sync between browser tabs. Owner: Abhijith.
// Spec: docs/BUILD_PLAN.md → "The group record" and "Functions in db.js".
// Groups live in localStorage (mmh:group:CODE); each tab's member ID in sessionStorage (mmh:me:CODE).
// Screens only ever call these functions, never localStorage directly.

/** Create a group; the creator is host. Returns { code, memberId }. */
export function createGroup(name, start, hostName) { throw new Error('createGroup: TODO') }

/** Join a group still in the lobby. Returns memberId. Throws 'No group with that code' / 'This group has already started'. */
export function joinGroup(code, name) { throw new Error('joinGroup: TODO') }

/** Read the group once, or null. */
export function getGroup(code) { return null }

/** This tab's member ID for the group, or null. */
export function getMyMemberId(code) { return null }

/** Call callback(group) now and on every change from any tab. Returns unsubscribe(). */
export function subscribeGroup(code, callback) { callback(getGroup(code)); return () => {} }

/** prefs = { cuisines: [], dietary: [], budget: 20 }. Empty cuisines = no preference. Sets ready: true. */
export function savePreferences(code, memberId, prefs) {}

/** Host only: status → browsing. */
export function startBrowsing(code, memberId) {}

/** Add/remove from the shared shortlist (max 2). Returns the new shortlist. */
export function toggleShortlist(code, restaurantId) { return [] }

/** Propose a restaurant; proposer votes yes; status → voting. */
export function propose(code, memberId, restaurantId) {}

/** yes = true/false. All yes → confirmed. Any no → browsing + lastRejection { memberId, restaurantId, reason }. */
export function vote(code, memberId, yes, reason = '') {}

/** Forget this tab's membership (Create Another Group). */
export function leaveGroup(code) {}