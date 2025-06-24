import React, { useState, useEffect } from 'react';
import { getCultivos, deleteCultivo, createCultivo } from '../../api';

/**
 * Componente de Mantenedor de Cultivos
 *
 * Este componente gestiona la visualización, creación, edición y eliminación de cultivos
 *
 * @returns {JSX.Element} Componente de mantenedor de cultivos
 */
function Cultivos() {
  // Estado para almacenar la lista de cultivos
  const [cultivos, setCultivos] = useState([]);
  // Estado para manejar la carga de datos
  const [loading, setLoading] = useState(true);
  // Estado para manejar errores
  const [error, setError] = useState(null);
  // Estado para controlar la visibilidad del modal
  const [showModal, setShowModal] = useState(false);
  // Estado para el formulario
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
  });

  // Cargar cultivos al montar el componente
  useEffect(() => {
    const fetchCultivos = async () => {
      try {
        setLoading(true);
        const data = await getCultivos();
        setCultivos(Array.isArray(data) ? data : []);
        setError(null);
      } catch (err) {
        console.error('Error al cargar cultivos:', err);
        setError('Error al cargar los cultivos. Por favor, inténtelo de nuevo.');
      } finally {
        setLoading(false);
      }
    };

    fetchCultivos();
  }, []);

  /**
   * Maneja la eliminación de un cultivo
   * @param {number} id - ID del cultivo a eliminar
   */
  const handleDelete = async id => {
    if (window.confirm('¿Está seguro que desea eliminar este cultivo?')) {
      try {
        await deleteCultivo(id);
        // Actualizar la lista de cultivos después de eliminar
        setCultivos(cultivos.filter(cultivo => cultivo.id !== id));
      } catch (err) {
        console.error('Error al eliminar cultivo:', err);
        setError('Error al eliminar el cultivo. Por favor, inténtelo de nuevo.');
      }
    }
  };

  /**
   * Maneja los cambios en los campos del formulario
   * @param {Event} e - Evento del input
   */
  const handleInputChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  /**
   * Abre el modal y resetea el formulario
   */
  const handleOpenModal = () => {
    setFormData({
      nombre: '',
      descripcion: '',
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
   * Maneja el envío del formulario para crear un nuevo cultivo
   * @param {Event} e - Evento del formulario
   */
  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const newCultivo = await createCultivo(formData);
      setCultivos([...cultivos, newCultivo]);
      setShowModal(false);
      setError(null);
    } catch (err) {
      console.error('Error al crear cultivo:', err);
      setError('Error al crear el cultivo. Por favor, inténtelo de nuevo.');
    }
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <h2 className="text-xl font-semibold mb-4">Mantenedor de Cultivos</h2>
      <p className="text-gray-600 mb-6">
        En esta sección puede administrar los cultivos del sistema: crear nuevos registros, editar
        los existentes o eliminarlos.
      </p>

      {/* Mostrar mensaje de error si existe */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
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
          Agregar Cultivo
        </button>
      </div>

      {/* Tabla de cultivos */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          {' '}
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Nombre
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Descripción
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {loading ? (
              <tr>
                {' '}
                <td colSpan="3" className="px-6 py-4 text-center text-sm text-gray-500">
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
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    <span>Cargando cultivos...</span>
                  </div>
                </td>
              </tr>
            ) : cultivos.length === 0 ? (
              <tr>
                {' '}
                <td colSpan="3" className="px-6 py-4 text-center text-sm text-gray-500">
                  No se encontraron elementos
                </td>
              </tr>
            ) : (
              cultivos.map(cultivo => (
                <tr key={cultivo.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {cultivo.nombre}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">{cultivo.descripcion}</td>{' '}
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button className="bg-blue-500 hover:bg-blue-600 text-white py-1 px-3 rounded-md flex items-center">
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
                        onClick={() => handleDelete(cultivo.id)}
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
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
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

      {/* Modal para agregar cultivo */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex justify-center items-center">
          <div className="relative mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3 text-center">
              <h3 className="text-lg leading-6 font-medium text-gray-900">Agregar Nuevo Cultivo</h3>
              <div className="mt-2 px-7 py-3">
                <form onSubmit={handleSubmit}>
                  <div className="mb-4">
                    <label
                      className="block text-gray-700 text-sm font-bold mb-2 text-left"
                      htmlFor="nombre"
                    >
                      Nombre
                    </label>
                    <input
                      type="text"
                      id="nombre"
                      name="nombre"
                      value={formData.nombre}
                      onChange={handleInputChange}
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      required
                    />
                  </div>
                  <div className="mb-4">
                    <label
                      className="block text-gray-700 text-sm font-bold mb-2 text-left"
                      htmlFor="descripcion"
                    >
                      Descripción
                    </label>
                    <textarea
                      id="descripcion"
                      name="descripcion"
                      value={formData.descripcion}
                      onChange={handleInputChange}
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      rows="3"
                      required
                    />
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

export default Cultivos;
