import LoginPage from './page/login'
import ForgotPasswordPage from './page/forgotpassword'
import RegisterPage from './page/register'
import Profile from './page/profile'
import Damage from './page/damage'
import Report from './page/report'

import { Routes, Route } from 'react-router-dom'
import { RequireAuth, AlreadyAuthenticated } from './page/protected'

const App = () => {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <RequireAuth>
            <Damage />
          </RequireAuth>
        }
      />

      <Route
        path="/report"
        element={
          <RequireAuth>
            <Report />
          </RequireAuth>
        }
      />

      <Route
        path="/profile"
        element={
          <RequireAuth>
            <Profile />
          </RequireAuth>
        }
      />

      <Route
        path="login"
        element={
          <AlreadyAuthenticated>
            <LoginPage />
          </AlreadyAuthenticated>
        }
      />

      <Route
        path="register"
        element={
          <AlreadyAuthenticated>
            <RegisterPage />
          </AlreadyAuthenticated>
        }
      />

      <Route
        path="forgotpassword"
        element={
          <AlreadyAuthenticated>
            <ForgotPasswordPage />
          </AlreadyAuthenticated>
        }
      />
    </Routes>
  )
}

export default App
