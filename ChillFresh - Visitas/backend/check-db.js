/**
 * Script para verificar la conexión a la base de datos
 * y mostrar la estructura de las tablas existentes
 */

import { getConnection } from './config/db.js';

async function checkDatabase() {
  try {
    console.log('Intentando conectar a la base de datos...');
    const pool = await getConnection();
    console.log('Conexión exitosa a la base de datos!');
    
    // Consulta las tablas existentes
    const result = await pool.request().query(`
      SELECT 
        t.name AS TableName,
        c.name AS ColumnName,
        ty.name AS DataType,
        c.max_length AS MaxLength,
        c.is_nullable AS IsNullable
      FROM 
        sys.tables t
        INNER JOIN sys.columns c ON t.object_id = c.object_id
        INNER JOIN sys.types ty ON c.user_type_id = ty.user_type_id
      ORDER BY 
        t.name, c.column_id
    `);
    
    const tables = {};
    result.recordset.forEach(row => {
      if (!tables[row.TableName]) {
        tables[row.TableName] = [];
      }
      tables[row.TableName].push({
        column: row.ColumnName,
        dataType: row.DataType,
        maxLength: row.MaxLength,
        isNullable: row.IsNullable
      });
    });
    
    console.log('Tablas encontradas en la base de datos:');
    console.log(JSON.stringify(tables, null, 2));
    
    // Cerrar la conexión
    await pool.close();
    console.log('Conexión cerrada.');
  } catch (error) {
    console.error('Error al verificar la base de datos:', error);
  }
}

checkDatabase();
