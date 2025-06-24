import React, { useState, useEffect } from 'react';
import { getUsers, deleteUser, createUser, getRoles } from '../../api';

/**
 * Componente de Mantenedor de Usuarios
 * 
 * Este componente gestiona la visualización, creación, edición y eliminación de usuarios
 * 
 * @returns {JSX.Element} Componente de mantenedor de usuarios
 */
function Usuarios() {
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
  // Estado para el formulario
  const [formData, setFormData] = useState({
    nombreCompleto: '',
    password: '',
    telefono: '',
    role_id: '',
    activo: true
  });
  
  // Cargar usuarios al montar el componente
  useEffect(() => {
    const fetchUsuarios = async () => {
      try {
        setLoading(true);
        const data = await getUsers();
        setUsuarios(Array.isArray(data) ? data : []);
        setError(null);
      } catch (err) {
        console.error('Error al cargar usuarios:', err);
        setError('Error al cargar los usuarios. Por favor, inténtelo de nuevo.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchUsuarios();
  }, []);
  
  // Cargar roles al montar el componente
  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const data = await getRoles();
        setRoles(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error('Error al cargar roles:', err);
        setError('Error al cargar los roles. Por favor, inténtelo de nuevo.');
      }
    };
    
    fetchRoles();
  }, []);
  
  /**
   * Maneja la eliminación de un usuario
   * @param {string} id - ID del usuario a eliminar
   */
  const handleDelete = async (id) => {
    if (window.confirm('¿Está seguro que desea eliminar este usuario?')) {
      try {
        await deleteUser(id);
        // Actualizar la lista de usuarios después de eliminar
        setUsuarios(usuarios.filter(user => user.usuario_id !== id));
      } catch (err) {
        console.error('Error al eliminar usuario:', err);
        setError('Error al eliminar el usuario. Por favor, inténtelo de nuevo.');
      }
    }
  };

  /**
   * Maneja los cambios en los campos del formulario
   * @param {Event} e - Evento del input
   */
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  /**
   * Abre el modal y resetea el formulario
   */
  const handleOpenModal = () => {
    setFormData({
      nombreCompleto: '',
      password: '',
      telefono: '',
      role_id: roles.length > 0 ? roles[0].id : '',
      activo: true
    });
    setShowModal(true);
  };

  /**
   * Cierra el modal
   */
  const handleCloseModal = () => {
    setShowModal(false);
  };

  /**
   * Maneja el envío del formulario para crear un nuevo usuario
   * @param {Event} e - Evento del formulario
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const newUser = await createUser(formData);
      setUsuarios([...usuarios, newUser]);
      setShowModal(false);
      setError(null);
    } catch (err) {
      console.error('Error al crear usuario:', err);
      setError('Error al crear el usuario. Por favor, inténtelo de nuevo.');
    }
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <h2 className="text-xl font-semibold mb-4">Mantenedor de Usuarios</h2>
      <p className="text-gray-600 mb-6">
        En esta sección puede administrar los usuarios del sistema: crear nuevos usuarios,
        editar los existentes o desactivarlos.
      </p>
      
      {/* Mostrar mensaje de error si existe */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      <div className="flex justify-end mb-4">
        <button 
          className="bg-lightgreen hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          onClick={handleOpenModal}
        >
          Agregar Usuario
        </button>
      </div>
      
      {/* Tabla de usuarios */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">          <thead className="bg-gray-50">
            <tr>              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Nombre
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
              <tr>                <td colSpan="4" className="px-6 py-4 text-center text-sm text-gray-500">
                  <div className="flex justify-center items-center space-x-2">
                    <svg className="animate-spin h-5 w-5 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Cargando usuarios...</span>
                  </div>
                </td>
              </tr>
            ) : usuarios.length === 0 ? (
              <tr>                <td colSpan="4" className="px-6 py-4 text-center text-sm text-gray-500">
                  No se encontraron elementos
                </td>
              </tr>
            ) : (
              usuarios.map((usuario, index) => (                <tr key={usuario.usuario_id || index}>                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {usuario.nombreCompleto}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {usuario.telefono || 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      usuario.activo === false ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                    }`}>
                      {usuario.activo === false ? 'Inactivo' : 'Activo'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button 
                      className="text-indigo-600 hover:text-indigo-900 mr-3"
                    >
                      Editar
                    </button>
                    {usuario.activo === false ? (
                      <button 
                        className="text-green-600 hover:text-green-900"
                      >
                        Activar
                      </button>
                    ) : (
                      <button 
                        className="text-red-600 hover:text-red-900"
                        onClick={() => handleDelete(usuario.usuario_id)}
                      >
                        Desactivar
                      </button>
                    )}
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
              <h3 className="text-lg leading-6 font-medium text-gray-900">Agregar Nuevo Usuario</h3>
              <div className="mt-2 px-7 py-3">
                <form onSubmit={handleSubmit}>
                  <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2 text-left" htmlFor="nombreCompleto">
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
                    <label className="block text-gray-700 text-sm font-bold mb-2 text-left" htmlFor="password">
                      Contraseña
                    </label>
                    <input
                      type="password"
                      id="password"
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      required
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2 text-left" htmlFor="telefono">
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
                    <label className="block text-gray-700 text-sm font-bold mb-2 text-left" htmlFor="role_id">
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
                          <option key={role.id} value={role.id}>
                            {role.nombre}
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
                      Guardar
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Usuarios;
