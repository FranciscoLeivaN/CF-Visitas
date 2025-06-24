import React from 'react';

/**
 * Componente Reportes - Vista de reportes y estadísticas
 *
 * @returns {JSX.Element} Componente de reportes
 */
function Reportes() {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <h3 className="text-xl font-semibold text-black mb-4">Reportes y Estadísticas</h3>
      <p className="text-gray-600 mb-4">Visualiza los reportes y estadísticas del sistema.</p>

      {/* Aquí iría el contenido de los reportes, como gráficos, tablas, etc. */}
      <div className="mt-6 p-4 bg-gray-50 rounded-md border border-gray-200">
        <p className="text-center text-gray-500">Contenido de reportes en desarrollo</p>
      </div>
    </div>
  );
}

export default Reportes;
