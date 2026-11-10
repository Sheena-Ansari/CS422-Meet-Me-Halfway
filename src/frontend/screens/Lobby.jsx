// // Owner: Malika
// export default function Lobby() {
//   return <div className="todo">Lobby screen (coming soon)</div>
// }

import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import Header from '../components/Header'
import MemberAvatar from '../components/MemberAvatar'
import PageState from '../components/PageState'
import { useGroup } from '../../backend/useGroup'
import { startBrowsing } from '../../backend/db'
import { groupBudget } from '../../backend/matching'

export default function Lobby() {
  const { code } = useParams()
  const nav = useNavigate()
  const { group, memberId } = useGroup(code)
  const [error, setError] = useState('')

  if (!group) {
    return <PageState message="Loading group..." />
  }

  const members = Object.entries(group.members)
  const ready = members.filter(([, m]) => m.ready).length
  const isHost = memberId === group.hostId
  const allReady = ready === members.length

  function findRestaurants() {
    try {
      startBrowsing(code, memberId)
      nav(`/g/${code}/results`)
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <>
      <Header title="Group Preferences" />

      <div className="card">
        <h3>{ready} of {members.length} Ready</h3>
        <progress
          value={ready}
          max={members.length}
        />
      </div>

      <h3>Group Details</h3>

      <div className="card">
        <p><strong>Group Name</strong></p>
        <p>{group.name}</p>

        <p><strong>Location</strong></p>
        <p>{group.start.label}</p>

        <p><strong>Budget</strong></p>
        <p>Up to ${groupBudget(group)}</p>

        <p><strong>Group Code</strong></p>
        <h2>{code}</h2>
      </div>

      <h3>Members' Preferences</h3>

      <div className="card">
        {members.map(([id, member]) => (
          <div className="member-row" key={id}>
            <MemberAvatar name={member.name} />

            <div>
              <strong>{member.name}</strong>
              <p className="muted">
                {member.cuisines?.join(', ') || 'No cuisine preference'}
              </p>
              <p className="muted">
                {member.dietary?.join(', ') || 'No restrictions'}
              </p>
            </div>

            <span>
              {member.ready ? '✓' : 'Waiting'}
            </span>
          </div>
        ))}
      </div>

      {error && <p className="error">{error}</p>}

      {isHost ? (
        <button
          className="btn"
          disabled={!allReady || members.length < 2}
          onClick={findRestaurants}
        >
          Find Restaurants
        </button>
      ) : (
        <p className="muted">
          Waiting for the host to find restaurants...
        </p>
      )}

      <button
        className="btn secondary"
        onClick={() => nav(`/g/${code}/prefs`)}
      >
        Edit My Preferences
      </button>
    </>
  )
}