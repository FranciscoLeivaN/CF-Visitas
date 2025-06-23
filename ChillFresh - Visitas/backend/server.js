/**
 * Archivo principal del servidor backend para ChillFresh
 */
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import { getConnection } from './config/db.js';
import { fileURLToPath } from 'url';
import path, { dirname } from 'path';

// Configurando __dirname para ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Importación de rutas
import userRoutes from './routes/user.routes.js';
import productorRoutes from './routes/productor.routes.js';
import cultivoRoutes from './routes/cultivo.routes.js';
import inspectorRoutes from './routes/inspector.routes.js';
import visitaRoutes from './routes/visita.routes.js';

// Importación de middlewares
import { authJwt } from './middleware/index.js';

// Inicialización de la aplicación Express
const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Prueba de conexión a la base de datos
getConnection()
  .then(() => {
    console.log('Base de datos conectada correctamente');
  })
  .catch(err => {
    console.error('Error al conectar a la base de datos:', err);
  });

// Rutas base
app.get('/', (req, res) => {
  res.json({ 
    message: 'API de ChillFresh - Gestión de Visitas',
    version: '1.0.0',
    date: new Date().toISOString()
  });
});

// Configuramos las rutas de la API
// En las rutas de usuarios, el login no requiere autenticación (esto se maneja dentro de las rutas)
app.use('/api/usuarios', userRoutes);
// El resto de rutas requieren autenticación
app.use('/api/productores', productorRoutes);
app.use('/api/cultivos', cultivoRoutes);
app.use('/api/inspectores', inspectorRoutes);
app.use('/api/visitas', visitaRoutes);

// Middleware para manejo de errores
app.use((err, req, res, next) => {
  console.error('Error en el servidor:', err);
  res.status(500).json({
    error: 'Error interno del servidor',
    details: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor ejecutándose en http://localhost:${PORT}`);
});
