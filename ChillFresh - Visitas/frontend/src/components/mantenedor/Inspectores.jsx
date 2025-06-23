import React, { useState, useEffect } from 'react';
import { getInspectores, deleteInspector } from '../../api';

/**
 * Componente de Mantenedor de Inspectores
 * 
 * Este componente gestiona la visualización, creación, edición y eliminación de inspectores
 * 
 * @returns {JSX.Element} Componente de mantenedor de inspectores
 */
function Inspectores() {
  // Estado para almacenar la lista de inspectores
  const [inspectores, setInspectores] = useState([]);
  // Estado para manejar la carga de datos
  const [loading, setLoading] = useState(true);
  // Estado para manejar errores
  const [error, setError] = useState(null);
  
  // Cargar inspectores al montar el componente
  useEffect(() => {
    const fetchInspectores = async () => {
      try {
        setLoading(true);
        const data = await getInspectores();
        setInspectores(Array.isArray(data) ? data : []);
        setError(null);
      } catch (err) {
        console.error('Error al cargar inspectores:', err);
        setError('Error al cargar los inspectores. Por favor, inténtelo de nuevo.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchInspectores();
  }, []);
  
  /**
   * Maneja la eliminación de un inspector
   * @param {number} id - ID del inspector a eliminar
   */
  const handleDelete = async (id) => {
    if (window.confirm('¿Está seguro que desea eliminar este inspector?')) {
      try {
        await deleteInspector(id);
        // Actualizar la lista de inspectores después de eliminar
        setInspectores(inspectores.filter(inspector => inspector.id !== id));
      } catch (err) {
        console.error('Error al eliminar inspector:', err);
        setError('Error al eliminar el inspector. Por favor, inténtelo de nuevo.');
      }
    }
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <h2 className="text-xl font-semibold mb-4">Mantenedor de Inspectores</h2>
      <p className="text-gray-600 mb-6">
        En esta sección puede administrar los inspectores del sistema: crear nuevos registros,
        editar los existentes o eliminarlos.
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
        >
          Agregar Inspector
        </button>
      </div>
      
      {/* Tabla de inspectores */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Nombre
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Teléfono
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Email
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
                    <span>Cargando inspectores...</span>
                  </div>
                </td>
              </tr>
            ) : inspectores.length === 0 ? (
              <tr>                <td colSpan="4" className="px-6 py-4 text-center text-sm text-gray-500">
                  No se encontraron elementos
                </td>
              </tr>
            ) : (
              inspectores.map(inspector => (                <tr key={inspector.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {inspector.nombre}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {inspector.telefono}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {inspector.email}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button 
                      className="text-indigo-600 hover:text-indigo-900 mr-3"
                    >
                      Editar
                    </button>
                    <button 
                      className="text-red-600 hover:text-red-900"
                      onClick={() => handleDelete(inspector.id)}
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Inspectores;
