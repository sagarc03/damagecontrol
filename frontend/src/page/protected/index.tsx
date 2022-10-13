import { usePocketBase } from '../../provider/pb'
import { useLocation, Navigate } from 'react-router-dom'

export function RequireAuth({ children }: { children: JSX.Element }) {
  const backend = usePocketBase()
  const location = useLocation()
  if (!backend.authStore.isValid) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }
  return children
}

export function AlreadyAuthenticated({ children }: { children: JSX.Element }) {
  const backend = usePocketBase()
  if (backend.authStore.isValid) {
    return <Navigate to="/" replace />
  }
  return children
}
