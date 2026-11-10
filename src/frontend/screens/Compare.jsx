// // Owner: Sheena
// export default function Compare() {
//   return <div className="todo">Compare screen (coming soon)</div>
// }


import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Header from '../components/Header'
import { PageState } from '../components/PageState'
import { useGroup } from '../../backend/useGroup'
import { propose } from '../../backend/db'
import { evaluate } from '../../backend/matching'
import restaurants from '../../backend/data/restaurants.json'

export default function Compare() {
  const { code, group, memberId, loaded } = useGroup()
  const nav = useNavigate()
  const [error, setError] = useState('')

  if (!loaded || !group) {
    return <PageState loaded={loaded} group={group} />
  }

  const items = group.shortlist
    .map(id => restaurants.find(r => r.id === id))
    .filter(Boolean)
    .map(r => evaluate(group, r))

  function submit(id) {
    try {
      propose(code, memberId, id)
    } catch (err) {
      setError(err.message)
    }
  }

  const rows = [
    ['Price', r => `$${r.priceMin}–$${r.priceMax}`],
    ['Distance', r => `${r.miles?.toFixed(1)} mi`],
    ['Walking Time', r => `${r.walkMin} min`],
    ['Cuisine', r => r.cuisine],
    ['Halal Options', r => r.dietary?.halal ? '✓' : '×'],
    ['Vegetarian', r => r.dietary?.vegetarian ? '✓' : '×'],
    ['Vegan', r => r.dietary?.vegan ? '✓' : '×'],
    ['Group Match', r => `${r.matchPct}%`]
  ]

  return (
    <>
      <Header title="Compare" back={`/g/${code}/results`} />

      {items.length !== 2 ? (
        <div className="empty">
          <p>Shortlist two restaurants to compare.</p>
          <button
            className="btn"
            onClick={() => nav(`/g/${code}/results`)}
          >
            Back to Restaurants
          </button>
        </div>
      ) : (
        <>
          <div className="compare-grid">
            <div className="compare-head" />

            {items.map(r => (
              <div className="compare-head" key={r.id}>
                <div className="compare-image">
                  {r.photo ? (
                    <img src={r.photo} alt={r.name} />
                  ) : (
                    '🍽️'
                  )}
                </div>
                <strong>{r.name}</strong>
              </div>
            ))}

            {rows.map(([label, getValue]) => (
              <div className="compare-row" key={label} style={{display:'contents'}}>
                <div className="compare-cell label-cell">
                  {label}
                </div>
                {items.map(r => (
                  <div className="compare-cell" key={r.id}>
                    {getValue(r)}
                  </div>
                ))}
              </div>
            ))}
          </div>

          {error && <p className="error">{error}</p>}

          <div className="compare-actions">
            {items.map(r => (
              <button
                key={r.id}
                className="btn"
                onClick={() => submit(r.id)}
              >
                Propose {r.name}
              </button>
            ))}
          </div>
        </>
      )}
    </>
  )
}
