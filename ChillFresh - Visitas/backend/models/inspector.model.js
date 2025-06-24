/**
 * Modelo para inspectores
 */
import { executeQuery } from '../config/db.js';

/**
 * Obtiene todos los inspectores
 * @returns {Promise<Array>} Lista de inspectores
 */
export const getAllInspectores = async () => {
  const query = 'SELECT * FROM Inspectores ORDER BY nombre';
  const result = await executeQuery(query);
  return result.recordset;
};

/**
 * Obtiene un inspector por su ID
 * @param {number} id - ID del inspector
 * @returns {Promise<Object>} Datos del inspector
 */
export const getInspectorById = async id => {
  const query = 'SELECT * FROM Inspectores WHERE inspector_id = @id';
  const result = await executeQuery(query, { id });
  return result.recordset[0];
};

/**
 * Crea un nuevo inspector
 * @param {Object} inspectorData - Datos del nuevo inspector
 * @returns {Promise<Object>} Resultado de la operación
 */
export const createInspector = async inspectorData => {
  const { nombre, email } = inspectorData;
  const query = `
    INSERT INTO Inspectores (nombre, email, activo, fecha_creacion)
    VALUES (@nombre, @email, 1, GETDATE());
    SELECT SCOPE_IDENTITY() AS inspector_id;
  `;
  const result = await executeQuery(query, { nombre, email });
  return result.recordset[0];
};

/**
 * Actualiza los datos de un inspector existente
 * @param {number} id - ID del inspector a actualizar
 * @param {Object} inspectorData - Nuevos datos del inspector
 * @returns {Promise<Object>} Resultado de la operación
 */
export const updateInspector = async (id, inspectorData) => {
  const { nombre, email, activo } = inspectorData;
  const query = `
    UPDATE Inspectores
    SET nombre = @nombre,
        email = @email,
        activo = @activo
    WHERE inspector_id = @id;
  `;
  const result = await executeQuery(query, { id, nombre, email, activo });
  return result;
};

/**
 * Elimina un inspector por su ID
 * @param {number} id - ID del inspector a eliminar
 * @returns {Promise<Object>} Resultado de la operación
 */
export const deleteInspector = async id => {
  const query = 'DELETE FROM Inspectores WHERE inspector_id = @id';
  const result = await executeQuery(query, { id });
  return result;
};

export default {
  getAllInspectores,
  getInspectorById,
  createInspector,
  updateInspector,
  deleteInspector,
};
