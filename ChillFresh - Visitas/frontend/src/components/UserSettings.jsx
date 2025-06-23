import { useState, useEffect } from 'react';
import { getUserById, updateUser } from '../api';
import { useAuth } from '../utils/useAuth';

/**
 * Componente UserSettings - Formulario para modificar datos del usuario
 * 
 * Permite al usuario actualizar su información personal como nombre y contraseña
 * 
 * @returns {JSX.Element} Componente de configuración de usuario
 */
function UserSettings() {
  // Estados para los campos del formulario
  const [formData, setFormData] = useState({
    nombreCompleto: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    telefono: ''
  });
    // Estados para manejo de errores y mensajes
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState({ text: '', type: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [dataLoaded, setDataLoaded] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  
  // Obtener información del usuario autenticado
  const { user } = useAuth();
  
  // Mostrar notificación cuando hay un mensaje
  useEffect(() => {
    if (message.text) {
      setShowNotification(true);
    } else {
      setShowNotification(false);
    }
  }, [message.text]);
  
  // Cargar datos del usuario al montar el componente
  useEffect(() => {
    const loadUserData = async () => {
      if (user?.id) {
        setIsLoading(true);
        try {
          const userData = await getUserById(user.id);
          setFormData(prevState => ({
            ...prevState,
            nombreCompleto: userData.nombreCompleto || '',
            telefono: userData.telefono || ''
          }));
          setDataLoaded(true);
        } catch (error) {
          console.error('Error al cargar datos del usuario:', error);
          setMessage({
            text: 'No se pudieron cargar los datos del usuario. Intente más tarde.',
            type: 'error'
          });
        } finally {
          setIsLoading(false);
        }
      }
    };
    
    loadUserData();
  }, [user]);
    /**
   * Maneja los cambios en los campos del formulario
   * @param {Event} e - Evento del input
   */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
    
    // Limpiar error del campo al modificarlo
    if (errors[name]) {
      setErrors(prevErrors => ({
        ...prevErrors,
        [name]: ''
      }));
    }
    
    // Limpiar mensaje general al hacer cambios
    if (message.text) {
      setMessage({ text: '', type: '' });
      setShowNotification(false);
    }
  };
  
  /**
   * Valida el formulario antes de enviarlo
   * @returns {boolean} true si el formulario es válido
   */
  const validateForm = () => {
    const newErrors = {};
    
    // Validar nombre completo
    if (!formData.nombreCompleto.trim()) {
      newErrors.nombreCompleto = 'El nombre es obligatorio';
    }
    
    // Validar contraseña actual si se quiere cambiar la contraseña
    if ((formData.newPassword || formData.confirmPassword) && !formData.currentPassword) {
      newErrors.currentPassword = 'La contraseña actual es necesaria para cambiar la contraseña';
    }
    
    // Validar nueva contraseña y confirmación
    if (formData.newPassword && formData.newPassword.length < 6) {
      newErrors.newPassword = 'La contraseña debe tener al menos 6 caracteres';
    }
    
    if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Las contraseñas no coinciden';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
    /**
   * Maneja el envío del formulario
   * @param {Event} e - Evento del formulario
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Crear objeto con los datos a actualizar
      const updateData = {
        nombreCompleto: formData.nombreCompleto,
        telefono: formData.telefono
      };
      
      // Solo incluir contraseña si se está cambiando
      if (formData.newPassword) {
        updateData.password = formData.newPassword;
        // Nota: En un sistema real, se debería verificar la contraseña actual en el backend
      }
      
      // Llamar a la API para actualizar los datos
      await updateUser(user.id, updateData);
      
      // Mostrar mensaje de éxito
      setMessage({
        text: 'Los datos se actualizaron correctamente',
        type: 'success'
      });
        // Mostrar notificación
      setShowNotification(true);
      
      // Ocultar la notificación después de 5 segundos
      setTimeout(() => {
        setShowNotification(false);
      }, 5000);
      
      // Limpiar los campos de contraseña
      setFormData(prev => ({
        ...prev,
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      }));
      
    } catch (error) {
      console.error('Error al actualizar datos del usuario:', error);
      setMessage({
        text: 'Error al actualizar los datos. Por favor, intente de nuevo.',
        type: 'error'
      });
        // Mostrar notificación de error
      setShowNotification(true);
      
      // Ocultar la notificación después de 5 segundos
      setTimeout(() => {
        setShowNotification(false);
      }, 5000);
    } finally {
      setIsLoading(false);
    }
  };  return (
    <div className="p-6 bg-white rounded-lg shadow-sm relative">
      <h2 className="text-2xl font-semibold text-black mb-6">Configuración de Usuario</h2>
      
      {/* Toast de notificación en la esquina inferior derecha */}
      {message.text && showNotification && (
        <div 
          className="fixed bottom-6 right-6 z-50 max-w-sm w-full animate-toast"
        >
          <div className={`p-4 rounded-lg shadow-lg flex items-center justify-between ${
            message.type === 'success' 
              ? 'bg-green-600 text-white' 
              : 'bg-red-600 text-white'
          }`}>
            <div className="flex items-center">
              {message.type === 'success' ? (
                <svg className="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              ) : (
                <svg className="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              )}
              <div>
                <p className="font-medium">{message.text}</p>
              </div>
            </div>
            <button 
              onClick={() => setShowNotification(false)} 
              className="ml-4 text-white hover:text-gray-200"
              aria-label="Cerrar notificación"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path>
              </svg>
            </button>
          </div>
        </div>
      )}
      
      {isLoading && !dataLoaded ? (
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-lightgreen"></div>
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          {/* Contenedor de columnas */}
          <div className="flex flex-col md:flex-row gap-8">
            {/* Columna izquierda - Información Personal */}
            <div className="flex-1 space-y-4">
              <div className="bg-gray-50 p-5 rounded-lg border border-gray-200">
                <h3 className="text-lg font-medium text-gray-900 mb-4 pb-2 border-b border-gray-200">
                  Información Personal
                </h3>
                
                <div className="mb-4">
                  <label htmlFor="nombreCompleto" className="block text-sm font-medium text-gray-700 mb-1">
                    Nombre Completo
                  </label>
                  <input
                    id="nombreCompleto"
                    name="nombreCompleto"
                    type="text"
                    value={formData.nombreCompleto}
                    onChange={handleChange}
                    className={`block w-full px-3 py-2 border ${errors.nombreCompleto ? 'border-red-300' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-lightgreen focus:border-lightgreen`}
                  />
                  {errors.nombreCompleto && (
                    <p className="mt-1 text-sm text-red-600">{errors.nombreCompleto}</p>
                  )}
                </div>
                
                <div>
                  <label htmlFor="telefono" className="block text-sm font-medium text-gray-700 mb-1">
                    Teléfono (opcional)
                  </label>
                  <input
                    id="telefono"
                    name="telefono"
                    type="text"
                    value={formData.telefono}
                    onChange={handleChange}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-lightgreen focus:border-lightgreen"
                  />
                </div>
                
                <div className="mt-6 text-sm text-gray-500">
                  <p>La información personal es visible para otros usuarios del sistema.</p>
                </div>
              </div>
            </div>
            
            {/* Columna derecha - Cambio de Contraseña */}
            <div className="flex-1 space-y-4">
              <div className="bg-gray-50 p-5 rounded-lg border border-gray-200">
                <h3 className="text-lg font-medium text-gray-900 mb-4 pb-2 border-b border-gray-200">
                  Cambio de Contraseña
                </h3>
                
                <div className="mb-4">
                  <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700 mb-1">
                    Contraseña Actual
                  </label>
                  <input
                    id="currentPassword"
                    name="currentPassword"
                    type="password"
                    value={formData.currentPassword}
                    onChange={handleChange}
                    className={`block w-full px-3 py-2 border ${errors.currentPassword ? 'border-red-300' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-lightgreen focus:border-lightgreen`}
                  />
                  {errors.currentPassword && (
                    <p className="mt-1 text-sm text-red-600">{errors.currentPassword}</p>
                  )}
                </div>
                
                <div className="mb-4">
                  <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-1">
                    Nueva Contraseña
                  </label>
                  <input
                    id="newPassword"
                    name="newPassword"
                    type="password"
                    value={formData.newPassword}
                    onChange={handleChange}
                    className={`block w-full px-3 py-2 border ${errors.newPassword ? 'border-red-300' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-lightgreen focus:border-lightgreen`}
                  />
                  {errors.newPassword && (
                    <p className="mt-1 text-sm text-red-600">{errors.newPassword}</p>
                  )}
                </div>
                
                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                    Confirmar Nueva Contraseña
                  </label>
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className={`block w-full px-3 py-2 border ${errors.confirmPassword ? 'border-red-300' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-lightgreen focus:border-lightgreen`}
                  />
                  {errors.confirmPassword && (
                    <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>
                  )}
                </div>
                
                <div className="mt-6 text-sm text-gray-500">
                  <p>Tu contraseña debe tener al menos 6 caracteres.</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Botones de acción */}
          <div className="flex justify-end space-x-3 mt-8 pt-5 border-t border-gray-200">
            <button
              type="button"              onClick={() => {
                setFormData({
                  nombreCompleto: user?.name || '',
                  currentPassword: '',
                  newPassword: '',
                  confirmPassword: '',
                  telefono: formData.telefono
                });
                setErrors({});
                setMessage({ text: '', type: '' });
                setShowNotification(false);
              }}
              className="px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-lightgreen"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className={`px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white ${isLoading ? 'bg-gray-400' : 'bg-lightgreen hover:bg-green-600'} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-lightgreen`}
            >
              {isLoading ? (
                <>
                  <span className="inline-block animate-spin mr-2">↻</span>
                  Guardando...
                </>
              ) : 'Guardar Cambios'}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

export default UserSettings;
