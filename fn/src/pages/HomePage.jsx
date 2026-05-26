import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { mockMovies } from '../data/mockMovies'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

function HomePage() {
  const [movies, setMovies] = useState([])
  const [search, setSearch] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    fetchMovies()
  }, [search])

  const fetchMovies = async () => {
    try {
      const res = await axios.get(`${API_URL}/movies/?search=${search}`)
      if (res.data && res.data.length > 0) {
        setMovies(res.data)
        return
      }
    } catch (err) {
      console.error('API error, using mock data:', err)
    }
    // Fallback to mock data
    const term = search.toLowerCase()
    const filtered = mockMovies.filter((m) =>
      m.title.toLowerCase().includes(term)
    )
    setMovies(filtered)
  }

  return (
    <div>
      <input
        className="search-box"
        type="text"
        placeholder="Search movies by name..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <div className="movie-grid">
        {movies.map((movie) => (
          <div
            key={movie.id}
            className="movie-card"
            onClick={() => navigate(`/movie/${movie.id}`)}
          >
            <img src={movie.image_url} alt={movie.title} />
            <div className="movie-card-info">
              <h3>{movie.title}</h3>
              <p>{movie.genre} | {movie.duration}</p>
              <p>Rating: {movie.rating}</p>
            </div>
          </div>
        ))}
      </div>
      {movies.length === 0 && (
        <div className="empty-state">No movies found.</div>
      )}
    </div>
  )
}

export default HomePage
