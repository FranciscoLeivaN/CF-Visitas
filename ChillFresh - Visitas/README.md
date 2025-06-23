# ChillFresh - Sistema de Gestión de Visitas
# Guía de Configuración y Uso

## Estructura de la Base de Datos (SQL Server)

El sistema utiliza una base de datos SQL Server existente con las siguientes tablas:

- **Usuarios:** Gestión de usuarios del sistema
- **Productores:** Datos de los productores (clientes)
- **Cultivos:** Tipos de cultivos disponibles
- **Inspectores:** Personal que realiza las visitas
- **Visitas:** Registro de visitas a productores
- **ArchivosAdjuntos:** Documentos relacionados a visitas
- **DestinatariosCorreos:** Destinatarios de informes de visitas
- **HistorialEnvios:** Historial de envío de informes

## Variables de Entorno

En el archivo `.env` del directorio `backend` debes configurar las siguientes variables:

```
DB_USER=tu_usuario_sql_server
DB_PASSWORD=tu_contraseña
DB_SERVER=localhost
DB_DATABASE=ChillFresh - Visitas
```

> Importante: Ajusta estos valores según tu configuración local de SQL Server.

## Ejecución del Backend

Para iniciar el servidor backend:

```bash
cd backend
npm install
npm run dev
```

El servidor se ejecutará en http://localhost:3000

## Ejecución del Frontend

Para iniciar la aplicación frontend:

```bash
cd frontend
npm install
npm run dev
```

La aplicación se ejecutará en http://localhost:5173

## Estructura del Proyecto

### Backend

- `server.js`: Punto de entrada de la API REST
- `config/db.js`: Configuración de conexión a SQL Server
- `models/`: Modelos para interactuar con la base de datos
- `routes/`: Rutas de la API REST
- `check-db.js`: Utilidad para verificar conexión y estructura de la BD

### Frontend

- `src/api.js`: Cliente para conectar con el backend
- `src/components/`: Componentes de React
- `src/App.jsx`: Componente principal y rutas

## API Endpoints

### Usuarios
- `GET /api/usuarios`: Lista todos los usuarios
- `GET /api/usuarios/:id`: Obtiene un usuario específico
- `POST /api/usuarios/login`: Inicia sesión
- `POST /api/usuarios`: Crea un nuevo usuario
- `PUT /api/usuarios/:id`: Actualiza un usuario
- `DELETE /api/usuarios/:id`: Elimina un usuario

### Productores
- `GET /api/productores`: Lista todos los productores
- `GET /api/productores/:id`: Obtiene un productor específico
- `POST /api/productores`: Crea un nuevo productor
- `PUT /api/productores/:id`: Actualiza un productor
- `DELETE /api/productores/:id`: Elimina un productor

### Cultivos
- `GET /api/cultivos`: Lista todos los cultivos
- `GET /api/cultivos/:id`: Obtiene un cultivo específico
- `POST /api/cultivos`: Crea un nuevo cultivo
- `PUT /api/cultivos/:id`: Actualiza un cultivo
- `DELETE /api/cultivos/:id`: Elimina un cultivo

### Inspectores
- `GET /api/inspectores`: Lista todos los inspectores
- `GET /api/inspectores/:id`: Obtiene un inspector específico
- `POST /api/inspectores`: Crea un nuevo inspector
- `PUT /api/inspectores/:id`: Actualiza un inspector
- `DELETE /api/inspectores/:id`: Elimina un inspector

### Visitas
- `GET /api/visitas`: Lista todas las visitas
- `GET /api/visitas/:id`: Obtiene una visita específica
- `GET /api/visitas/productor/:productorId`: Lista visitas de un productor
- `GET /api/visitas/inspector/:inspectorId`: Lista visitas de un inspector
- `POST /api/visitas`: Crea una nueva visita
- `PUT /api/visitas/:id`: Actualiza una visita
- `PUT /api/visitas/:id/enviar`: Marca una visita como enviada
- `DELETE /api/visitas/:id`: Elimina una visita
