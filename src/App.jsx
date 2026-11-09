// Routes for all 10 screens. Spec: docs/BUILD_PLAN.md → "Screen-by-screen spec".
import { Routes, Route, Navigate } from 'react-router-dom'

import Home from './frontend/screens/Home.jsx'
import CreateGroup from './frontend/screens/CreateGroup.jsx'
import JoinGroup from './frontend/screens/JoinGroup.jsx'
import Preferences from './frontend/screens/Preferences.jsx'
import Lobby from './frontend/screens/Lobby.jsx'
import Results from './frontend/screens/Results.jsx'
import Details from './frontend/screens/Details.jsx'
import Compare from './frontend/screens/Compare.jsx'
import Vote from './frontend/screens/Vote.jsx'
import Confirmed from './frontend/screens/Confirmed.jsx'

export default function App() {
  return (
    <div className="app">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/create" element={<CreateGroup />} />
        <Route path="/join" element={<JoinGroup />} />
        <Route path="/g/:code/prefs" element={<Preferences />} />
        <Route path="/g/:code/lobby" element={<Lobby />} />
        <Route path="/g/:code/results" element={<Results />} />
        <Route path="/g/:code/r/:id" element={<Details />} />
        <Route path="/g/:code/compare" element={<Compare />} />
        <Route path="/g/:code/vote" element={<Vote />} />
        <Route path="/g/:code/done" element={<Confirmed />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  )
}