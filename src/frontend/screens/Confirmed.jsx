// // Owner: Sheena
// export default function Confirmed() {
//   return <div className="todo">Confirmed screen (coming soon)</div>
// }


import { useNavigate } from 'react-router-dom'
import Header from '../components/Header'
import { PageState } from '../components/PageState'
import { useGroup } from '../../backend/useGroup'
import { leaveGroup } from '../../backend/db'
import { evaluate } from '../../backend/matching'
import restaurants from '../../backend/data/restaurants.json'

export default function Confirmed() {
  const { code, group, loaded } = useGroup()
  const nav = useNavigate()

  if (!loaded || !group) {
    return <PageState loaded={loaded} group={group} />
  }

  const raw = restaurants.find(r => r.id === group.finalId)
  const r = raw && evaluate(group, raw)

  function startAgain() {
    leaveGroup(code)
    nav('/')
  }

  return (
    <>
      <Header title="Group Decision" />

      <div className="success-icon">🎉</div>

      <h1 className="centered">
        Group Decision Confirmed!
      </h1>

      {r ? (
        <>
          <h2 className="centered">{r.name}</h2>

          <div className="hero-photo">
            {r.photo ? (
              <img src={r.photo} alt={r.name} />
            ) : (
              '🍽️'
            )}
          </div>

          <div className="confirmation-info">
            <p>📍 {r.address}</p>
            <p>
              🚶 {r.walkMin} min walk from {group.start.label}
            </p>
          </div>

          <a
            className="map-link"
            href={r.mapsUrl}
            target="_blank"
            rel="noreferrer"
          >
            View on Google Maps ↗
          </a>
        </>
      ) : (
        <p>Restaurant information unavailable.</p>
      )}

      <h3 className="centered">
        Thanks for everyone's input!
      </h3>

      <p className="muted centered">
        Your group is all set. Enjoy your meal!
      </p>

      <button className="btn" onClick={startAgain}>
        Create Another Group
      </button>
    </>
  )
}
