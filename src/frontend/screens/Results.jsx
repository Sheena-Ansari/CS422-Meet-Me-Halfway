// // Owner: Sheena
// export default function Results() {
//   return <div className="todo">Results screen (coming soon)</div>
// }


import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Header from '../components/Header'
import RestaurantCard from '../components/RestaurantCard'
import { PageState } from '../components/PageState'
import { useGroup } from '../../backend/useGroup'
import { toggleShortlist } from '../../backend/db'
import {
  getResults,
  whyNoResults,
  groupBudget
} from '../../backend/matching'
import restaurants from '../../backend/data/restaurants.json'

// Turns { distance: 0, budget: 9, dietary: 3 } into "Budget removed 9 places, Dietary needs removed 3 places."
function whyText(counts) {
  const labels = { budget: 'Budget', dietary: 'Dietary needs', distance: 'Distance' }
  const parts = Object.entries(counts)
    .filter(([, n]) => n > 0)
    .sort((a, b) => b[1] - a[1])
    .map(([k, n]) => `${labels[k]} removed ${n} place${n === 1 ? '' : 's'}`)
  return parts.length ? parts.join(', ') + '.' : ''
}

export default function Results() {
  const { code, group, loaded } = useGroup()
  const nav = useNavigate()
  const [sort, setSort] = useState('match')
  const [error, setError] = useState('')

  if (!loaded || !group) {
    return <PageState loaded={loaded} group={group} />
  }

  const results = getResults(group, restaurants, sort)

  function toggle(id) {
    try {
      toggleShortlist(code, id)
      setError('')
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <>
      <Header title="Restaurants" back={`/g/${code}/lobby`} />

      <div className="filter-row">
        <span className="chip selected">Within 2 mi</span>
        <span className="chip">
          Budget ≤ ${groupBudget(group)}
        </span>
        <span className="chip">Dietary needs</span>
      </div>

      <div className="sort-row">
        <span>{results.length} matching restaurants</span>
        <select
          value={sort}
          onChange={e => setSort(e.target.value)}
          aria-label="Sort restaurants"
        >
          <option value="match">Best Match</option>
          <option value="closest">Closest</option>
          <option value="cheapest">Cheapest</option>
        </select>
      </div>

      {group.lastRejection && (
        <div className="notice">
          {group.lastRejection.name} declined the last proposal.
          {group.lastRejection.reason &&
            ` Reason: ${group.lastRejection.reason}`}
        </div>
      )}

      {error && <p className="error">{error}</p>}

      {results.length > 0 ? (
        results.map(restaurant => (
          <RestaurantCard
            key={restaurant.id}
            restaurant={restaurant}
            code={code}
            saved={group.shortlist.includes(restaurant.id)}
            onToggle={toggle}
          />
        ))
      ) : (
        <div className="empty">
          <h3>No places fit everyone yet</h3>
          <p>Try adjusting the group's preferences.</p>
          <p className="muted">{whyText(whyNoResults(group, restaurants))}</p>
        </div>
      )}

      <button
        className="btn bottom-btn"
        disabled={group.shortlist.length !== 2}
        onClick={() => nav(`/g/${code}/compare`)}
      >
        Compare ({group.shortlist.length}/2)
      </button>
    </>
  )
}
