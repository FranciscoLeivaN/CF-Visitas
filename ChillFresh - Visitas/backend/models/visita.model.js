/**
 * Modelo para visitas
 * Adaptado a la estructura de la tabla Visitas existente
 */
import { executeQuery } from '../config/db.js';

/**
 * Obtiene todas las visitas con datos relacionados
 * @returns {Promise<Array>} Lista de visitas
 */
export const getAllVisitas = async () => {
  const query = `
    SELECT 
      v.*,
      p.nombre as productor_nombre,
      p.codigo as productor_codigo,
      c.nombre as cultivo_nombre,
      i.nombre as inspector_nombre
    FROM 
      Visitas v
      INNER JOIN Productores p ON v.productor_id = p.productor_id
      INNER JOIN Cultivos c ON v.cultivo_id = c.cultivo_id
      INNER JOIN Inspectores i ON v.inspector_id = i.inspector_id
    ORDER BY 
      v.fecha DESC
  `;
  const result = await executeQuery(query);
  return result.recordset;
};

/**
 * Obtiene una visita por su ID
 * @param {number} id - ID de la visita
 * @returns {Promise<Object>} Datos de la visita
 */
export const getVisitaById = async (id) => {
  const query = `
    SELECT 
      v.*,
      p.nombre as productor_nombre,
      p.codigo as productor_codigo,
      c.nombre as cultivo_nombre,
      i.nombre as inspector_nombre
    FROM 
      Visitas v
      INNER JOIN Productores p ON v.productor_id = p.productor_id
      INNER JOIN Cultivos c ON v.cultivo_id = c.cultivo_id
      INNER JOIN Inspectores i ON v.inspector_id = i.inspector_id
    WHERE 
      v.visita_id = @id
  `;
  const result = await executeQuery(query, { id });
  return result.recordset[0];
};

/**
 * Obtiene visitas por productor
 * @param {number} productorId - ID del productor
 * @returns {Promise<Array>} Lista de visitas del productor
 */
export const getVisitasByProductor = async (productorId) => {
  const query = `
    SELECT 
      v.*,
      p.nombre as productor_nombre,
      p.codigo as productor_codigo,
      c.nombre as cultivo_nombre,
      i.nombre as inspector_nombre
    FROM 
      Visitas v
      INNER JOIN Productores p ON v.productor_id = p.productor_id
      INNER JOIN Cultivos c ON v.cultivo_id = c.cultivo_id
      INNER JOIN Inspectores i ON v.inspector_id = i.inspector_id
    WHERE 
      v.productor_id = @productorId
    ORDER BY 
      v.fecha DESC
  `;
  const result = await executeQuery(query, { productorId });
  return result.recordset;
};

/**
 * Obtiene visitas por inspector
 * @param {number} inspectorId - ID del inspector
 * @returns {Promise<Array>} Lista de visitas del inspector
 */
export const getVisitasByInspector = async (inspectorId) => {
  const query = `
    SELECT 
      v.*,
      p.nombre as productor_nombre,
      p.codigo as productor_codigo,
      c.nombre as cultivo_nombre,
      i.nombre as inspector_nombre
    FROM 
      Visitas v
      INNER JOIN Productores p ON v.productor_id = p.productor_id
      INNER JOIN Cultivos c ON v.cultivo_id = c.cultivo_id
      INNER JOIN Inspectores i ON v.inspector_id = i.inspector_id
    WHERE 
      v.inspector_id = @inspectorId
    ORDER BY 
      v.fecha DESC
  `;
  const result = await executeQuery(query, { inspectorId });
  return result.recordset;
};

/**
 * Crea una nueva visita
 * @param {Object} visitaData - Datos de la nueva visita
 * @returns {Promise<Object>} Resultado de la operación
 */
export const createVisita = async (visitaData) => {
  const { 
    fecha, 
    productor_id, 
    cultivo_id, 
    inspector_id, 
    observaciones, 
    recomendaciones 
  } = visitaData;
  
  const query = `
    INSERT INTO Visitas (
      fecha, 
      productor_id, 
      cultivo_id, 
      inspector_id, 
      observaciones, 
      recomendaciones, 
      informe_enviado,
      fecha_creacion
    )
    VALUES (
      @fecha, 
      @productor_id, 
      @cultivo_id, 
      @inspector_id, 
      @observaciones, 
      @recomendaciones, 
      0,
      GETDATE()
    );
    SELECT SCOPE_IDENTITY() AS visita_id;
  `;
  
  const result = await executeQuery(query, { 
    fecha, 
    productor_id, 
    cultivo_id, 
    inspector_id, 
    observaciones: observaciones || null, 
    recomendaciones: recomendaciones || null 
  });
  
  return result.recordset[0];
};

/**
 * Actualiza los datos de una visita existente
 * @param {number} id - ID de la visita a actualizar
 * @param {Object} visitaData - Nuevos datos de la visita
 * @returns {Promise<Object>} Resultado de la operación
 */
export const updateVisita = async (id, visitaData) => {
  const { 
    fecha, 
    productor_id, 
    cultivo_id, 
    inspector_id, 
    observaciones, 
    recomendaciones,
    informe_enviado
  } = visitaData;
  
  const query = `
    UPDATE Visitas
    SET fecha = @fecha,
        productor_id = @productor_id,
        cultivo_id = @cultivo_id,
        inspector_id = @inspector_id,
        observaciones = @observaciones,
        recomendaciones = @recomendaciones,
        informe_enviado = @informe_enviado,
        fecha_actualizacion = GETDATE()
    WHERE visita_id = @id;
  `;
  
  const result = await executeQuery(query, { 
    id, 
    fecha, 
    productor_id, 
    cultivo_id, 
    inspector_id, 
    observaciones, 
    recomendaciones,
    informe_enviado
  });
  
  return result;
};

/**
 * Marca una visita como enviada
 * @param {number} id - ID de la visita
 * @returns {Promise<Object>} Resultado de la operación
 */
export const marcarVisitaEnviada = async (id) => {
  const query = `
    UPDATE Visitas
    SET informe_enviado = 1,
        fecha_envio_informe = GETDATE(),
        fecha_actualizacion = GETDATE()
    WHERE visita_id = @id;
  `;
  
  const result = await executeQuery(query, { id });
  return result;
};

/**
 * Elimina una visita por su ID
 * @param {number} id - ID de la visita a eliminar
 * @returns {Promise<Object>} Resultado de la operación
 */
export const deleteVisita = async (id) => {
  // Primero eliminar registros relacionados en ArchivosAdjuntos
  await executeQuery('DELETE FROM ArchivosAdjuntos WHERE visita_id = @id', { id });
  
  // Luego eliminar registros relacionados en DestinatariosCorreos
  await executeQuery('DELETE FROM DestinatariosCorreos WHERE visita_id = @id', { id });
  
  // Luego eliminar registros relacionados en HistorialEnvios
  await executeQuery('DELETE FROM HistorialEnvios WHERE visita_id = @id', { id });
  
  // Finalmente eliminar la visita
  const query = 'DELETE FROM Visitas WHERE visita_id = @id';
  const result = await executeQuery(query, { id });
  return result;
};

export default {
  getAllVisitas,
  getVisitaById,
  getVisitasByProductor,
  getVisitasByInspector,
  createVisita,
  updateVisita,
  marcarVisitaEnviada,
  deleteVisita
};
