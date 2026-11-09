// Every in-group screen uses: const { code, group, me, isHost } = useGroup()
// Owner: Abhijith.
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { subscribeGroup, getMyMemberId } from './db.js'

export function useGroup() {
  const { code } = useParams()
  const [group, setGroup] = useState(null)

  useEffect(() => {
    if (!code) return
    return subscribeGroup(code, setGroup)
  }, [code])

  const memberId = code ? getMyMemberId(code) : null
  const me = group && memberId ? group.members[memberId] ?? null : null
  const isHost = Boolean(group && memberId && group.hostId === memberId)

  // TODO(Abhijith): send the tab to the right screen when group.status changes.
  return { code, group, memberId, me, isHost }
}