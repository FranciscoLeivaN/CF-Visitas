/**
 * API.js - Contiene funciones para interactuar con el backend
 * 
 * Este archivo proporciona funciones para realizar operaciones CRUD con el servidor.
 * Centralizamos todas las llamadas al API en este archivo para mantener la consistencia
 * y facilitar el mantenimiento.
 */

// URL base para todas las peticiones al API
const API_URL = 'http://localhost:3000/api';

// Funciones para manejar el token JWT
const TOKEN_KEY = 'chillfresh_auth_token';

/**
 * Guarda el token JWT en localStorage
 * @param {string} token - Token JWT a guardar
 */
export const setAuthToken = (token) => {
  localStorage.setItem(TOKEN_KEY, token);
};

/**
 * Obtiene el token JWT de localStorage
 * @returns {string|null} Token JWT o null si no existe
 */
export const getAuthToken = () => {
  return localStorage.getItem(TOKEN_KEY);
};

/**
 * Elimina el token JWT de localStorage
 */
export const removeAuthToken = () => {
  localStorage.removeItem(TOKEN_KEY);
};

/**
 * Verifica si existe un token JWT guardado
 * @returns {boolean} true si existe un token, false en caso contrario
 */
export const isAuthenticated = () => {
  return !!getAuthToken();
};

/**
 * Realiza una petición fetch con manejo de errores
 * @param {string} endpoint - Endpoint a consultar
 * @param {Object} options - Opciones de fetch
 * @returns {Promise<any>} - Respuesta del servidor
 */
const fetchWithErrorHandling = async (endpoint, options = {}) => {
  try {
    // Agregar automáticamente el token de autorización si existe y no estamos haciendo login
    const token = getAuthToken();
    let headers = {
      'Content-Type': 'application/json',
      ...(options.headers || {})
    };
    
    if (token && !endpoint.includes('/login')) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers
    });

    const data = await response.json();    if (!response.ok) {
      // Si recibimos un 401 Unauthorized, limpiamos el token porque podría estar expirado
      if (response.status === 401) {
        removeAuthToken();
      }
      // Aseguramos que se lance un error con el mensaje exacto del backend
      throw new Error(data.error || 'Error en la petición');
    }

    return data;
  } catch (error) {
    console.error(`Error en petición a ${endpoint}:`, error);
    throw error;
  }
};

/**
 * Obtiene datos del servidor backend
 * @return {Promise<Object>} Datos obtenidos del servidor
 */
export const fetchData = async () => {
  return fetchWithErrorHandling('/');
};

// *** API DE USUARIOS ***

/**
 * Función para iniciar sesión
 * @param {string} usuario_id - ID del usuario
 * @param {string} password - Contraseña del usuario
 * @return {Promise<Object>} Resultado del intento de inicio de sesión
 */
export const login = async (usuario_id, password) => {
  const response = await fetchWithErrorHandling('/usuarios/login', {
    method: 'POST',
    body: JSON.stringify({ usuario_id, password })
  });
  
  // Si el login es exitoso, guardamos el token
  if (response.token) {
    setAuthToken(response.token);
  }
  
  return response;
};

/**
 * Obtiene todos los usuarios
 * @returns {Promise<Array>} Lista de usuarios
 */
export const getUsers = async () => {
  return fetchWithErrorHandling('/usuarios');
};

/**
 * Obtiene un usuario por su ID
 * @param {string} id - ID del usuario
 * @returns {Promise<Object>} Datos del usuario
 */
export const getUserById = async (id) => {
  return fetchWithErrorHandling(`/usuarios/${id}`);
};

/**
 * Crea un nuevo usuario
 * @param {Object} userData - Datos del nuevo usuario
 * @returns {Promise<Object>} Resultado de la operación
 */
export const createUser = async (userData) => {
  return fetchWithErrorHandling('/usuarios', {
    method: 'POST',
    body: JSON.stringify(userData)
  });
};

/**
 * Actualiza un usuario existente
 * @param {string} id - ID del usuario a actualizar
 * @param {Object} userData - Nuevos datos del usuario
 * @returns {Promise<Object>} Resultado de la operación
 */
export const updateUser = async (id, userData) => {
  return fetchWithErrorHandling(`/usuarios/${id}`, {
    method: 'PUT',
    body: JSON.stringify(userData)
  });
};

/**
 * Elimina un usuario
 * @param {string} id - ID del usuario a eliminar
 * @returns {Promise<Object>} Resultado de la operación
 */
export const deleteUser = async (id) => {
  return fetchWithErrorHandling(`/usuarios/${id}`, {
    method: 'DELETE'
  });
};

// *** API DE PRODUCTORES ***

/**
 * Obtiene todos los productores
 * @returns {Promise<Array>} Lista de productores
 */
export const getProductores = async () => {
  return fetchWithErrorHandling('/productores');
};

/**
 * Obtiene un productor por su ID
 * @param {number} id - ID del productor
 * @returns {Promise<Object>} Datos del productor
 */
export const getProductorById = async (id) => {
  return fetchWithErrorHandling(`/productores/${id}`);
};

/**
 * Crea un nuevo productor
 * @param {Object} productorData - Datos del nuevo productor
 * @returns {Promise<Object>} Resultado de la operación
 */
export const createProductor = async (productorData) => {
  return fetchWithErrorHandling('/productores', {
    method: 'POST',
    body: JSON.stringify(productorData)
  });
};

/**
 * Actualiza un productor existente
 * @param {number} id - ID del productor a actualizar
 * @param {Object} productorData - Nuevos datos del productor
 * @returns {Promise<Object>} Resultado de la operación
 */
export const updateProductor = async (id, productorData) => {
  return fetchWithErrorHandling(`/productores/${id}`, {
    method: 'PUT',
    body: JSON.stringify(productorData)
  });
};

/**
 * Elimina un productor
 * @param {number} id - ID del productor a eliminar
 * @returns {Promise<Object>} Resultado de la operación
 */
export const deleteProductor = async (id) => {
  return fetchWithErrorHandling(`/productores/${id}`, {
    method: 'DELETE'
  });
};

// *** API DE CULTIVOS ***

/**
 * Obtiene todos los cultivos
 * @returns {Promise<Array>} Lista de cultivos
 */
export const getCultivos = async () => {
  return fetchWithErrorHandling('/cultivos');
};

/**
 * Obtiene un cultivo por su ID
 * @param {number} id - ID del cultivo
 * @returns {Promise<Object>} Datos del cultivo
 */
export const getCultivoById = async (id) => {
  return fetchWithErrorHandling(`/cultivos/${id}`);
};

/**
 * Crea un nuevo cultivo
 * @param {Object} cultivoData - Datos del nuevo cultivo
 * @returns {Promise<Object>} Resultado de la operación
 */
export const createCultivo = async (cultivoData) => {
  return fetchWithErrorHandling('/cultivos', {
    method: 'POST',
    body: JSON.stringify(cultivoData)
  });
};

/**
 * Actualiza un cultivo existente
 * @param {number} id - ID del cultivo a actualizar
 * @param {Object} cultivoData - Nuevos datos del cultivo
 * @returns {Promise<Object>} Resultado de la operación
 */
export const updateCultivo = async (id, cultivoData) => {
  return fetchWithErrorHandling(`/cultivos/${id}`, {
    method: 'PUT',
    body: JSON.stringify(cultivoData)
  });
};

/**
 * Elimina un cultivo
 * @param {number} id - ID del cultivo a eliminar
 * @returns {Promise<Object>} Resultado de la operación
 */
export const deleteCultivo = async (id) => {
  return fetchWithErrorHandling(`/cultivos/${id}`, {
    method: 'DELETE'
  });
};

// *** API DE INSPECTORES ***

/**
 * Obtiene todos los inspectores
 * @returns {Promise<Array>} Lista de inspectores
 */
export const getInspectores = async () => {
  return fetchWithErrorHandling('/inspectores');
};

/**
 * Obtiene un inspector por su ID
 * @param {number} id - ID del inspector
 * @returns {Promise<Object>} Datos del inspector
 */
export const getInspectorById = async (id) => {
  return fetchWithErrorHandling(`/inspectores/${id}`);
};

/**
 * Crea un nuevo inspector
 * @param {Object} inspectorData - Datos del nuevo inspector
 * @returns {Promise<Object>} Resultado de la operación
 */
export const createInspector = async (inspectorData) => {
  return fetchWithErrorHandling('/inspectores', {
    method: 'POST',
    body: JSON.stringify(inspectorData)
  });
};

/**
 * Actualiza un inspector existente
 * @param {number} id - ID del inspector a actualizar
 * @param {Object} inspectorData - Nuevos datos del inspector
 * @returns {Promise<Object>} Resultado de la operación
 */
export const updateInspector = async (id, inspectorData) => {
  return fetchWithErrorHandling(`/inspectores/${id}`, {
    method: 'PUT',
    body: JSON.stringify(inspectorData)
  });
};

/**
 * Elimina un inspector
 * @param {number} id - ID del inspector a eliminar
 * @returns {Promise<Object>} Resultado de la operación
 */
export const deleteInspector = async (id) => {
  return fetchWithErrorHandling(`/inspectores/${id}`, {
    method: 'DELETE'
  });
};

// *** API DE VISITAS ***

/**
 * Obtiene todas las visitas
 * @returns {Promise<Array>} Lista de visitas
 */
export const getVisitas = async () => {
  return fetchWithErrorHandling('/visitas');
};

/**
 * Obtiene una visita por su ID
 * @param {number} id - ID de la visita
 * @returns {Promise<Object>} Datos de la visita
 */
export const getVisitaById = async (id) => {
  return fetchWithErrorHandling(`/visitas/${id}`);
};

/**
 * Obtiene las visitas por productor
 * @param {number} productorId - ID del productor
 * @returns {Promise<Array>} Lista de visitas del productor
 */
export const getVisitasByProductor = async (productorId) => {
  return fetchWithErrorHandling(`/visitas/productor/${productorId}`);
};

/**
 * Obtiene las visitas por inspector
 * @param {number} inspectorId - ID del inspector
 * @returns {Promise<Array>} Lista de visitas del inspector
 */
export const getVisitasByInspector = async (inspectorId) => {
  return fetchWithErrorHandling(`/visitas/inspector/${inspectorId}`);
};

/**
 * Crea una nueva visita
 * @param {Object} visitaData - Datos de la nueva visita
 * @returns {Promise<Object>} Resultado de la operación
 */
export const createVisita = async (visitaData) => {
  return fetchWithErrorHandling('/visitas', {
    method: 'POST',
    body: JSON.stringify(visitaData)
  });
};

/**
 * Actualiza una visita existente
 * @param {number} id - ID de la visita a actualizar
 * @param {Object} visitaData - Nuevos datos de la visita
 * @returns {Promise<Object>} Resultado de la operación
 */
export const updateVisita = async (id, visitaData) => {
  return fetchWithErrorHandling(`/visitas/${id}`, {
    method: 'PUT',
    body: JSON.stringify(visitaData)
  });
};

/**
 * Marca una visita como enviada
 * @param {number} id - ID de la visita
 * @returns {Promise<Object>} Resultado de la operación
 */
export const marcarVisitaEnviada = async (id) => {
  return fetchWithErrorHandling(`/visitas/${id}/enviar`, {
    method: 'PUT'
  });
};

/**
 * Elimina una visita
 * @param {number} id - ID de la visita a eliminar
 * @returns {Promise<Object>} Resultado de la operación
 */
export const deleteVisita = async (id) => {
  return fetchWithErrorHandling(`/visitas/${id}`, {
    method: 'DELETE'
  });
};

/**
 * Cierra la sesión del usuario eliminando todos los datos de autenticación
 */
export const logout = () => {
  // Eliminar el token JWT
  removeAuthToken();
  // Eliminar otros datos de sesión
  localStorage.removeItem('userId');
  localStorage.removeItem('userName');
  localStorage.removeItem('isLoggedIn');
};

/**
 * Decodifica el token JWT almacenado
 * @returns {Object|null} Datos decodificados del token o null si no hay token
 */
export const decodeAuthToken = () => {
  const token = getAuthToken();
  if (!token) return null;
  
  try {
    // Dividir el token y obtener la parte del payload (posición 1)
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    // Decodificar el payload
    const jsonPayload = decodeURIComponent(
      window.atob(base64)
        .split('')
        .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error('Error al decodificar token:', error);
    return null;
  }
};
