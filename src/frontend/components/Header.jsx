// Owner: Malika

import { useNavigate } from 'react-router-dom'

export default function Header({ title, back, logo = false }) {
  const nav = useNavigate()

  return (
    <header className="topbar">
      {back && (
        <button
          className="iconbtn"
          onClick={() => nav(back)}
          aria-label="Back"
        >
          ‹
        </button>
      )}

      {logo ? (
        <div className="brand">
          <span className="brand-icon">♧</span>
          Meet Me Halfway
        </div>
      ) : (
        <h2>{title}</h2>
      )}
    </header>
  )
}
