// // Owner: Malika
// export default function Preferences() {
//   return <div className="todo">Preferences screen (coming soon)</div>
// }

import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import Header from '../components/Header'
import Chip from '../components/Chip'
import PageState from '../components/PageState'
import { CUISINES, DIETARY } from '../../backend/constants'
import { savePreferences } from '../../backend/db'
import { useGroup } from '../../backend/useGroup'

export default function Preferences() {
  const { code } = useParams()
  const nav = useNavigate()
  const { group, memberId } = useGroup(code)
  const member = group?.members?.[memberId]

  const [cuisines, setCuisines] = useState(
    member?.cuisines || []
  )
  const [dietary, setDietary] = useState(
    member?.dietary || []
  )
  const [budget, setBudget] = useState(
    member?.budget || 20
  )

  function toggleCuisine(value) {
    setCuisines(current =>
      current.includes(value)
        ? current.filter(x => x !== value)
        : current.length < 3
          ? [...current, value]
          : current
    )
  }

  function toggleDietary(value) {
    setDietary(current =>
      current.includes(value)
        ? current.filter(x => x !== value)
        : [...current, value]
    )
  }

  function submit() {
    savePreferences(code, memberId, {
      cuisines,
      dietary,
      budget
    })

    nav(`/g/${code}/lobby`)
  }

  if (!group || !member) {
    return <PageState message="Loading preferences..." />
  }

  return (
    <>
      <Header
        title={`${member.name}'s Preferences`}
        back={`/g/${code}/lobby`}
      />

      <div className="form">
        <label>
          Starting Location
          <div className="info-box">
            📍 {group.start.label}
          </div>
        </label>

        <section>
          <h3>Cuisine (select up to 3)</h3>
          <div className="chip-list">
            {CUISINES.map(cuisine => (
              <Chip
                key={cuisine}
                selected={cuisines.includes(cuisine)}
                onClick={() => toggleCuisine(cuisine)}
              >
                {cuisine}
              </Chip>
            ))}
          </div>
        </section>

        <section>
          <h3>Dietary Restrictions</h3>
          <div className="chip-list">
            {DIETARY.map(item => (
              <Chip
                key={item}
                selected={dietary.includes(item)}
                onClick={() => toggleDietary(item)}
              >
                {item}
              </Chip>
            ))}
          </div>
        </section>

        <section>
          <h3>Max Budget</h3>
          <h2>${budget}</h2>
          <input
            type="range"
            min="5"
            max="40"
            step="5"
            value={budget}
            onChange={e =>
              setBudget(Number(e.target.value))
            }
          />
        </section>

        <button className="btn" onClick={submit}>
          Save Preferences
        </button>
      </div>
    </>
  )
}