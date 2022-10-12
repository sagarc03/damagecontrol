import {
  Routes,
  Route,
  Link,
  useNavigate,
  useLocation,
  Navigate,
  Outlet
} from 'react-router-dom'

const App: React.FC = (): React.ReactElement => {
  const navigate = useNavigate()
  const location = useLocation()
  return (
    <Routes>
      <Route
        element={
          <>
            <h1>Base layout</h1>
            <ul>
              <li>
                <Link to="/">Root</Link>
              </li>
              <li>
                <Link to="/login">Login</Link>
              </li>
            </ul>
            <Outlet />
          </>
        }
      >
        <Route path="/" element={<h1>Root</h1>} />
        <Route path="/login" element={<h1>Login</h1>} />
      </Route>
    </Routes>
  )
}

export default App
