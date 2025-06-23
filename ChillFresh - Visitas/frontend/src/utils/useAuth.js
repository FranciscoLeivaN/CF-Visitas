import { useContext } from 'react';
import { AuthContext } from './AuthContext';

/**
 * Hook personalizado para usar el contexto de autenticación
 * Proporciona acceso al estado de autenticación y funciones relacionadas
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe usarse dentro de un AuthProvider');
  }
  return context;
};
