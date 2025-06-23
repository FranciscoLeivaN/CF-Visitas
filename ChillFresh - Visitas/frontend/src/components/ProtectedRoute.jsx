import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../utils/useAuth';

/**
 * Componente para proteger rutas que requieren autenticación
 * 
 * Verifica si el usuario está autenticado mediante JWT antes de permitir el acceso.
 * Si no está autenticado, guarda la URL actual y redirige al login.
 * 
 * @param {Object} props - Propiedades del componente
 * @param {JSX.Element} props.children - Componente hijo a renderizar si está autenticado
 * @returns {JSX.Element} El componente hijo o redirección al login
 */
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();
  
  // Mostrar un indicador de carga mientras se verifica la autenticación
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-lightgreen"></div>
      </div>
    );
  }
  
  // Si no está autenticado, redirigir al login con la ubicación actual como state
  if (!isAuthenticated) {
    return <Navigate to="/" state={{ from: location.pathname }} replace />;
  }
  
  // Si está autenticado, mostrar el componente hijo
  return children;
};

export default ProtectedRoute;
