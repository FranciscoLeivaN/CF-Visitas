/**
 * Modelo para productores (antes "clientes")
 * Adaptado a la estructura de la tabla Productores existente
 */
import { executeQuery } from '../config/db.js';

/**
 * Obtiene todos los productores
 * @returns {Promise<Array>} Lista de productores
 */
export const getAllProductores = async () => {
  const query = 'SELECT * FROM Productores ORDER BY nombre';
  const result = await executeQuery(query);
  return result.recordset;
};

/**
 * Obtiene un productor por su ID
 * @param {number} id - ID del productor
 * @returns {Promise<Object>} Datos del productor
 */
export const getProductorById = async (id) => {
  const query = 'SELECT * FROM Productores WHERE productor_id = @id';
  const result = await executeQuery(query, { id });
  return result.recordset[0];
};

/**
 * Crea un nuevo productor
 * @param {Object} productorData - Datos del nuevo productor
 * @returns {Promise<Object>} Resultado de la operación
 */
export const createProductor = async (productorData) => {
  const { codigo, nombre, ubicacion, email1, email2, email3 } = productorData;
  const query = `
    INSERT INTO Productores (codigo, nombre, ubicacion, email1, email2, email3, fecha_creacion)
    VALUES (@codigo, @nombre, @ubicacion, @email1, @email2, @email3, GETDATE());
    SELECT SCOPE_IDENTITY() AS productor_id;
  `;
  const result = await executeQuery(query, { 
    codigo, 
    nombre, 
    ubicacion, 
    email1, 
    email2, 
    email3 
  });
  return result.recordset[0];
};

/**
 * Actualiza los datos de un productor existente
 * @param {number} id - ID del productor a actualizar
 * @param {Object} productorData - Nuevos datos del productor
 * @returns {Promise<Object>} Resultado de la operación
 */
export const updateProductor = async (id, productorData) => {
  const { codigo, nombre, ubicacion, email1, email2, email3 } = productorData;
  const query = `
    UPDATE Productores
    SET codigo = @codigo,
        nombre = @nombre, 
        ubicacion = @ubicacion, 
        email1 = @email1,
        email2 = @email2,
        email3 = @email3,
        fecha_actualizacion = GETDATE()
    WHERE productor_id = @id;
  `;
  const result = await executeQuery(query, { 
    id, 
    codigo,
    nombre, 
    ubicacion, 
    email1, 
    email2, 
    email3 
  });
  return result;
};

/**
 * Elimina un productor por su ID
 * @param {number} id - ID del productor a eliminar
 * @returns {Promise<Object>} Resultado de la operación
 */
export const deleteProductor = async (id) => {
  const query = 'DELETE FROM Productores WHERE productor_id = @id';
  const result = await executeQuery(query, { id });
  return result;
};

export default {
  getAllProductores,
  getProductorById,
  createProductor,
  updateProductor,
  deleteProductor
};
