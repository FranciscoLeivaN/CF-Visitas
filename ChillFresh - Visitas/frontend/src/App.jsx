import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Login from './components/Login';
import Home from './components/Home';
import './App.css';

/**
 * Componente ProtectedRoute - Protege rutas que requieren autenticación
 * 
 * Este componente verifica si el usuario está autenticado antes de permitir
 * el acceso a una ruta. Si no está autenticado, redirige al login.
 * 
 * @param {Object} props - Propiedades del componente
 * @param {JSX.Element} props.children - Componentes hijos a renderizar si la ruta está protegida
 * @returns {JSX.Element} El componente hijo o una redirección
 */
const ProtectedRoute = ({ children }) => {
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
  
  if (!isLoggedIn) {
    return <Navigate to="/" replace />;
  }
  
  return children;
};

/**
 * Componente principal de la aplicación
 * 
 * Configura el enrutamiento y maneja el estado de autenticación global.
 * 
 * @returns {JSX.Element} Componente principal con enrutamiento
 */
function App() {
  // Estado para controlar si el usuario está logueado
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  
  useEffect(() => {
    // Verifica si el usuario está logueado al cargar la aplicación
    const loggedIn = localStorage.getItem('isLoggedIn') === 'true';
    setIsLoggedIn(loggedIn);
    
    // Agregar un listener para cambios en el localStorage
    // Esto permite sincronizar el estado entre pestañas/ventanas
    const handleStorageChange = () => {
      const loggedIn = localStorage.getItem('isLoggedIn') === 'true';
      setIsLoggedIn(loggedIn);
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    // Limpieza del efecto para evitar memory leaks
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);
  
  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Ruta raíz: muestra login o redirige a home según el estado de autenticación */}
          <Route path="/" element={isLoggedIn ? <Navigate to="/home" /> : <Login />} />
          
          {/* Ruta protegida: solo accesible si el usuario está autenticado */}
          <Route 
            path="/home" 
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            } 
          />
          
          {/* Redirige cualquier ruta no definida al inicio */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
