/**
 * Modelo para usuarios del sistema
 * Adaptado a la estructura de la tabla Usuarios existente
 */
import { executeQuery } from '../config/db.js';
import { generateSalt, hashPassword, verifyPassword } from '../utils/passwordUtils.js';

/**
 * Obtiene todos los usuarios
 * @returns {Promise<Array>} Lista de usuarios
 */
export const getAllUsers = async () => {
  const query = 'SELECT * FROM Usuarios';
  const result = await executeQuery(query);
  return result.recordset;
};

/**
 * Obtiene un usuario por su ID
 * @param {string} id - ID del usuario (usuario_id)
 * @returns {Promise<Object>} Datos del usuario
 */
export const getUserById = async (id) => {
  const query = 'SELECT * FROM Usuarios WHERE usuario_id = @id';
  const result = await executeQuery(query, { id });
  return result.recordset[0];
};

/**
 * Valida las credenciales de un usuario para el login
 * @param {string} usuarioId - ID del usuario
 * @param {string} password - Contraseña del usuario
 * @returns {Promise<Object|null>} Datos del usuario si las credenciales son válidas
 */
export const validateUser = async (usuarioId, password) => {
  // Primero obtenemos el usuario por su ID
  const query = 'SELECT * FROM Usuarios WHERE usuario_id = @usuarioId';
  const result = await executeQuery(query, { usuarioId });
  
  const user = result.recordset[0];
  
  // Si no existe el usuario, retornamos null
  if (!user) {
    return null;
  }
    try {
    // Verificamos si el usuario tiene saltUsuario para usar Argon2id
    if (user.saltUsuario) {
      // Verificación de contraseña con Argon2id
      const isValid = await verifyPassword(password, user.passUsuario, user.saltUsuario);
      return isValid ? user : null;
    } else {
      // Si el usuario no tiene saltUsuario, necesitamos migrar su contraseña
      console.log(`Usuario ${usuarioId} no tiene saltUsuario, es necesario migrar su contraseña a Argon2id`);
      
      // Verificamos la contraseña en texto plano (formato antiguo)
      // IMPORTANTE: Esta parte solo debe usarse durante la migración
      const legacyQuery = 'SELECT * FROM Usuarios WHERE usuario_id = @usuarioId AND passUsuario = @password';
      const legacyResult = await executeQuery(legacyQuery, { usuarioId, password });
      
      if (legacyResult.recordset[0]) {
        // Si la contraseña antigua es válida, aprovechamos para migrar a Argon2id
        try {
          // Generamos nuevo saltUsuario y hash con Argon2id
          const saltUsuario = generateSalt();
          const hashedPassword = await hashPassword(password, saltUsuario);
          
          // Actualizamos el usuario con la nueva contraseña hasheada y el salt
          const updateQuery = `
            UPDATE Usuarios
            SET passUsuario = @hashedPassword,
                saltUsuario = @saltUsuario
            WHERE usuario_id = @usuarioId;
          `;
          
          await executeQuery(updateQuery, { 
            usuarioId, 
            hashedPassword, 
            saltUsuario
          });
          
          console.log(`Contraseña del usuario ${usuarioId} migrada exitosamente a Argon2id`);
          
          // Retornamos el usuario original para permitir el login
          return legacyResult.recordset[0];
        } catch (migrationError) {
          console.error('Error al migrar contraseña:', migrationError);
          // Permitimos el login a pesar del error de migración
          return legacyResult.recordset[0];
        }
      }
      // Si no encuentra el usuario con contraseña antigua, retorna null
      return null;
    }
  } catch (error) {
    console.error('Error al validar contraseña:', error);
    return null;
  }
};

/**
 * Crea un nuevo usuario
 * @param {Object} userData - Datos del nuevo usuario
 * @returns {Promise<Object>} Resultado de la operación
 */
export const createUser = async (userData) => {
  const { usuarioId, nombreCompleto, password, telefono } = userData;
    // Generar un saltUsuario único para este usuario
  const saltUsuario = generateSalt();
  
  // Hash de la contraseña usando Argon2
  const hashedPassword = await hashPassword(password, saltUsuario);
    const query = `
    INSERT INTO Usuarios (usuario_id, nombreCompleto, passUsuario, telefono, saltUsuario)
    VALUES (@usuarioId, @nombreCompleto, @hashedPassword, @telefono, @salt);
    SELECT @usuarioId AS usuario_id;
  `;  const result = await executeQuery(query, { 
    usuarioId, 
    nombreCompleto, 
    hashedPassword, 
    telefono,
    salt: saltUsuario 
  });
  return result.recordset[0];
};

/**
 * Actualiza los datos de un usuario existente
 * @param {string} id - ID del usuario a actualizar
 * @param {Object} userData - Nuevos datos del usuario
 * @returns {Promise<Object>} Resultado de la operación
 */
export const updateUser = async (id, userData) => {
  const { nombreCompleto, password, telefono } = userData;
  
  // Si no hay cambio de contraseña, solo actualizamos los otros campos
  if (!password) {
    const queryWithoutPassword = `
      UPDATE Usuarios
      SET nombreCompleto = @nombreCompleto, 
          telefono = @telefono
      WHERE usuario_id = @id;
    `;
    return await executeQuery(queryWithoutPassword, { 
      id, 
      nombreCompleto, 
      telefono 
    });
  }
    // Si hay cambio de contraseña, generamos un nuevo saltUsuario y hash
  const saltUsuario = generateSalt();
  const hashedPassword = await hashPassword(password, saltUsuario);
    const query = `
    UPDATE Usuarios
    SET nombreCompleto = @nombreCompleto, 
        passUsuario = @hashedPassword, 
        telefono = @telefono,
        saltUsuario = @salt
    WHERE usuario_id = @id;
  `;
    const result = await executeQuery(query, { 
    id, 
    nombreCompleto, 
    hashedPassword, 
    telefono,
    salt: saltUsuario 
  });
  return result;
};

/**
 * Elimina un usuario por su ID
 * @param {string} id - ID del usuario a eliminar
 * @returns {Promise<Object>} Resultado de la operación
 */
export const deleteUser = async (id) => {
  const query = 'DELETE FROM Usuarios WHERE usuario_id = @id';
  const result = await executeQuery(query, { id });
  return result;
};

export default {
  getAllUsers,
  getUserById,
  validateUser,
  createUser,
  updateUser,
  deleteUser
};
