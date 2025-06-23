import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import Home from './components/Home';
import ProtectedRoute from './components/ProtectedRoute';
import { AuthProvider } from './utils/AuthContext';
import './App.css';

// El componente ProtectedRoute ahora está en su propio archivo

/**
 * Componente principal de la aplicación
 * 
 * Configura el enrutamiento y maneja el estado de autenticación global.
 * 
 * @returns {JSX.Element} Componente principal con enrutamiento
 */
function App() {
  // Ya no necesitamos manejar el estado de autenticación aquí
  // El contexto AuthContext se encarga de esto
  
  return (
    <Router>
      <AuthProvider>
        <div className="App">
          <Routes>
            {/* Ruta raíz: muestra siempre el login */}
            <Route path="/" element={<Login />} />
            
            {/* Ruta protegida: solo accesible si el usuario está autenticado con JWT válido */}
            <Route 
              path="/home" 
              element={
                <ProtectedRoute>
                  <Home />
                </ProtectedRoute>
              } 
            />
            
            {/* Redirige cualquier ruta no definida al inicio */}
            <Route path="*" element={<Login />} />
          </Routes>
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
