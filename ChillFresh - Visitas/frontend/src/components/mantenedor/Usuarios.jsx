import React, { useState, useEffect } from 'react';
import { getUsers, deleteUser, createUser, updateUser, getRoles, getUserById } from '../../api';
import { useAuth } from '../../utils/useAuth';

/**
 * Componente de Mantenedor de Usuarios
 *
 * Este componente gestiona la visualización, creación, edición y eliminación de usuarios
 * Solo usuarios con rol de Administrador pueden acceder a esta funcionalidad
 *
 * @returns {JSX.Element} Componente de mantenedor de usuarios
 */
function Usuarios() {
  // Hook de autenticación para obtener información del usuario actual
  const { user } = useAuth();
  
  // Estado para determinar si el usuario actual es administrador
  const [isAdmin, setIsAdmin] = useState(false);
  
  // Estado para almacenar la lista de usuarios
  const [usuarios, setUsuarios] = useState([]);
  // Estado para manejar la carga de datos
  const [loading, setLoading] = useState(true);
  // Estado para manejar errores
  const [error, setError] = useState(null);
  // Estado para controlar la visibilidad del modal
  const [showModal, setShowModal] = useState(false);
  // Estado para almacenar roles disponibles
  const [roles, setRoles] = useState([]);
  // Estado para mostrar u ocultar la contraseña
  const [showPassword, setShowPassword] = useState(false);
  // Estado para saber si estamos editando o creando un usuario
  const [isEditing, setIsEditing] = useState(false);
  // Estado para el formulario
  const [formData, setFormData] = useState({
    usuario_id: '', // Agregamos el campo de ID usuario (correo)
    nombreCompleto: '',
    password: '',
    telefono: '',
    role_id: '',
    activo: true,
  });

  // Verificar si el usuario es administrador
  useEffect(() => {
    if (user) {
      // Verificar el rol desde el token JWT decodificado
      const userHasAdminRole = user.role === 'administrador' || user.nombreRol === 'administrador';
      
      console.log('Información de usuario:', user);
      console.log('¿Es administrador?', userHasAdminRole);
      
      setIsAdmin(userHasAdminRole);
    } else {
      setIsAdmin(false);
    }
  }, [user]);

  // Cargar usuarios al montar el componente, solo si es administrador
  useEffect(() => {
    const fetchUsuarios = async () => {
      try {
        setLoading(true);
        
        if (!isAdmin) {
          setError(
            <div className="text-red-600">
              <p className="font-bold">Acceso denegado</p>
              <p>No tiene permisos para acceder al mantenedor de usuarios.</p>
              <p>Se requiere rol de Administrador para esta sección.</p>
            </div>
          );
          setLoading(false);
          return;
        }
        
        console.log('Cargando lista de usuarios como administrador...');
        const data = await getUsers();
        setUsuarios(Array.isArray(data) ? data : []);
        setError(null);
        
      } catch (err) {
        console.error('Error al cargar usuarios:', err);
        
        // Mejorar los mensajes de error según el código de respuesta
        if (err.status === 403) {
          setError(
            <div className="text-red-600">
              <p className="font-bold">Acceso denegado (403)</p>
              <p>No tiene permisos para ver la lista de usuarios.</p>
              <p>Esta función está reservada para usuarios con rol de Administrador.</p>
            </div>
          );
        } else if (err.status === 401) {
          setError(
            <div className="text-yellow-600">
              <p className="font-bold">Sesión expirada o inválida (401)</p>
              <p>Su sesión ha caducado o las credenciales no son válidas.</p>
              <p>Por favor, inicie sesión nuevamente.</p>
            </div>
          );
        } else {
          setError(
            <div className="text-red-600">
              <p>Error al cargar datos: {err.message || 'Problema de comunicación con el servidor'}</p>
              <p>Por favor, inténtelo de nuevo más tarde.</p>
            </div>
          );
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUsuarios();
  }, [isAdmin]);

  // Cargar roles al montar el componente, solo si es admin
  useEffect(() => {
    if (!isAdmin) return;
    
    const fetchRoles = async () => {
      try {
        const data = await getRoles();
        setRoles(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error('Error al cargar roles:', err);
      }
    };

    fetchRoles();
  }, [isAdmin]);

  // Si el usuario no es administrador, mostrar un mensaje de acceso denegado
  if (!isAdmin && !loading) {
    return (
      <div className="bg-white shadow-md rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Mantenedor de Usuarios</h2>
        <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-6">
          <div className="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <p className="font-bold">Acceso restringido</p>
          </div>
          <p className="mt-2">No tiene permisos para acceder al mantenedor de usuarios.</p>
          <p className="mt-1">Esta sección está reservada para usuarios con rol de Administrador.</p>
        </div>
      </div>
    );
  }

  /**
   * Maneja la eliminación de un usuario
   * @param {string} id - ID del usuario a eliminar
   */
  const handleDelete = async id => {
    if (!isAdmin) {
      setError(
        <div className="text-red-600">
          <p className="font-bold">Acceso denegado</p>
          <p>No tiene permisos para eliminar usuarios.</p>
        </div>
      );
      return;
    }

    if (window.confirm('¿Está seguro que desea eliminar este usuario?')) {
      try {
        await deleteUser(id);
        // Actualizar la lista de usuarios después de eliminar
        setUsuarios(usuarios.filter(user => user.usuario_id !== id));
      } catch (err) {
        console.error('Error al eliminar usuario:', err);
        
        if (err.status === 403) {
          setError('Acceso denegado. No tiene permisos para eliminar usuarios.');
        } else if (err.status === 401) {
          setError('Su sesión ha expirado. Por favor, inicie sesión nuevamente.');
        } else {
          setError(`Error al eliminar el usuario: ${err.message || 'Por favor, inténtelo de nuevo.'}`);
        }
      }
    }
  };

  /**
   * Maneja los cambios en los campos del formulario
   * @param {Event} e - Evento del input
   */
  const handleInputChange = e => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  /**
   * Alterna la visibilidad de la contraseña
   */
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  /**
   * Abre el modal para crear un nuevo usuario
   */
  const handleOpenModal = () => {
    setIsEditing(false);
    setFormData({
      usuario_id: '', // Incluimos el campo para el ID de usuario
      nombreCompleto: '',
      password: '',
      telefono: '',
      role_id: roles.length > 0 ? roles[0].rol_id : '',
      activo: true,
    });
    setShowPassword(false); // Resetear el estado de mostrar contraseña
    setShowModal(true);
  };

  /**
   * Abre el modal para editar un usuario existente
   * @param {Object} usuario - Usuario a editar
   */
  const handleEdit = async (usuario) => {
    try {
      // Limpiar cualquier error anterior
      setError(null);
      
      // Información de depuración detallada
      console.log('Usuario actual:', user);
      console.log('¿Es administrador?', isAdmin);
      console.log('Obteniendo detalles del usuario para editar:', usuario.usuario_id);
      
      // Si es necesario, podemos obtener datos más completos del usuario
      const userData = await getUserById(usuario.usuario_id);
      console.log('Datos obtenidos para edición:', userData);
      
      setIsEditing(true);
      setFormData({
        usuario_id: userData.usuario_id,
        nombreCompleto: userData.nombreCompleto,
        password: '', // No incluimos la contraseña por seguridad
        telefono: userData.telefono || '',
        role_id: userData.rol_id || '',
        activo: userData.activo !== false, // Si es null o undefined, lo tratamos como activo
      });
      setShowPassword(false);
      setShowModal(true);
    } catch (err) {
      console.error('Error al cargar datos para edición:', err);
      
      // Mejorar mensajes de error según el tipo
      if (err.status === 403) {
        setError(
          <div className="text-red-600">
            <p className="font-bold">Acceso denegado (403)</p>
            <p>No tiene permisos para editar este usuario.</p>
            <p>Esta función está reservada para usuarios con rol de Administrador.</p>
          </div>
        );
      } else if (err.status === 404) {
        setError(
          <div className="text-yellow-600">
            <p className="font-bold">Usuario no encontrado (404)</p>
            <p>El usuario que intenta editar no existe en el sistema.</p>
          </div>
        );
      } else {
        setError(
          <div className="text-red-600">
            <p className="font-bold">Error al cargar datos</p>
            <p>{err.message || 'Ocurrió un problema al intentar cargar los datos del usuario.'}</p>
            <p>Por favor, inténtelo de nuevo más tarde.</p>
          </div>
        );
      }
    }
  };

  /**
   * Cierra el modal
   */
  const handleCloseModal = () => {
    setShowModal(false);
  };

  /**
   * Maneja el envío del formulario para crear o actualizar un usuario
   * @param {Event} e - Evento del formulario
   */
  const handleSubmit = async e => {
    e.preventDefault();
    try {
      setError(null);

      // Verifica que usuario_id existe y es un correo válido
      if (!formData.usuario_id) {
        setError('El ID de usuario (correo) es requerido');
        return;
      }

      if (isEditing) {
        // Actualizando usuario existente
        const updateData = {
          nombreCompleto: formData.nombreCompleto,
          telefono: formData.telefono,
          role_id: formData.role_id,
          activo: formData.activo,
        };

        // Solo incluir la contraseña si se ha proporcionado una nueva
        if (formData.password) {
          updateData.password = formData.password;
        }

        console.log('Enviando datos para actualizar:', {
          usuario_id: formData.usuario_id,
          ...updateData,
          password: updateData.password ? '[PRESENTE]' : '[AUSENTE]'
        });
        
        try {
          const response = await updateUser(formData.usuario_id, updateData);
          console.log('Respuesta de actualización:', response);

          if (response && response.success) {
            // Actualizar usuario en la lista
            const updatedUserData = await getUserById(formData.usuario_id);
            console.log('Datos actualizados obtenidos:', updatedUserData);
            
            setUsuarios(prevUsers => 
              prevUsers.map(user => 
                user.usuario_id === formData.usuario_id ? updatedUserData : user
              )
            );
            // Cerrar modal
            setShowModal(false);
          } else {
            console.error('La respuesta no indica éxito:', response);
            setError('Ocurrió un problema al actualizar el usuario. Intente nuevamente.');
          }
        } catch (updateError) {
          console.error('Error durante la actualización:', updateError);
          setError(`Error al actualizar: ${updateError.message}`);
        }
      } else {
        // Creando nuevo usuario
        const response = await createUser({
          usuario_id: formData.usuario_id,
          nombreCompleto: formData.nombreCompleto,
          password: formData.password,
          telefono: formData.telefono,
          role_id: formData.role_id,
          activo: formData.activo,
        });

        if (response && response.success) {
          // Obtener los datos actualizados del usuario recién creado
          try {
            const newUserData = await getUserById(formData.usuario_id);
            // Añadir el nuevo usuario a la lista
            setUsuarios([...usuarios, newUserData]);
          } catch (error) {
            // Si no podemos obtener los datos completos, al menos actualizamos con lo que sabemos
            console.error('Error al obtener datos del nuevo usuario:', error);
            const partialUserData = {
              usuario_id: formData.usuario_id,
              nombreCompleto: formData.nombreCompleto,
              telefono: formData.telefono,
              activo: formData.activo,
            };
            setUsuarios([...usuarios, partialUserData]);
          }

          // Cerrar el modal
          setShowModal(false);
        } else {
          // Si hay un problema pero no se capturó como error
          setError('Ocurrió un problema al crear el usuario. Intente nuevamente.');
        }
      }
    } catch (err) {
      console.error(`Error al ${isEditing ? 'actualizar' : 'crear'} usuario:`, err);
      setError(err.message || `Error al ${isEditing ? 'actualizar' : 'crear'} el usuario. Por favor, inténtelo de nuevo.`);
    }
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <h2 className="text-xl font-semibold mb-4">Mantenedor de Usuarios</h2>
      
      {/* Contenido diferenciado según el rol del usuario */}
      {!isAdmin ? (
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-5 rounded mb-4">
          <div className="flex items-center mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <h3 className="text-lg font-medium">Acceso restringido</h3>
          </div>
          <p className="mb-2">No tiene permisos para administrar usuarios del sistema.</p>
          <p className="mb-4">Esta funcionalidad está limitada a usuarios con rol de Administrador.</p>
          <div className="bg-yellow-50 p-3 rounded-md">
            <p className="font-semibold">¿Qué puede hacer?</p>
            <ul className="list-disc pl-5 mt-1 text-sm">
              <li>Contacte al administrador del sistema si requiere acceso a esta función</li>
              <li>Si cree que esto es un error, cierre sesión e inténtelo nuevamente</li>
            </ul>
          </div>
        </div>
      ) : (
        <p className="text-gray-600 mb-6">
          En esta sección puede administrar los usuarios del sistema: crear nuevos usuarios, editar
          los existentes o desactivarlos.
        </p>
      )}

      {/* Mostrar mensaje de error si existe */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
          
          {/* Mostrar mensaje adicional si el error es de permisos */}
          {(typeof error === 'object' && error.props && error.props.children && 
            error.props.children.some(child => 
              child && child.props && child.props.children === 'Acceso denegado'
            )) && (
            <div className="mt-3 pt-3 border-t border-red-300">
              <p className="font-semibold">¿Qué puedo hacer?</p>
              <ul className="list-disc pl-5 mt-1 text-sm">
                <li>Asegúrese de haber iniciado sesión con una cuenta de administrador.</li>
                <li>Contacte al administrador del sistema si requiere acceso a esta función.</li>
                <li>Si cree que esto es un error, cierre sesión e inténtelo nuevamente.</li>
              </ul>
            </div>
          )}
        </div>
      )}
      {/* Solo mostrar el botón de agregar y la tabla si el usuario es administrador */}
      {isAdmin && (
        <div>
          <div className="flex justify-end mb-4">
            <button
              className="bg-lightgreen hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg focus:outline-none focus:shadow-outline flex items-center transition-all duration-200 transform hover:scale-105"
              onClick={handleOpenModal}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                />
              </svg>
              Agregar Usuario
            </button>
          </div>

          {/* Tabla de usuarios */}
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Nombre
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Correo
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Teléfono
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Estado
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {loading ? (
                  <tr>
                    <td colSpan="5" className="px-6 py-4 text-center text-sm text-gray-500">
                      <div className="flex justify-center items-center space-x-2">
                        <svg
                          className="animate-spin h-5 w-5 text-gray-500"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 008-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        <span>Cargando usuarios...</span>
                      </div>
                    </td>
                  </tr>
                ) : usuarios.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="px-6 py-4 text-center text-sm text-gray-500">
                      No se encontraron elementos
                    </td>
                  </tr>
                ) : (
                  usuarios.map((usuario, index) => (
                    <tr key={usuario.usuario_id || index}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {usuario.nombreCompleto}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {usuario.usuario_id || 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {usuario.telefono || 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            usuario.activo === false
                              ? 'bg-red-100 text-red-800'
                              : 'bg-green-100 text-green-800'
                          }`}
                        >
                          {usuario.activo === false ? 'Inactivo' : 'Activo'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button 
                            className="bg-blue-500 hover:bg-blue-600 text-white py-1 px-3 rounded-md flex items-center"
                            onClick={() => handleEdit(usuario)}
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-4 w-4 mr-1"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                              />
                            </svg>
                            <span>Editar</span>
                          </button>
                          <button
                            className="bg-red-500 hover:bg-red-600 text-white py-1 px-3 rounded-md flex items-center"
                            onClick={() => handleDelete(usuario.usuario_id)}
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-4 w-4 mr-1"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                              />
                            </svg>
                            <span>Eliminar</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

      {/* Modal para agregar usuario */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex justify-center items-center">
          <div className="relative mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3 text-center">
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                {isEditing ? 'Editar Usuario' : 'Agregar Nuevo Usuario'}
              </h3>
              <div className="mt-2 px-7 py-3">
                <form onSubmit={handleSubmit}>
                  <div className="mb-4">
                    <label
                      className="block text-gray-700 text-sm font-bold mb-2 text-left"
                      htmlFor="usuario_id"
                    >
                      Correo electrónico
                    </label>
                    <input
                      type="email"
                      id="usuario_id"
                      name="usuario_id"
                      value={formData.usuario_id}
                      onChange={handleInputChange}
                      className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
                        isEditing ? 'bg-gray-100' : ''
                      }`}
                      required
                      placeholder="ejemplo@chillfresh.cl"
                      readOnly={isEditing}
                    />
                  </div>
                  <div className="mb-4">
                    <label
                      className="block text-gray-700 text-sm font-bold mb-2 text-left"
                      htmlFor="nombreCompleto"
                    >
                      Nombre Completo
                    </label>
                    <input
                      type="text"
                      id="nombreCompleto"
                      name="nombreCompleto"
                      value={formData.nombreCompleto}
                      onChange={handleInputChange}
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      required
                    />
                  </div>
                  <div className="mb-4">
                    <label
                      className="block text-gray-700 text-sm font-bold mb-2 text-left"
                      htmlFor="password"
                    >
                      Contraseña
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        id="password"
                        name="password"
                        value={formData.password}
                        onChange={handleInputChange}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        required={!isEditing}
                      />
                      <button
                        type="button"
                        className="absolute right-0 top-0 mt-2 mr-3 text-gray-500"
                        onClick={togglePasswordVisibility}
                      >
                        {showPassword ? (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M13.875 18.825A10.05 10.05 0 0112 19c-2.796 0-5.334-1.125-7.164-3.043A10.04 10.04 0 013.124 13.5"
                            />
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M6.429 9.75L3 12v3c0 1.5 1.343 2.25 3 2.25s3-.75 3-2.25V12M3 12h18v3c0 1.5-1.343 2.25-3 2.25s-3-.75-3-2.25V12"
                            />
                          </svg>
                        ) : (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                            />
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                            />
                          </svg>
                        )}
                      </button>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      {isEditing 
                        ? 'Deje en blanco para mantener la contraseña actual. Si ingresa una nueva, será encriptada automáticamente.'
                        : 'La contraseña será encriptada automáticamente al guardar.'}
                    </p>
                  </div>
                  <div className="mb-4">
                    <label
                      className="block text-gray-700 text-sm font-bold mb-2 text-left"
                      htmlFor="telefono"
                    >
                      Teléfono
                    </label>
                    <input
                      type="text"
                      id="telefono"
                      name="telefono"
                      value={formData.telefono}
                      onChange={handleInputChange}
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    />
                  </div>
                  <div className="mb-4">
                    <label
                      className="block text-gray-700 text-sm font-bold mb-2 text-left"
                      htmlFor="role_id"
                    >
                      Rol
                    </label>
                    <select
                      id="role_id"
                      name="role_id"
                      value={formData.role_id}
                      onChange={handleInputChange}
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      required
                    >
                      {roles.length === 0 ? (
                        <option value="">Cargando roles...</option>
                      ) : (
                        roles.map(role => (
                          <option key={role.rol_id} value={role.rol_id}>
                            {role.nombreRol}
                          </option>
                        ))
                      )}
                    </select>
                  </div>
                  <div className="mb-4 flex items-center">
                    <input
                      id="activo"
                      type="checkbox"
                      name="activo"
                      checked={formData.activo}
                      onChange={handleInputChange}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor="activo" className="ml-2 block text-sm text-gray-900">
                      Activo
                    </label>
                  </div>
                  <div className="flex items-center justify-between mt-4 gap-4">
                    <button
                      type="button"
                      onClick={handleCloseModal}
                      className="text-gray-500 bg-white hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-gray-200 rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5 hover:text-gray-900 focus:z-10"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      className="text-white bg-lightgreen hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
                    >
                      {isEditing ? 'Actualizar' : 'Guardar'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
    )}
  </div>
  );
}

export default Usuarios;
