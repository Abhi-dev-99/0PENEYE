import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

function BookingSummaryPage() {
  const location = useLocation()
  const navigate = useNavigate()
  const { movie, selectedSeats } = location.state || {}
  const [userName, setUserName] = useState('')
  const [userEmail, setUserEmail] = useState('')
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)

  if (!movie) {
    return (
      <div className="empty-state">
        <p>No booking data found.</p>
        <button className="btn-primary" onClick={() => navigate('/')}>Go Home</button>
      </div>
    )
  }

  const totalAmount = selectedSeats.length * movie.price

  const handlePayment = async () => {
    if (!userName.trim() || !userEmail.trim()) {
      alert('Please enter your name and email')
      return
    }
    setLoading(true)
    try {
      // Create booking
      const bookingRes = await axios.post(`${API_URL}/bookings/`, {
        movie_id: movie.id,
        user_name: userName,
        user_email: userEmail,
        seats: selectedSeats,
        total_amount: totalAmount
      })

      // Process payment
      await axios.post(`${API_URL}/bookings/payment`, {
        booking_id: bookingRes.data.id
      })

      setSuccess(true)
    } catch (err) {
      alert(err.response?.data?.detail || 'Payment failed')
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="success-message">
        <h2>Booking Successful!</h2>
        <p>Thank you, {userName}. Your seats {selectedSeats.join(', ')} for {movie.title} have been booked.</p>
        <button className="btn-primary" onClick={() => navigate('/')} style={{ marginTop: '24px' }}>
          Back to Home
        </button>
      </div>
    )
  }

  return (
    <div>
      <button className="back-btn" onClick={() => navigate(`/movie/${movie.id}/seats`)}>Back</button>
      <div className="summary-box">
        <h3>Booking Summary</h3>
        <p><strong>Movie:</strong> {movie.title}</p>
        <p><strong>Seats:</strong> {selectedSeats.join(', ')}</p>
        <p><strong>Price per ticket:</strong> ${movie.price}</p>
        <p><strong>Total amount:</strong> ${totalAmount}</p>
        <hr style={{ borderColor: '#2a2a3e', margin: '16px 0' }} />
        <input
          className="search-box"
          style={{ marginBottom: '12px' }}
          type="text"
          placeholder="Your Name"
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
        />
        <input
          className="search-box"
          style={{ marginBottom: '16px' }}
          type="email"
          placeholder="Your Email"
          value={userEmail}
          onChange={(e) => setUserEmail(e.target.value)}
        />
        <button className="btn-primary" onClick={handlePayment} disabled={loading}>
          {loading ? 'Processing...' : 'Pay Now'}
        </button>
      </div>
    </div>
  )
}

export default BookingSummaryPage
