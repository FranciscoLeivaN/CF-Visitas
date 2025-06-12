/**
 * API.js - Contiene funciones para interactuar con el backend
 * 
 * Este archivo proporciona funciones para realizar operaciones CRUD con el servidor.
 * Centralizamos todas las llamadas al API en este archivo para mantener la consistencia
 * y facilitar el mantenimiento.
 */

/**
 * Obtiene datos del servidor backend
 * @return {Promise<Object>} Datos obtenidos del servidor
 */
export const fetchData = async () => {
  try {
    // En producción, aquí se haría una llamada real al backend
    // const response = await fetch('/api/data');
    // return await response.json();
    
    // Por ahora retornamos datos simulados
    return { message: 'Conexión con backend exitosa (simulada)' };
  } catch (error) {
    console.error('Error al obtener datos:', error);
    throw error;
  }
};

/**
 * Función para iniciar sesión
 * @param {string} email - Correo electrónico del usuario
 * @param {string} password - Contraseña del usuario
 * @return {Promise<Object>} Resultado del intento de inicio de sesión
 */
export const login = async (email, password) => {
  try {
    // En producción, aquí se enviarían las credenciales al servidor
    // const response = await fetch('/api/login', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ email, password })
    // });
    // return await response.json();
    
    // Simulación de respuesta exitosa
    return { success: true, user: { email } };
  } catch (error) {
    console.error('Error al iniciar sesión:', error);
    throw error;
  }
};
