// Owner: Sheena

import { useNavigate } from 'react-router-dom'

export default function RestaurantCard({
  restaurant: r,
  code,
  saved,
  onToggle
}) {
  const nav = useNavigate()

  return (
    <article className="restaurant-card">
      <button
        className="restaurant-main"
        onClick={() => nav(`/g/${code}/r/${r.id}`)}
      >
        <div className="food-photo">
          {r.photo ? (
            <img src={r.photo} alt={r.name} />
          ) : (
            <span>🍽️</span>
          )}
        </div>

        <div className="restaurant-info">
          <strong>{r.name}</strong>

          <div>
            ★ {r.rating} ({r.reviewCount}) ·
            ${r.priceMin}–${r.priceMax}
          </div>

          <small>
            {r.cuisine} ·
            {r.dietary?.halal ? ' Halal options ·' : ''}
            {r.dietary?.vegetarian ? ' Vegetarian options' : ''}
          </small>

          <small>
            ◷ {r.miles?.toFixed(1)} mi
            ({r.walkMin} min walk)
          </small>

          <span className="badge">
            {r.badge || `${r.matchPct}% match`}
          </span>
        </div>
      </button>

      <button
        className="save"
        title="Toggle shortlist"
        aria-label="Toggle shortlist"
        onClick={() => onToggle(r.id)}
      >
        {saved ? '♥' : '♡'}
      </button>
    </article>
  )
}
