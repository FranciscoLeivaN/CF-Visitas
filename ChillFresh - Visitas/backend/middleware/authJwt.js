import jwt from 'jsonwebtoken';
import config from '../config/jwt.js';

/**
 * Middleware para verificar el token JWT
 */
const verifyToken = (req, res, next) => {
  const token = req.headers['x-access-token'] || req.headers['authorization'];

  if (!token) {
    return res.status(403).json({ 
      success: false,
      message: 'Acceso denegado. Se requiere un token de autenticación.' 
    });
  }

  // Eliminar "Bearer " si está presente
  const tokenString = token.startsWith('Bearer ') ? token.slice(7, token.length) : token;

  try {
    const decoded = jwt.verify(tokenString, config.secret);
    req.user = decoded; // El token decodificado estará disponible en req.user
    
    // Log de información completa para debugging
    console.log('Token JWT verificado completo:', JSON.stringify(decoded, null, 2));
    console.log('Token JWT verificado (campos principales):', {
      usuario_id: decoded.id,
      name: decoded.name,
      role_id: decoded.role_id,
      role: decoded.role,
      email: decoded.email
    });
    
    next();
  } catch (error) {
    console.error('Error al verificar token JWT:', error.message);
    return res.status(401).json({ 
      success: false,
      message: 'Acceso no autorizado. Token inválido o expirado.' 
    });
  }
};

/**
 * Middleware para verificar si el usuario tiene el rol especificado
 * @param {string|Array} roles - Rol o roles permitidos
 */
const checkRole = (roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(403).json({
        success: false,
        message: 'Se requiere autenticación para acceder a este recurso.'
      });
    }

    const userRole = req.user.role;
    const userRoleId = req.user.role_id;
    
    console.log('Verificando permiso de rol:', {
      userRole,
      userRoleId,
      rolesPermitidos: roles,
      userDetails: req.user
    });
    
    // Si no hay roles especificados, cualquier usuario autenticado puede acceder
    if (!roles || roles.length === 0) {
      return next();
    }

    // Convertir a array si es un string
    const allowedRoles = Array.isArray(roles) ? roles : [roles];
    
    // Lista de roles que consideramos equivalentes a "administrador"
    const adminEquivalents = ['administrador', 'admin', 'Admin', 'ADMIN', 'ADMINISTRADOR'];
    
    // Verificar si el rol del usuario es alguno de los permitidos
    const hasRole = allowedRoles.some(role => {
      // Si estamos buscando "administrador", verificar todos los equivalentes
      if (role.toLowerCase() === 'administrador') {
        return userRole && adminEquivalents.includes(userRole);
      }
      // Para otros roles, verificar exact match case insensitive
      return userRole && role && userRole.toLowerCase() === role.toLowerCase();
    });

    if (!hasRole) {
      console.log('Acceso denegado por rol. Usuario tiene:', userRole, 'pero se requiere uno de:', allowedRoles);
      return res.status(403).json({
        success: false,
        message: 'Acceso denegado. No tiene los permisos necesarios.'
      });
    }

    console.log('Acceso permitido por rol:', userRole);
    next();
  };
};

export { verifyToken, checkRole };
export default verifyToken;
