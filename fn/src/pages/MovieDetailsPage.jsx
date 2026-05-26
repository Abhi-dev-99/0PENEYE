import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import axios from 'axios'

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
      setMovie(res.data)
    } catch (err) {
      console.error(err)
    }
  }

  if (!movie) return <div className="empty-state">Loading...</div>

  return (
    <div>
      <button className="back-btn" onClick={() => navigate('/')}>Back</button>
      <div className="movie-detail">
        <img src={movie.image_url} alt={movie.title} />
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
