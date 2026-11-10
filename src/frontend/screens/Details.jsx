// // Owner: Sheena
// export default function Details() {
//   return <div className="todo">Details screen (coming soon)</div>
// }

import { useState } from 'react'
import { useParams } from 'react-router-dom'
import Header from '../components/Header'
import { PageState } from '../components/PageState'
import { useGroup } from '../../backend/useGroup'
import { toggleShortlist, propose } from '../../backend/db'
import { evaluate } from '../../backend/matching'
import restaurants from '../../backend/data/restaurants.json'

export default function Details() {
  const { id } = useParams()
  const { code, group, memberId, loaded } = useGroup()
  const [tab, setTab] = useState('overview')
  const [error, setError] = useState('')

  if (!loaded || !group) {
    return <PageState loaded={loaded} group={group} />
  }

  const raw = restaurants.find(r => r.id === id)

  if (!raw) {
    return <div className="empty">Restaurant not found.</div>
  }

  const r = evaluate(group, raw)
  const saved = group.shortlist.includes(id)

  function action(fn) {
    try {
      fn()
      setError('')
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <>
      <Header
        title="Restaurant Details"
        back={`/g/${code}/results`}
      />

      <div className="hero-photo">
        {r.photo ? (
          <img src={r.photo} alt={r.name} />
        ) : (
          <span>🍽️</span>
        )}
      </div>

      <h1 className="restaurant-title">{r.name}</h1>

      <p className="muted">
        ★ {r.rating} ({r.reviewCount}) · {r.cuisine}
      </p>

      <div className="stat-row">
        <div>
          <strong>📍 {r.miles?.toFixed(1)} mi</strong>
          <small>{r.walkMin} min walk</small>
        </div>

        <div>
          <strong className={r.openNow ? 'green' : 'error'}>
            {r.openNow ? 'Open' : 'Closed'}
          </strong>
          <small>
            {r.hours?.open} – {r.hours?.close}
          </small>
        </div>

        <div>
          <strong>${r.priceMin}–${r.priceMax}</strong>
          <small>per person</small>
        </div>
      </div>

      <div className="tabs">
        <button
          className={tab === 'overview' ? 'active' : ''}
          onClick={() => setTab('overview')}
        >
          Overview
        </button>

        <button
          className={tab === 'menu' ? 'active' : ''}
          onClick={() => setTab('menu')}
        >
          Menu
        </button>
      </div>

      {tab === 'overview' ? (
        <>
          <h3>About</h3>
          <p>{r.about}</p>

          <h3>Dietary Accommodations</h3>
          <div className="chips">
            {Object.entries(r.dietary || {}).map(([key, value]) => (
              <span
                key={key}
                className={`diet-tag ${value ? 'green' : 'muted'}`}
              >
                {value ? '✓' : '×'} {key}
              </span>
            ))}
          </div>

          <h3>Group Match: {r.matchPct}%</h3>
          <p className="muted">{r.badge}</p>

          {r.fans?.length > 0 && (
            <p>{r.fans.join(', ')} prefer this cuisine.</p>
          )}
        </>
      ) : (
        <>
          <h3>Menu Highlights</h3>
          {r.menu?.map((item, index) => (
            <div className="menu-row" key={index}>
              <span>{item.item}</span>
              <strong>${item.price}</strong>
            </div>
          ))}
        </>
      )}

      <a
        className="map-link"
        href={r.mapsUrl}
        target="_blank"
        rel="noreferrer"
      >
        View on Google Maps ↗
      </a>

      {error && <p className="error">{error}</p>}

      <button
        className="btn secondary"
        onClick={() => action(() => toggleShortlist(code, id))}
      >
        {saved ? 'Remove from Shortlist' : 'Add to Shortlist'}
      </button>

      <button
        className="btn"
        onClick={() => action(() => propose(code, memberId, id))}
      >
        Propose to Group
      </button>
    </>
  )
}
