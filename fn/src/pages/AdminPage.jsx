import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'
const ADMIN_SECRET = 'admin123'

function AdminPage() {
  const navigate = useNavigate()
  const [loggedIn, setLoggedIn] = useState(false)
  const [password, setPassword] = useState('')
  const [bookings, setBookings] = useState([])
  const [moviesWithBookings, setMoviesWithBookings] = useState([])
  const [activeTab, setActiveTab] = useState('bookings')

  const login = async () => {
    if (password !== ADMIN_SECRET) {
      alert('Invalid password')
      return
    }
    setLoggedIn(true)
    await fetchData()
  }

  const fetchData = async () => {
    try {
      const headers = { Authorization: `Bearer ${ADMIN_SECRET}` }
      const [bookingsRes, moviesRes] = await Promise.all([
        axios.get(`${API_URL}/admin/bookings`, { headers }),
        axios.get(`${API_URL}/admin/movies-with-bookings`, { headers })
      ])
      setBookings(bookingsRes.data)
      setMoviesWithBookings(moviesRes.data)
    } catch (err) {
      alert('Failed to fetch admin data')
    }
  }

  if (!loggedIn) {
    return (
      <div className="admin-login">
        <h3 style={{ marginBottom: '16px', color: '#e94560' }}>Admin Login</h3>
        <input
          type="password"
          placeholder="Enter admin password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && login()}
        />
        <button className="btn-primary" onClick={login} style={{ marginTop: 0 }}>
          Login
        </button>
        <button className="back-btn" onClick={() => navigate('/')} style={{ marginTop: '12px' }}>
          Back to Home
        </button>
      </div>
    )
  }

  return (
    <div className="admin-panel">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 style={{ color: '#e94560' }}>Admin Dashboard</h2>
        <button className="back-btn" onClick={() => navigate('/')}>Back to Home</button>
      </div>
      <div style={{ display: 'flex', gap: '12px', marginTop: '16px', marginBottom: '16px' }}>
        <button
          className="btn-primary"
          style={{ background: activeTab === 'bookings' ? '#e94560' : '#2a2a3e' }}
          onClick={() => setActiveTab('bookings')}
        >
          All Bookings
        </button>
        <button
          className="btn-primary"
          style={{ background: activeTab === 'movies' ? '#e94560' : '#2a2a3e' }}
          onClick={() => setActiveTab('movies')}
        >
          Movies & Revenue
        </button>
      </div>

      {activeTab === 'bookings' && (
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>User</th>
                <th>Email</th>
                <th>Movie ID</th>
                <th>Seats</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((b) => (
                <tr key={b.id}>
                  <td>{b.id}</td>
                  <td>{b.user_name}</td>
                  <td>{b.user_email}</td>
                  <td>{b.movie_id}</td>
                  <td>{(b.seats || []).join(', ')}</td>
                  <td>${b.total_amount}</td>
                  <td>{b.payment_status}</td>
                  <td>{b.created_at ? new Date(b.created_at).toLocaleString() : '-'}</td>
                </tr>
              ))}
              {bookings.length === 0 && (
                <tr><td colSpan="8" style={{ textAlign: 'center' }}>No bookings yet.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === 'movies' && (
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Movie</th>
                <th>Genre</th>
                <th>Price</th>
                <th>Bookings</th>
                <th>Total Revenue</th>
              </tr>
            </thead>
            <tbody>
              {moviesWithBookings.map((item) => (
                <tr key={item.movie.id}>
                  <td>{item.movie.title}</td>
                  <td>{item.movie.genre}</td>
                  <td>${item.movie.price}</td>
                  <td>{item.bookings.length}</td>
                  <td>${item.total_revenue}</td>
                </tr>
              ))}
              {moviesWithBookings.length === 0 && (
                <tr><td colSpan="5" style={{ textAlign: 'center' }}>No movies found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

export default AdminPage
