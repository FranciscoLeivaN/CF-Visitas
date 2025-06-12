import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  DashboardIcon, 
  VisitasIcon, 
  ReportesIcon, 
  ConfiguracionIcon, 
  MenuIcon,
  NotificacionIcon,
  UserIcon,
  LogoutIcon
} from './Icons';

/**
 * Componente Home - Panel de administración principal estilo AdminLTE
 * 
 * Este componente implementa una interfaz de administración con barra lateral
 * plegable, encabezado superior y área de contenido dinámico que cambia según
 * la sección seleccionada. Está inspirado en el diseño de AdminLTE pero
 * implementado con Tailwind CSS y personalizado con los colores del proyecto.
 * 
 * @returns {JSX.Element} Componente de panel de administración
 */
function Home() {
  const navigate = useNavigate();
  // Estado para controlar si la barra lateral está abierta o contraída
  const [sidebarOpen, setSidebarOpen] = useState(true);
  // Estado para controlar qué sección del menú está activa
  const [activeMenu, setActiveMenu] = useState('dashboard');
  
  // Recuperamos el email del usuario desde localStorage
  const userEmail = localStorage.getItem('userEmail') || 'usuario@ejemplo.com';

  /**
   * Maneja el cierre de sesión
   * Limpia localStorage y redirige al login
   */
  const handleLogout = () => {
    localStorage.removeItem('userEmail');
    localStorage.removeItem('isLoggedIn');
    navigate('/');
  };
  
  /**
   * Alterna el estado de la barra lateral entre abierta y contraída
   */
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };
  return (
    <div className="flex h-screen bg-gray-100">
      {/* Barra lateral (Sidebar) - Se adapta entre versión expandida y contraída */}
      <div className={`${sidebarOpen ? 'w-64' : 'w-20'} bg-black text-white transition-all duration-300 ease-in-out overflow-y-auto`}>
        {/* Cabecera de la barra lateral con logo y botón de toggle */}
        <div className="p-4 flex items-center justify-between">
          {sidebarOpen ? (
            <h1 className="text-2xl font-bold text-lightgreen">ChillFresh</h1>
          ) : (
            <h1 className="text-2xl font-bold text-lightgreen">CF</h1>
          )}
          <button 
            onClick={toggleSidebar} 
            className="p-1 rounded-md hover:bg-gray-700 focus:outline-none"
            aria-label={sidebarOpen ? "Contraer menú" : "Expandir menú"}
          >
            <MenuIcon />
          </button>
        </div>
        
        {/* Navegación principal */}
        <nav className="mt-5">
          {/* Opción Dashboard */}
          <div className="px-4 py-2">
            <button 
              onClick={() => setActiveMenu('dashboard')}
              className={`flex items-center w-full p-2 rounded-md transition-colors ${activeMenu === 'dashboard' ? 'bg-lightgreen text-black' : 'hover:bg-gray-800'}`}
              aria-current={activeMenu === 'dashboard' ? 'page' : undefined}
            >
              <DashboardIcon />
              {sidebarOpen && <span className="ml-3">Dashboard</span>}
            </button>
          </div>
          
          {/* Opción Gestión de Visitas */}
          <div className="px-4 py-2">
            <button 
              onClick={() => setActiveMenu('visitas')}
              className={`flex items-center w-full p-2 rounded-md transition-colors ${activeMenu === 'visitas' ? 'bg-lightgreen text-black' : 'hover:bg-gray-800'}`}
              aria-current={activeMenu === 'visitas' ? 'page' : undefined}
            >
              <VisitasIcon />
              {sidebarOpen && <span className="ml-3">Gestión de Visitas</span>}
            </button>
          </div>
          
          {/* Opción Reportes */}
          <div className="px-4 py-2">
            <button 
              onClick={() => setActiveMenu('reportes')}
              className={`flex items-center w-full p-2 rounded-md transition-colors ${activeMenu === 'reportes' ? 'bg-lightgreen text-black' : 'hover:bg-gray-800'}`}
              aria-current={activeMenu === 'reportes' ? 'page' : undefined}
            >
              <ReportesIcon />
              {sidebarOpen && <span className="ml-3">Reportes</span>}
            </button>
          </div>
          
          {/* Opción Configuración */}
          <div className="px-4 py-2">
            <button 
              onClick={() => setActiveMenu('configuracion')}
              className={`flex items-center w-full p-2 rounded-md transition-colors ${activeMenu === 'configuracion' ? 'bg-lightgreen text-black' : 'hover:bg-gray-800'}`}
              aria-current={activeMenu === 'configuracion' ? 'page' : undefined}
            >
              <ConfiguracionIcon />
              {sidebarOpen && <span className="ml-3">Configuración</span>}
            </button>
          </div>
          
          {/* Opción Cerrar Sesión */}
          <div className="px-4 py-2 mt-10">
            <button 
              onClick={handleLogout}
              className="flex items-center w-full p-2 rounded-md transition-colors hover:bg-red-500"
              aria-label="Cerrar sesión"
            >
              <LogoutIcon />
              {sidebarOpen && <span className="ml-3">Cerrar Sesión</span>}
            </button>
          </div>
        </nav>
      </div>
        {/* Área de contenido principal */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Encabezado superior */}
        <header className="bg-white shadow-sm z-10">
          <div className="px-4 py-3 flex justify-between items-center">
            {/* Título de la sección activa */}
            <div>
              <h1 className="text-2xl font-semibold text-black">
                {activeMenu === 'dashboard' && 'Dashboard'}
                {activeMenu === 'visitas' && 'Gestión de Visitas'}
                {activeMenu === 'reportes' && 'Reportes'}
                {activeMenu === 'configuracion' && 'Configuración'}
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              {/* Botón de notificaciones */}
              <button 
                className="p-1 rounded-full hover:bg-gray-100"
                aria-label="Notificaciones"
              >
                <NotificacionIcon />
              </button>
              
              {/* Información del usuario */}
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-full bg-lightgreen flex items-center justify-center text-white">
                  <UserIcon />
                </div>
                <span className="hidden md:inline text-black">{userEmail}</span>
              </div>
            </div>
          </div>
        </header>
        
        {/* Área de contenido principal - cambia según la sección activa */}
        <main className="flex-1 overflow-y-auto p-4 bg-gray-100">
          {/* Contenido del Dashboard */}
          {activeMenu === 'dashboard' && (
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
          )}
          
          {/* Cajas de acceso rápido - visibles en todas las secciones */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Caja de Gestión de Visitas */}
            <div className="bg-white p-6 rounded-lg shadow-sm border-t-4 border-lightgreen hover:shadow-md transition-shadow">
              <h3 className="text-xl font-semibold text-black mb-2 flex items-center">
                <VisitasIcon />
                <span className="ml-2">Gestión de Visitas</span>
              </h3>
              <p className="text-gray-600 mb-4">Administra las visitas y registros del sistema.</p>
              <button 
                onClick={() => setActiveMenu('visitas')}
                className="w-full px-4 py-2 bg-lightgreen hover:bg-green-500 text-white rounded-md transition-colors flex items-center justify-center"
                aria-label="Ver Visitas"
              >
                <span>Ver Visitas</span>
                <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                </svg>
              </button>
            </div>
            
            {/* Caja de Reportes */}
            <div className="bg-white p-6 rounded-lg shadow-sm border-t-4 border-lightgreen hover:shadow-md transition-shadow">
              <h3 className="text-xl font-semibold text-black mb-2 flex items-center">
                <ReportesIcon />
                <span className="ml-2">Reportes</span>
              </h3>
              <p className="text-gray-600 mb-4">Visualiza estadísticas y reportes del sistema.</p>
              <button 
                onClick={() => setActiveMenu('reportes')}
                className="w-full px-4 py-2 bg-lightgreen hover:bg-green-500 text-white rounded-md transition-colors flex items-center justify-center"
                aria-label="Ver Reportes"
              >
                <span>Ver Reportes</span>
                <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                </svg>
              </button>
            </div>
            
            {/* Caja de Configuración */}
            <div className="bg-white p-6 rounded-lg shadow-sm border-t-4 border-lightgreen hover:shadow-md transition-shadow">
              <h3 className="text-xl font-semibold text-black mb-2 flex items-center">
                <ConfiguracionIcon />
                <span className="ml-2">Configuración</span>
              </h3>
              <p className="text-gray-600 mb-4">Ajusta las preferencias y configuraciones del sistema.</p>
              <button 
                onClick={() => setActiveMenu('configuracion')}
                className="w-full px-4 py-2 bg-lightgreen hover:bg-green-500 text-white rounded-md transition-colors flex items-center justify-center"
                aria-label="Configurar"
              >
                <span>Configurar</span>
                <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                </svg>
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default Home;
