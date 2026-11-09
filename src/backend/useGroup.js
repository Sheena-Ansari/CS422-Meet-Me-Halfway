// Every in-group screen uses:
//   const { code, group, me, memberId, isHost, loaded } = useGroup()
// Owner: Abhijith.
//
// It also keeps every tab on the right screen:
//   status "voting"    → everyone goes to /vote
//   status "confirmed" → everyone goes to /done
//   status "browsing"  → anyone still on lobby/prefs/vote/done goes to /results
//   a tab that never joined this group → sent to /join
import { useEffect, useState } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { subscribeGroup, getMyMemberId } from './db.js'
import { STATUS } from './constants.js'

export function useGroup() {
  const { code } = useParams()
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const [state, setState] = useState({ loaded: false, group: null })

  useEffect(() => {
    if (!code) return
    return subscribeGroup(code, (group) => setState({ loaded: true, group }))
  }, [code])

  const { loaded, group } = state
  const memberId = code ? getMyMemberId(code) : null
  const me = group && memberId ? group.members[memberId] ?? null : null
  const isHost = Boolean(group && memberId && group.hostId === memberId)
  const status = group?.status

  useEffect(() => {
    if (!loaded || !group) return
    const base = `/g/${group.code}`

    if (!memberId) {
      navigate('/join', { replace: true })
      return
    }

    let target = null
    if (status === STATUS.VOTING && pathname !== `${base}/vote`) target = `${base}/vote`
    else if (status === STATUS.CONFIRMED && pathname !== `${base}/done`) target = `${base}/done`
    else if (status === STATUS.BROWSING && /\/(lobby|prefs|vote|done)$/.test(pathname)) target = `${base}/results`

    if (target) navigate(target, { replace: true })
  }, [loaded, group, status, memberId, pathname, navigate])

  // loaded && !group  → the code does not exist: show "No group with that code"
  return { code, group, memberId, me, isHost, loaded }
}