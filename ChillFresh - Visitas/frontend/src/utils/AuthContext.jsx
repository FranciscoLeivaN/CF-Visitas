import { createContext, useState, useEffect } from 'react';
import { logout } from '../api';
import { isAuthenticated as checkAuthentication, getAuthUser } from '../utils/auth';

// Crear el contexto de autenticación
export const AuthContext = createContext(null);

/**
 * Proveedor de autenticación para toda la aplicación
 * Gestiona el estado de autenticación y proporciona funciones útiles
 */
export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Verifica la autenticación al cargar el componente
  useEffect(() => {
    const checkAuth = () => {
      const authenticated = checkAuthentication();
      setIsAuthenticated(authenticated);

      if (authenticated) {
        const userData = getAuthUser();
        setUser(userData);
      } else {
        setUser(null);
      }

      setLoading(false);
    };

    checkAuth();

    // Configurar un intervalo para verificar la autenticación periódicamente
    // Esto es útil para detectar cuando el token expira
    const interval = setInterval(checkAuth, 60000); // Verificar cada minuto

    return () => {
      clearInterval(interval);
    };
  }, []);
  // Función para iniciar sesión
  const login = userData => {
    console.log("Login exitoso con datos:", userData);
    
    // Asegurarnos de que el rol esté correctamente asignado
    if (userData && !userData.role) {
      console.warn("No se encontró información de rol en los datos del usuario");
      // Usar la función importada en lugar de require
      const tokenUser = getAuthUser();
      if (tokenUser && tokenUser.role) {
        console.log("Se encontró rol en el token:", tokenUser.role);
        userData = { ...userData, ...tokenUser };
      }
    }
    
    setIsAuthenticated(true);
    setUser(userData);
  };

  // Función para cerrar sesión
  const handleLogout = () => {
    logout();
    setIsAuthenticated(false);
    setUser(null);
  };

  // Valor del contexto
  const value = {
    isAuthenticated,
    user,
    loading,
    login,
    logout: handleLogout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// El hook useAuth ahora está en su propio archivo
