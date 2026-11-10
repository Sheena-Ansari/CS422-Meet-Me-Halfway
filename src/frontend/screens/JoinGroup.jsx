// // Owner: Malika
// export default function JoinGroup() {
//   return <div className="todo">JoinGroup screen (coming soon)</div>
// }

import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Header from '../components/Header'
import { joinGroup } from '../../backend/db'

export default function JoinGroup() {
  const nav = useNavigate()
  const [code, setCode] = useState('')
  const [name, setName] = useState('')
  const [error, setError] = useState('')

  function submit(e) {
    e.preventDefault()

    try {
      const groupCode = code.trim().toUpperCase()
      joinGroup(groupCode, name.trim())
      nav(`/g/${groupCode}/prefs`)
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <>
      <Header title="Join a Group" back="/" />

      <h1>Join Your Friends</h1>
      <p className="muted">
        Enter the six-character code your host shared.
      </p>

      <form onSubmit={submit} className="form">
        <label>
          Group Code
          <input
            required
            maxLength={6}
            placeholder="K7P2QX"
            value={code}
            onChange={e =>
              setCode(e.target.value.toUpperCase())
            }
          />
        </label>

        <label>
          Your Name
          <input
            required
            placeholder="Enter your name"
            value={name}
            onChange={e => setName(e.target.value)}
          />
        </label>

        {error && <p className="error">{error}</p>}

        <button className="btn" type="submit">
          Join Group
        </button>
      </form>
    </>
  )
}