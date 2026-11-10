// Owner: Malika
// export default function Home() {
//   return <div className="todo">Home screen (coming soon)</div>
// }

import { useNavigate } from 'react-router-dom'
import Header from '../components/Header'

export default function Home() {
  const nav = useNavigate()

  return (
    <>
      <Header logo />

      <div className="hero">
        <div className="hero-illustration">📍</div>
        <h1>Meet Me Halfway</h1>
        <p>
          Less debating, more dining. Find a restaurant
          everyone in your group can agree on.
        </p>
      </div>

      <div className="actions">
        <button
          className="btn"
          onClick={() => nav('/create')}
        >
          Create a Group
        </button>

        <button
          className="btn secondary"
          onClick={() => nav('/join')}
        >
          Join with Code
        </button>
      </div>
    </>
  )
}