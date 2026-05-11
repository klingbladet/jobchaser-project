import { Navigate, Outlet } from 'react-router';
import { useAuthStore } from '../store/authStore';

export const ProtectedRoute = () => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  if (!isAuthenticated) {
    return <Navigate to="/signin" replace />;
  }

  return <Outlet />;
};
