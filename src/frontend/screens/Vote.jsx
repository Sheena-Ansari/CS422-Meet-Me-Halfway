// // Owner: Sheena
// export default function Vote() {
//   return <div className="todo">Vote screen (coming soon)</div>
// }


import { useState } from 'react'
import Header from '../components/Header'
import MemberAvatar from '../components/MemberAvatar'
import { PageState } from '../components/PageState'
import { useGroup } from '../../backend/useGroup'
import { vote, getMembers } from '../../backend/db'
import { evaluate } from '../../backend/matching'
import restaurants from '../../backend/data/restaurants.json'

export default function Vote() {
  const { code, group, memberId, loaded } = useGroup()
  const [reject, setReject] = useState(false)
  const [reason, setReason] = useState('')
  const [error, setError] = useState('')

  if (!loaded || !group) {
    return <PageState loaded={loaded} group={group} />
  }

  const proposal = group.proposal

  if (!proposal) {
    return <div className="empty">Waiting for a proposal…</div>
  }

  const raw = restaurants.find(
    r => r.id === proposal.restaurantId
  )
  const r = raw && evaluate(group, raw)
  const members = getMembers(group)

  const yes = members.filter(
    m => proposal.votes[m.id]?.vote === 'yes'
  ).length

  const voted = Boolean(proposal.votes[memberId])

  function cast(value) {
    try {
      vote(code, memberId, value, reason)
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <>
      <Header
        title="Proposed Restaurant"
        back={`/g/${code}/results`}
      />

      {r && (
        <>
          <div className="hero-photo">
            {r.photo ? (
              <img src={r.photo} alt={r.name} />
            ) : (
              '🍽️'
            )}
          </div>

          <h1>{r.name}</h1>
          <p className="muted">
            ★ {r.rating} · {r.cuisine} · {r.walkMin} min walk
            · ${r.priceMin}–${r.priceMax}
          </p>
        </>
      )}

      <h3>Group Response</h3>

      <div className="card">
        <div className="ready-title">
          {yes} of {members.length} Approved
        </div>

        <div className="progress">
          <div
            style={{
              width: `${members.length ? yes / members.length * 100 : 0}%`
            }}
          />
        </div>

        {members.map(member => {
          const approved =
            proposal.votes[member.id]?.vote === 'yes'

          return (
            <div className="member-row" key={member.id}>
              <MemberAvatar name={member.name} />

              <div className="grow">
                <strong>{member.name}</strong>
              </div>

              <span className={approved ? 'green' : 'muted'}>
                {approved ? '✓ Approved' : 'Waiting'}
              </span>
            </div>
          )
        })}
      </div>

      {error && <p className="error">{error}</p>}

      {voted ? (
        <div className="notice">
          Your approval is recorded. Waiting for the rest
          of the group.
        </div>
      ) : (
        <>
          {reject && (
            <label>
              Why not this one? (optional)
              <textarea
                rows={3}
                placeholder="Share a reason with the group"
                value={reason}
                onChange={e => setReason(e.target.value)}
              />
            </label>
          )}

          <button
            className="btn"
            onClick={() => cast(true)}
          >
            Works for Me ✓
          </button>

          <button
            className="btn secondary"
            onClick={() =>
              reject ? cast(false) : setReject(true)
            }
          >
            {reject ? 'Submit Rejection' : 'Not This One'}
          </button>

          {reject && (
            <button
              className="link-btn centered"
              onClick={() => setReject(false)}
            >
              Cancel
            </button>
          )}
        </>
      )}
    </>
  )
}
