/**
 * Modelo para cultivos
 */
import { executeQuery } from '../config/db.js';

/**
 * Obtiene todos los cultivos
 * @returns {Promise<Array>} Lista de cultivos
 */
export const getAllCultivos = async () => {
  const query = 'SELECT * FROM Cultivos ORDER BY nombre';
  const result = await executeQuery(query);
  return result.recordset;
};

/**
 * Obtiene un cultivo por su ID
 * @param {number} id - ID del cultivo
 * @returns {Promise<Object>} Datos del cultivo
 */
export const getCultivoById = async id => {
  const query = 'SELECT * FROM Cultivos WHERE cultivo_id = @id';
  const result = await executeQuery(query, { id });
  return result.recordset[0];
};

/**
 * Crea un nuevo cultivo
 * @param {Object} cultivoData - Datos del nuevo cultivo
 * @returns {Promise<Object>} Resultado de la operación
 */
export const createCultivo = async cultivoData => {
  const { nombre, descripcion } = cultivoData;
  const query = `
    INSERT INTO Cultivos (nombre, descripcion)
    VALUES (@nombre, @descripcion);
    SELECT SCOPE_IDENTITY() AS cultivo_id;
  `;
  const result = await executeQuery(query, { nombre, descripcion });
  return result.recordset[0];
};

/**
 * Actualiza los datos de un cultivo existente
 * @param {number} id - ID del cultivo a actualizar
 * @param {Object} cultivoData - Nuevos datos del cultivo
 * @returns {Promise<Object>} Resultado de la operación
 */
export const updateCultivo = async (id, cultivoData) => {
  const { nombre, descripcion } = cultivoData;
  const query = `
    UPDATE Cultivos
    SET nombre = @nombre,
        descripcion = @descripcion
    WHERE cultivo_id = @id;
  `;
  const result = await executeQuery(query, { id, nombre, descripcion });
  return result;
};

/**
 * Elimina un cultivo por su ID
 * @param {number} id - ID del cultivo a eliminar
 * @returns {Promise<Object>} Resultado de la operación
 */
export const deleteCultivo = async id => {
  const query = 'DELETE FROM Cultivos WHERE cultivo_id = @id';
  const result = await executeQuery(query, { id });
  return result;
};

export default {
  getAllCultivos,
  getCultivoById,
  createCultivo,
  updateCultivo,
  deleteCultivo,
};
