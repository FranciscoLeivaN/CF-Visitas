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
export const getUserById = async id => {
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
      console.log(
        `Usuario ${usuarioId} no tiene saltUsuario, es necesario migrar su contraseña a Argon2id`
      );

      // Verificamos la contraseña en texto plano (formato antiguo)
      // IMPORTANTE: Esta parte solo debe usarse durante la migración
      const legacyQuery =
        'SELECT * FROM Usuarios WHERE usuario_id = @usuarioId AND passUsuario = @password';
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
            saltUsuario,
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
export const createUser = async userData => {
  const { usuarioId, nombreCompleto, password, telefono, role_id } = userData;
  // Generar un saltUsuario único para este usuario
  const saltUsuario = generateSalt();

  // Hash de la contraseña usando Argon2
  const hashedPassword = await hashPassword(password, saltUsuario);
  
  // Log the role_id value
  console.log('In createUser model, rol_id:', role_id);
  
  const query = `
    INSERT INTO Usuarios (usuario_id, nombreCompleto, passUsuario, telefono, saltUsuario, rol_id)
    VALUES (@usuarioId, @nombreCompleto, @hashedPassword, @telefono, @salt, @rolId);
    SELECT @usuarioId AS usuario_id;
  `;
  const result = await executeQuery(query, {
    usuarioId,
    nombreCompleto,
    hashedPassword,
    telefono,
    salt: saltUsuario,
    rolId: role_id,
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
  const { nombreCompleto, password, telefono, role_id, activo } = userData;
  
  console.log('updateUser - Datos recibidos:', { id, nombreCompleto, telefono, role_id, activo, hasPassword: !!password });
  
  try {
    // Si no hay cambio de contraseña, solo actualizamos los otros campos
    if (!password) {
      // Solo incluimos rol_id y activo si están definidos
      let updateFields = [];
      let params = {
        id,
        nombreCompleto: nombreCompleto || '',
        telefono: telefono !== undefined ? telefono : null
      };
      
      // Si role_id está definido, añadirlo a la actualización
      if (role_id !== undefined && role_id !== null) {
        updateFields.push("rol_id = @rolId");
        params.rolId = role_id;
      }
      
      // Si activo está definido, añadirlo a la actualización
      if (activo !== undefined) {
        updateFields.push("activo = @activo");
        params.activo = activo;
      }
      
      // Construir la consulta completa
      let setFields = ["nombreCompleto = @nombreCompleto", "telefono = @telefono"];
      if (updateFields.length > 0) {
        setFields = setFields.concat(updateFields);
      }
      
      let fullQuery = `
        UPDATE Usuarios
        SET ${setFields.join(', ')}
        WHERE usuario_id = @id;
      `;
      
      console.log('updateUser - Query sin contraseña:', fullQuery);
      console.log('updateUser - Parámetros:', params);
      
      return await executeQuery(fullQuery, params);
    } else {
      // Si hay cambio de contraseña, generamos un nuevo saltUsuario y hash
      const saltUsuario = generateSalt();
      const hashedPassword = await hashPassword(password, saltUsuario);
      
      // Similar al caso anterior, solo incluimos los campos que estén definidos
      let updateFields = [
        "nombreCompleto = @nombreCompleto", 
        "passUsuario = @hashedPassword",
        "telefono = @telefono",
        "saltUsuario = @salt"
      ];
      
      let params = {
        id,
        nombreCompleto: nombreCompleto || '',
        hashedPassword,
        telefono: telefono !== undefined ? telefono : null,
        salt: saltUsuario
      };
      
      // Si role_id está definido, añadirlo a la actualización
      if (role_id !== undefined && role_id !== null) {
        updateFields.push("rol_id = @rolId");
        params.rolId = role_id;
      }
      
      // Si activo está definido, añadirlo a la actualización
      if (activo !== undefined) {
        updateFields.push("activo = @activo");
        params.activo = activo;
      }
      
      const query = `
        UPDATE Usuarios
        SET ${updateFields.join(', ')}
        WHERE usuario_id = @id;
      `;
      
      console.log('updateUser - Query con contraseña:', query);
      console.log('updateUser - Parámetros:', { ...params, hashedPassword: '[PROTECTED]' });
      
      return await executeQuery(query, params);
    }
  } catch (error) {
    console.error('Error en updateUser:', error);
    throw error;
  }
};

/**
 * Elimina un usuario por su ID
 * @param {string} id - ID del usuario a eliminar
 * @returns {Promise<Object>} Resultado de la operación
 */
export const deleteUser = async id => {
  const query = 'DELETE FROM Usuarios WHERE usuario_id = @id';
  const result = await executeQuery(query, { id });
  return result;
};

/**
 * Obtiene todos los roles disponibles en el sistema
 * @returns {Promise<Array>} Lista de roles
 */
export const getAllRoles = async () => {
  const query = 'SELECT * FROM Roles';
  const result = await executeQuery(query);
  return result.recordset;
};

export default {
  getAllUsers,
  getUserById,
  validateUser,
  createUser,
  updateUser,
  deleteUser,
  getAllRoles,
};
