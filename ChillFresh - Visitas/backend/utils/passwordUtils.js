/**
 * Utilidades para el manejo seguro de contraseñas con Argon2
 */
import argon2 from 'argon2';
import crypto from 'crypto';

/**
 * Genera un saltUsuario aleatorio para el hash de contraseñas
 * @returns {string} Salt en formato hexadecimal
 */
export const generateSalt = () => {
  return crypto.randomBytes(16).toString('hex');
};

/**
 * Encripta una contraseña usando Argon2
 * @param {string} password - Contraseña en texto plano
 * @param {string} salt - SaltUsuario para la encriptación
 * @returns {Promise<string>} Hash de la contraseña
 */
export const hashPassword = async (password, salt) => {
  try {
    // Combinamos la contraseña con el salt
    const passwordWithSalt = password + salt;
    
    // Configuración recomendada para Argon2id
    const hash = await argon2.hash(passwordWithSalt, {
      type: argon2.argon2id, // Variante más segura de Argon2
      memoryCost: 65536,     // 64 MB en KiB
      timeCost: 3,           // Número de iteraciones
      parallelism: 4,        // Grado de paralelismo
      hashLength: 32         // Longitud del hash resultante
    });
    
    return hash;
  } catch (error) {
    console.error('Error al encriptar contraseña:', error);
    throw error;
  }
};

/**
 * Verifica si una contraseña coincide con un hash
 * @param {string} password - Contraseña en texto plano a verificar
 * @param {string} hash - Hash almacenado de la contraseña
 * @param {string} salt - SaltUsuario usado en la encriptación
 * @returns {Promise<boolean>} True si la contraseña coincide, false en caso contrario
 */
export const verifyPassword = async (password, hash, salt) => {
  try {
    // Combinamos la contraseña con el salt
    const passwordWithSalt = password + salt;
    
    // Verificamos si coincide con el hash almacenado
    return await argon2.verify(hash, passwordWithSalt);
  } catch (error) {
    console.error('Error al verificar contraseña:', error);
    throw error;
  }
};

export default {
  generateSalt,
  hashPassword,
  verifyPassword
};
