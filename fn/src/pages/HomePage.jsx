import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

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
      setMovies(res.data)
    } catch (err) {
      console.error(err)
    }
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
