import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { mockMovies } from '../data/mockMovies'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

const ROWS = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H']
const COLS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

function SeatSelectionPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [movie, setMovie] = useState(null)
  const [selectedSeats, setSelectedSeats] = useState([])

  useEffect(() => {
    fetchMovie()
  }, [id])

  const fetchMovie = async () => {
    try {
      const res = await axios.get(`${API_URL}/movies/${id}`)
      if (res.data) {
        setMovie(res.data)
        return
      }
    } catch (err) {
      console.error('API error, using mock data:', err)
    }
    // Fallback to mock data
    const found = mockMovies.find((m) => m.id === Number(id))
    setMovie(found || null)
  }

  const toggleSeat = (seatId) => {
    if (movie?.booked_seats?.includes(seatId)) return
    if (selectedSeats.includes(seatId)) {
      setSelectedSeats(selectedSeats.filter((s) => s !== seatId))
    } else {
      setSelectedSeats([...selectedSeats, seatId])
    }
  }

  const handleContinue = () => {
    if (selectedSeats.length === 0) {
      alert('Please select at least one seat')
      return
    }
    navigate('/summary', {
      state: { movie, selectedSeats }
    })
  }

  if (!movie) return <div className="empty-state">Loading...</div>

  return (
    <div>
      <button className="back-btn" onClick={() => navigate(`/movie/${id}`)}>Back</button>
      <h2 style={{ textAlign: 'center', marginBottom: '8px' }}>{movie.title}</h2>
      <p style={{ textAlign: 'center', color: '#a0a0b0', marginBottom: '24px' }}>
        Select your seats
      </p>
      <div className="seat-selection">
        <div className="screen">SCREEN</div>
        <div className="seats-grid">
          {ROWS.map((row) =>
            COLS.map((col) => {
              const seatId = `${row}${col}`
              const isBooked = movie.booked_seats?.includes(seatId)
              const isSelected = selectedSeats.includes(seatId)
              return (
                <button
                  key={seatId}
                  className={`seat ${isBooked ? 'booked' : ''} ${isSelected ? 'selected' : ''}`}
                  onClick={() => toggleSeat(seatId)}
                  disabled={isBooked}
                >
                  {seatId}
                </button>
              )
            })
          )}
        </div>
        <div className="legend">
          <div className="legend-item">
            <div className="legend-box" style={{ background: '#1a1a2e' }}></div>
            Available
          </div>
          <div className="legend-item">
            <div className="legend-box" style={{ background: '#e94560' }}></div>
            Selected
          </div>
          <div className="legend-item">
            <div className="legend-box" style={{ background: '#333' }}></div>
            Booked
          </div>
        </div>
        <div style={{ textAlign: 'center', marginTop: '24px' }}>
          <p style={{ marginBottom: '12px' }}>
            Selected: {selectedSeats.join(', ') || 'None'} | 
            Total: ${selectedSeats.length * movie.price}
          </p>
          <button className="btn-primary" onClick={handleContinue}>
            Continue
          </button>
        </div>
      </div>
    </div>
  )
}

export default SeatSelectionPage
