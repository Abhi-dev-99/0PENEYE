import { useNavigate } from 'react-router-dom'

function Navbar() {
  const navigate = useNavigate()

  return (
    <nav className="navbar">
      <h1 onClick={() => navigate('/')}>CineBook</h1>
      <button className="admin-btn" onClick={() => navigate('/admin')}>
        Admin
      </button>
    </nav>
  )
}

export default Navbar
