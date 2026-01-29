import { Routes, Route} from 'react-router-dom'
import Home from './pages/Home'
import Starting5 from './pages/Starting5'
import Leaderboard from './pages/Leaderboard'

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path = "/starting5" element = {<Starting5 />} />
        <Route path="/leaderboard" element={<Leaderboard />} />
      </Routes>
    </>
  )
}

export default App
