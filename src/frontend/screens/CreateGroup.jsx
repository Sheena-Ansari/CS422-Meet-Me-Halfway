// // Owner: Malika
// export default function CreateGroup() {
//   return <div className="todo">CreateGroup screen (coming soon)</div>
// }

import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Header from '../components/Header'
import { START_LOCATIONS } from '../../backend/constants'
import { createGroup } from '../../backend/db'

export default function CreateGroup() {
  const nav = useNavigate()
  const [name, setName] = useState('')
  const [host, setHost] = useState('')
  const [start, setStart] = useState(0)
  const [error, setError] = useState('')

  function submit(e) {
    e.preventDefault()

    try {
      const result = createGroup(
        name.trim(),
        START_LOCATIONS[start],
        host.trim()
      )

      nav(`/g/${result.code}/prefs`)
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <>
      <Header title="Create a Group" back="/" />

      <h1>Welcome!</h1>
      <p className="muted">
        Start a group and invite your friends with a code.
      </p>

      <form onSubmit={submit} className="form">
        <label>
          Group Name
          <input
            required
            placeholder="Lunch After Class"
            value={name}
            onChange={e => setName(e.target.value)}
          />
        </label>

        <label>
          Starting Location
          <select
            value={start}
            onChange={e => setStart(Number(e.target.value))}
          >
            {START_LOCATIONS.map((location, i) => (
              <option key={i} value={i}>
                {location.label}
              </option>
            ))}
          </select>
        </label>

        <label>
          Your Name
          <input
            required
            placeholder="Enter your name"
            value={host}
            onChange={e => setHost(e.target.value)}
          />
        </label>

        {error && <p className="error">{error}</p>}

        <button className="btn" type="submit">
          Get Started
        </button>
      </form>
    </>
  )
}