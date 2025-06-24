import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../utils/useAuth';
import {
  DashboardIcon,
  VisitasIcon,
  ReportesIcon,
  ConfiguracionIcon,
  MenuIcon,
  NotificacionIcon,
  UserIcon,
  LogoutIcon,
  MantenedorIcon,
  ChevronDownIcon,
  CultivosIcon,
  InspectoresIcon,
  ProductoresIcon,
} from './Icons';

/**
 * Componente Layout - Estructura base de la aplicación
 *
 * Este componente implementa la estructura común de la aplicación que incluye
 * la barra lateral y el encabezado superior. Recibe como children el contenido
 * específico de cada página.
 *
 * @param {Object} props - Propiedades del componente
 * @param {React.ReactNode} props.children - Contenido a mostrar en el área principal
 * @param {string} props.activeMenu - Sección activa del menú
 * @param {Function} props.setActiveMenu - Función para cambiar la sección activa
 * @returns {JSX.Element} Componente de layout
 */
function Layout({ children, activeMenu, setActiveMenu }) {
  const navigate = useNavigate();
  // Estado para controlar si la barra lateral está abierta o contraída
  const [sidebarOpen, setSidebarOpen] = useState(true);
  // Estado para controlar si el acordeón de mantenedor está abierto
  const [mantenedorOpen, setMantenedorOpen] = useState(false);
  // Obtener información del usuario y función de logout del contexto de autenticación
  const { user, logout } = useAuth();

  /**
   * Maneja el cierre de sesión
   * Limpia localStorage y redirige al login
   */
  const handleLogout = () => {
    logout(); // Usa la función de logout del contexto de autenticación
    navigate('/');
  };

  /**
   * Alterna el estado de la barra lateral entre abierta y contraída
   */ const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  /**
   * Maneja el clic en una opción del mantenedor
   * @param {string} option - Opción seleccionada del mantenedor
   */
  const handleMantenedorOption = option => {
    setActiveMenu(option);
    // Opcional: puedes mantener el menú abierto o cerrarlo automáticamente
    // setMantenedorOpen(false);
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Barra lateral (Sidebar) - Se adapta entre versión expandida y contraída */}
      <div
        className={`${sidebarOpen ? 'w-64' : 'w-20'} bg-black text-white transition-all duration-300 ease-in-out overflow-y-auto`}
      >
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
            aria-label={sidebarOpen ? 'Contraer menú' : 'Expandir menú'}
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

          {/* Opción Mantenedor con Acordeón - Solo visible para administradores */}
          {user && (user?.role?.toLowerCase() === 'administrador' || user?.nombreRol?.toLowerCase() === 'administrador') && (
            <div className="px-4 py-2">
              <button
                onClick={() => setMantenedorOpen(!mantenedorOpen)}
                className={`flex items-center justify-between w-full p-2 rounded-md transition-colors ${
                  [
                    'mantenedor',
                    'mantenedor-cultivos',
                    'mantenedor-inspectores',
                    'mantenedor-productores',
                    'mantenedor-usuarios',
                  ].includes(activeMenu)
                    ? 'bg-lightgreen text-black'
                    : 'hover:bg-gray-800'
                }`}
              >
                <div className="flex items-center">
                  <MantenedorIcon />
                  {sidebarOpen && <span className="ml-3">Mantenedor</span>}
                </div>
                {sidebarOpen && (
                  <ChevronDownIcon
                    className={`transition-transform ${mantenedorOpen ? 'transform rotate-180' : ''}`}
                  />
                )}
              </button>

              {/* Submenú del Mantenedor - Visible solo cuando mantenedorOpen es true */}
              {sidebarOpen && mantenedorOpen && (
                <div className="mt-2 ml-6 space-y-2">
                  {' '}
                  {/* Opción Cultivos */}
                  <button
                  onClick={() => handleMantenedorOption('mantenedor-cultivos')}
                  className={`flex items-center w-full p-2 rounded-md transition-colors ${
                    activeMenu === 'mantenedor-cultivos' ? 'bg-gray-700' : 'hover:bg-gray-700'
                  }`}
                >
                  <CultivosIcon />
                  <span className="ml-3">Cultivos</span>
                </button>
                {/* Opción Inspectores */}
                <button
                  onClick={() => handleMantenedorOption('mantenedor-inspectores')}
                  className={`flex items-center w-full p-2 rounded-md transition-colors ${
                    activeMenu === 'mantenedor-inspectores' ? 'bg-gray-700' : 'hover:bg-gray-700'
                  }`}
                >
                  <InspectoresIcon />
                  <span className="ml-3">Inspectores</span>
                </button>
                {/* Opción Productores */}
                <button
                  onClick={() => handleMantenedorOption('mantenedor-productores')}
                  className={`flex items-center w-full p-2 rounded-md transition-colors ${
                    activeMenu === 'mantenedor-productores' ? 'bg-gray-700' : 'hover:bg-gray-700'
                  }`}
                >
                  <ProductoresIcon />
                  <span className="ml-3">Productores</span>
                </button>
                {/* Opción Usuarios */}
                <button
                  onClick={() => handleMantenedorOption('mantenedor-usuarios')}
                  className={`flex items-center w-full p-2 rounded-md transition-colors ${
                    activeMenu === 'mantenedor-usuarios' ? 'bg-gray-700' : 'hover:bg-gray-700'
                  }`}
                >
                  <UserIcon />
                  <span className="ml-3">Usuarios</span>
                </button>
                </div>
              )}
            </div>
          )}

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
        {' '}
        {/* Encabezado superior */}
        <header className="bg-white shadow-sm z-10">
          <div className="px-4 py-3 flex justify-between items-center">
            {/* Breadcrumb y título de la sección activa */}
            <div>
              {' '}
              <div className="flex items-center py-2">
                <nav className="flex w-full" aria-label="Breadcrumb">
                  <ol className="inline-flex items-center space-x-1 md:space-x-2">
                    <li className="inline-flex items-center">
                      {' '}
                      <a
                        href="#"
                        onClick={e => {
                          e.preventDefault();
                          setActiveMenu('dashboard');
                        }}
                        className={`text-base ${activeMenu === 'dashboard' ? 'text-lightgreen font-medium' : 'text-gray-500 hover:text-lightgreen'}`}
                      >
                        Inicio
                      </a>
                    </li>
                    {activeMenu.startsWith('mantenedor') && (
                      <>
                        <li>
                          <div className="flex items-center">
                            <svg
                              className="w-4 h-4 text-gray-400"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                fillRule="evenodd"
                                d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                                clipRule="evenodd"
                              ></path>
                            </svg>{' '}
                            <a
                              href="#"
                              onClick={e => {
                                e.preventDefault();
                                setMantenedorOpen(true);
                              }}
                              className="text-gray-500 hover:text-lightgreen ml-1 md:ml-2 text-base"
                            >
                              Mantenedor
                            </a>
                          </div>
                        </li>
                        <li aria-current="page">
                          <div className="flex items-center">
                            <svg
                              className="w-4 h-4 text-gray-400"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                fillRule="evenodd"
                                d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                                clipRule="evenodd"
                              ></path>
                            </svg>{' '}
                            <span className="text-lightgreen ml-1 md:ml-2 text-base font-medium">
                              {activeMenu === 'mantenedor-cultivos' && 'Cultivos'}
                              {activeMenu === 'mantenedor-inspectores' && 'Inspectores'}
                              {activeMenu === 'mantenedor-productores' && 'Productores'}
                              {activeMenu === 'mantenedor-usuarios' && 'Usuarios'}
                            </span>
                          </div>
                        </li>
                      </>
                    )}
                    {!activeMenu.startsWith('mantenedor') && activeMenu !== 'dashboard' && (
                      <li aria-current="page">
                        <div className="flex items-center">
                          <svg
                            className="w-4 h-4 text-gray-400"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              fillRule="evenodd"
                              d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                              clipRule="evenodd"
                            ></path>
                          </svg>{' '}
                          <span className="text-lightgreen ml-1 md:ml-2 text-base font-medium">
                            {activeMenu === 'visitas' && 'Gestión de Visitas'}
                            {activeMenu === 'reportes' && 'Reportes'}
                            {activeMenu === 'configuracion' && 'Configuración'}
                          </span>
                        </div>
                      </li>
                    )}
                  </ol>{' '}
                </nav>
              </div>{' '}
              {/* Eliminamos los h1 para todas las secciones, dejando solo el breadcrumb */}
            </div>
            <div className="flex items-center space-x-4">
              {/* Botón de notificaciones */}
              <button className="p-1 rounded-full hover:bg-gray-100" aria-label="Notificaciones">
                <NotificacionIcon />
              </button>
              {/* Información del usuario */}
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-full bg-lightgreen flex items-center justify-center text-white">
                  <UserIcon />
                </div>
                <div className="hidden md:block">
                  <span className="text-black">{user?.name || 'Usuario'}</span>
                  {user?.role && (
                    <span className="ml-2 text-xs bg-blue-500 text-white px-2 py-0.5 rounded">
                      {user.role}
                    </span>
                  )}
                </div>
                
                {/* Información de depuración en consola - Solo en desarrollo */}
                {user && console.log('Usuario en Layout:', user)}
              </div>
            </div>
          </div>
        </header>
        {/* Contenido específico de cada página */}
        <main className="flex-1 overflow-y-auto p-4 bg-gray-100">{children}</main>
      </div>
    </div>
  );
}

export default Layout;
