/**
 * Utilidades para gestionar la autenticación
 */
import { getAuthToken, decodeAuthToken } from '../api';

/**
 * Verifica si el usuario está autenticado
 * Comprueba si hay un token JWT válido y no expirado
 * @returns {boolean} - true si el usuario está autenticado, false en caso contrario
 */
export const isAuthenticated = () => {
  const token = getAuthToken();
  if (!token) return false;
  
  // Verifica que el token no esté expirado
  try {
    const decodedToken = decodeAuthToken();
    if (!decodedToken) return false;
    
    // Obtiene el tiempo de expiración del token (en segundos desde epoch)
    const expirationTime = decodedToken.exp;
    // Obtiene el tiempo actual en segundos
    const currentTime = Math.floor(Date.now() / 1000);
    
    // Si el tiempo actual es mayor que el tiempo de expiración, el token ha expirado
    return currentTime < expirationTime;
  } catch (error) {
    console.error('Error al verificar la autenticación:', error);
    return false;
  }
};

/**
 * Obtiene información del usuario autenticado
 * @returns {Object|null} - Datos del usuario o null si no está autenticado
 */
export const getAuthUser = () => {
  if (!isAuthenticated()) return null;
  
  try {
    const decodedToken = decodeAuthToken();
    return {
      id: decodedToken.id,
      name: decodedToken.name,
      email: decodedToken.email
    };
  } catch (error) {
    console.error('Error al obtener datos del usuario:', error);
    return null;
  }
};
