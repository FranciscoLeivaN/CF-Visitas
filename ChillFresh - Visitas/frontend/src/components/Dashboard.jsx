import React from 'react';

/**
 * Componente Dashboard - Vista principal del panel de administración
 *
 * @returns {JSX.Element} Componente de dashboard
 */
function Dashboard({ setActiveMenu }) {
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {/* Tarjetas de estadísticas */}
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <h3 className="text-gray-500 text-sm font-medium">Total Visitas</h3>
          <p className="text-3xl font-bold text-black">254</p>
          <span className="text-green-500 text-sm">+14% vs semana anterior</span>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-sm">
          <h3 className="text-gray-500 text-sm font-medium">Visitas Hoy</h3>
          <p className="text-3xl font-bold text-black">18</p>
          <span className="text-green-500 text-sm">+5% vs ayer</span>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-sm">
          <h3 className="text-gray-500 text-sm font-medium">Usuarios Activos</h3>
          <p className="text-3xl font-bold text-black">12</p>
          <span className="text-gray-500 text-sm">0% cambio</span>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-sm">
          <h3 className="text-gray-500 text-sm font-medium">Tiempo Medio Visita</h3>
          <p className="text-3xl font-bold text-black">42m</p>
          <span className="text-red-500 text-sm">-2% vs semana anterior</span>
        </div>
      </div>

      {/* Cajas de acceso rápido */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Caja de Gestión de Visitas */}
        <div className="bg-white p-6 rounded-lg shadow-sm border-t-4 border-lightgreen hover:shadow-md transition-shadow">
          <h3 className="text-xl font-semibold text-black mb-2 flex items-center">
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
              ></path>
            </svg>
            <span className="ml-2">Gestión de Visitas</span>
          </h3>
          <p className="text-gray-600 mb-4">Administra las visitas y registros del sistema.</p>
          <button
            onClick={() => setActiveMenu('visitas')}
            className="w-full px-4 py-2 bg-lightgreen hover:bg-green-500 text-white rounded-md transition-colors flex items-center justify-center"
            aria-label="Ver Visitas"
          >
            <span>Ver Visitas</span>
            <svg
              className="w-4 h-4 ml-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M14 5l7 7m0 0l-7 7m7-7H3"
              ></path>
            </svg>
          </button>
        </div>

        {/* Caja de Reportes */}
        <div className="bg-white p-6 rounded-lg shadow-sm border-t-4 border-lightgreen hover:shadow-md transition-shadow">
          <h3 className="text-xl font-semibold text-black mb-2 flex items-center">
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              ></path>
            </svg>
            <span className="ml-2">Reportes</span>
          </h3>
          <p className="text-gray-600 mb-4">Visualiza estadísticas y reportes del sistema.</p>
          <button
            onClick={() => setActiveMenu('reportes')}
            className="w-full px-4 py-2 bg-lightgreen hover:bg-green-500 text-white rounded-md transition-colors flex items-center justify-center"
            aria-label="Ver Reportes"
          >
            <span>Ver Reportes</span>
            <svg
              className="w-4 h-4 ml-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M14 5l7 7m0 0l-7 7m7-7H3"
              ></path>
            </svg>
          </button>
        </div>

        {/* Caja de Configuración */}
        <div className="bg-white p-6 rounded-lg shadow-sm border-t-4 border-lightgreen hover:shadow-md transition-shadow">
          <h3 className="text-xl font-semibold text-black mb-2 flex items-center">
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
              ></path>
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              ></path>
            </svg>
            <span className="ml-2">Configuración</span>
          </h3>
          <p className="text-gray-600 mb-4">
            Ajusta las preferencias y configuraciones del sistema.
          </p>
          <button
            onClick={() => setActiveMenu('configuracion')}
            className="w-full px-4 py-2 bg-lightgreen hover:bg-green-500 text-white rounded-md transition-colors flex items-center justify-center"
            aria-label="Configurar"
          >
            <span>Configurar</span>
            <svg
              className="w-4 h-4 ml-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M14 5l7 7m0 0l-7 7m7-7H3"
              ></path>
            </svg>
          </button>
        </div>
      </div>
    </>
  );
}

export default Dashboard;
