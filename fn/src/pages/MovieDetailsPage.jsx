import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { mockMovies } from '../data/mockMovies'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

function MovieDetailsPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [movie, setMovie] = useState(null)

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

  if (!movie) return <div className="empty-state">Loading...</div>

  return (
    <div>
      <button className="back-btn" onClick={() => navigate('/')}>Back</button>
      <div className="movie-detail">
        <img src={movie.image_url} alt={movie.title} onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/500x750/2a2a3e/a0a0b0?text=No+Image' }} />
        <div className="movie-detail-info">
          <h2>{movie.title}</h2>
          <p><strong>Genre:</strong> {movie.genre}</p>
          <p><strong>Duration:</strong> {movie.duration}</p>
          <p><strong>Rating:</strong> {movie.rating}</p>
          <p><strong>Price:</strong> ${movie.price}</p>
          <p>{movie.description}</p>
          <button className="btn-primary" onClick={() => navigate(`/movie/${id}/seats`)}>
            Book Tickets
          </button>
        </div>
      </div>
    </div>
  )
}

export default MovieDetailsPage
