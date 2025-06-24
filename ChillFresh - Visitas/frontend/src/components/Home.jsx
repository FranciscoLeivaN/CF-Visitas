import React, { useState } from 'react';
import Layout from './Layout';
import Dashboard from './Dashboard';
import Visitas from './Visitas';
import Reportes from './Reportes';
import UserSettings from './UserSettings';
import Cultivos from './mantenedor/Cultivos';
import Inspectores from './mantenedor/Inspectores';
import Productores from './mantenedor/Productores';
import Usuarios from './mantenedor/Usuarios';

/**
 * Componente Home - Contenedor principal de la aplicación
 *
 * Este componente es el punto de entrada principal de la aplicación después del login.
 * Utiliza un componente Layout común y carga diferentes vistas según la sección seleccionada.
 *
 * @returns {JSX.Element} Componente de panel de administración
 */
function Home() {
  // Estado para controlar qué sección del menú está activa
  const [activeMenu, setActiveMenu] = useState('dashboard');
  return (
    <Layout activeMenu={activeMenu} setActiveMenu={setActiveMenu}>
      {/* Contenido dinámico basado en la opción seleccionada */}{' '}
      {activeMenu === 'dashboard' && <Dashboard setActiveMenu={setActiveMenu} />}
      {activeMenu === 'visitas' && <Visitas />}
      {activeMenu === 'reportes' && <Reportes />}
      {/* Secciones de Mantenedor */}
      {activeMenu === 'mantenedor-cultivos' && <Cultivos />}
      {activeMenu === 'mantenedor-inspectores' && <Inspectores />}
      {activeMenu === 'mantenedor-productores' && <Productores />}
      {activeMenu === 'mantenedor-usuarios' && <Usuarios />}
      {activeMenu === 'configuracion' && (
        <div className="max-w-3xl mx-auto">
          <UserSettings />
        </div>
      )}
    </Layout>
  );
}

export default Home;
