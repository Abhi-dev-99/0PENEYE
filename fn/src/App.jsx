import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import HomePage from './pages/HomePage'
import MovieDetailsPage from './pages/MovieDetailsPage'
import SeatSelectionPage from './pages/SeatSelectionPage'
import BookingSummaryPage from './pages/BookingSummaryPage'
import AdminPage from './pages/AdminPage'

function App() {
  return (
    <div>
      <Navbar />
      <div className="container">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/movie/:id" element={<MovieDetailsPage />} />
          <Route path="/movie/:id/seats" element={<SeatSelectionPage />} />
          <Route path="/summary" element={<BookingSummaryPage />} />
          <Route path="/admin" element={<AdminPage />} />
        </Routes>
      </div>
    </div>
  )
}

export default App
