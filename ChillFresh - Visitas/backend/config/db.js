/**
 * Configuración de la conexión a la base de datos SQL Server
 */
import dotenv from 'dotenv';
import sql from 'mssql';

// Cargamos las variables de entorno
dotenv.config();

// Configuración de la conexión
const dbConfig = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  server: process.env.DB_SERVER,
  database: process.env.DB_DATABASE,
  options: {
    encrypt: false, // Para conexiones locales
    trustServerCertificate: true, // Para desarrollo local
    enableArithAbort: true // Necesario para SQL Server
  },
  pool: {
    max: 10,
    min: 0,
    idleTimeoutMillis: 30000
  }
};

/**
 * Establece una conexión con la base de datos SQL Server
 * @returns {Promise<sql.ConnectionPool>} Pool de conexión a la base de datos
 */
export const getConnection = async () => {
  try {
    const pool = await sql.connect(dbConfig);
    console.log('Conectado a SQL Server');
    return pool;
  } catch (error) {
    console.error('Error al conectar a SQL Server:', error);
    throw error;
  }
};

/**
 * Ejecuta una consulta SQL de forma segura
 * @param {string} query - Consulta SQL a ejecutar
 * @param {Object} [params={}] - Parámetros para la consulta
 * @returns {Promise<any>} - Resultado de la consulta
 */
export const executeQuery = async (query, params = {}) => {
  try {
    const pool = await getConnection();
    const request = pool.request();
    
    // Agregamos cada parámetro a la consulta
    Object.keys(params).forEach(key => {
      request.input(key, params[key]);
    });
    
    const result = await request.query(query);
    return result;
  } catch (error) {
    console.error('Error al ejecutar consulta SQL:', error);
    throw error;
  }
};

export default {
  getConnection,
  executeQuery
};
