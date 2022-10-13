import LoginPage from './page/login'
import { Routes, Route, useNavigate } from 'react-router-dom'
import { RequireAuth, AlreadyAuthenticated } from './page/protected'

import { usePocketBase } from './provider/pb'
import { Button } from '@chakra-ui/react'

const App = () => {
  const backend = usePocketBase()
  const navigate = useNavigate()
  return (
    <Routes>
      <Route
        path="/"
        element={
          <RequireAuth>
            <>
              <h1>Protected page</h1>
              <Button
                onClick={() => {
                  backend.authStore.clear()
                  navigate('/')
                }}
              >
                Logout
              </Button>
            </>
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
    </Routes>
  )
}

export default App
