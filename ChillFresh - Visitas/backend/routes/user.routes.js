/**
 * Rutas para usuarios
 * Adaptado a la estructura de la tabla Usuarios existente
 */
import express from 'express';
import * as userModel from '../models/user.model.js';
import jwt from 'jsonwebtoken';
import jwtConfig from '../config/jwt.js';
import { authJwt, verifyToken, checkRole } from '../middleware/index.js';

const router = express.Router();

/**
 * Ruta para obtener todos los usuarios
 * GET /api/usuarios
 * @access Solo Admin
 */
router.get('/', [verifyToken, checkRole(['administrador'])], async (req, res) => {
  try {
    const users = await userModel.getAllUsers();
    // No enviamos las contraseñas al cliente
    const safeUsers = users.map(user => {
      const { passUsuario, ...safeUser } = user;
      return safeUser;
    });

    res.json(safeUsers);
  } catch (error) {
    console.error('Error al obtener usuarios:', error);
    res.status(500).json({ error: 'Error al obtener usuarios' });
  }
});

/**
 * Ruta para obtener todos los roles disponibles
 * GET /api/usuarios/roles
 */
router.get('/roles', async (req, res) => {
  try {
    console.log('Obteniendo roles...');
    const roles = await userModel.getAllRoles();
    console.log('Roles obtenidos:', roles);
    res.json(roles);
  } catch (error) {
    console.error('Error al obtener roles:', error);
    res.status(500).json({ error: 'Error al obtener roles' });
  }
});

/**
 * Ruta para obtener un usuario por su ID
 * GET /api/usuarios/:id
 * @access Usuario autenticado (pero solo puede ver sus propios datos) o Admin (puede ver cualquier usuario)
 */
router.get('/:id', [verifyToken], async (req, res) => {
  try {
    const userId = req.params.id;
    
    // Lista de roles que consideramos equivalentes a "administrador"
    const adminEquivalents = ['administrador', 'admin', 'Admin', 'ADMIN', 'ADMINISTRADOR'];
    
    // Si no es admin y no es su propio perfil, denegar acceso
    const userRole = req.user.role || '';
    console.log('GET /:id - Usuario actual:', req.user.id, 'Role:', userRole, 'Solicitando ver usuario:', userId);
    
    const isAdmin = adminEquivalents.includes(userRole);
    
    if (!isAdmin && req.user.id !== userId) {
      console.log('Acceso denegado: el usuario no es administrador ni es su propio perfil');
      console.log('Rol del usuario:', userRole);
      console.log('¿Es admin?', isAdmin);
      
      return res.status(403).json({ 
        success: false,
        message: 'Acceso denegado. Solo puede ver su propio perfil.' 
      });
    }
    
    console.log('Acceso permitido para ver usuario:', userId);
    const user = await userModel.getUserById(userId);

    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    // No enviamos la contraseña al cliente
    const { passUsuario, ...safeUser } = user;
    res.json(safeUser);
  } catch (error) {
    console.error('Error al obtener usuario:', error);
    res.status(500).json({ error: 'Error al obtener usuario' });
  }
});

/**
 * Ruta para iniciar sesión
 * POST /api/usuarios/login
 */
router.post('/login', async (req, res) => {
  try {
    const { usuario_id, password } = req.body;

    if (!usuario_id || !password) {
      return res.status(400).json({ error: 'ID de usuario y contraseña son requeridos' });
    }

    const user = await userModel.validateUser(usuario_id, password);

    if (!user) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    // Omitimos la contraseña en la respuesta
    const { passUsuario, ...userInfo } = user;

    // Obtener información del rol si existe
    let rolInfo = null;
    if (userInfo.rol_id) {
      try {
        const roles = await userModel.getAllRoles();
        rolInfo = roles.find(rol => rol.rol_id === userInfo.rol_id);
        console.log('Información del rol encontrada:', rolInfo);
      } catch (error) {
        console.warn('No se pudo obtener información del rol:', error);
      }
    }

    // Log de información antes de generar el token
    console.log('Preparando token JWT con datos:', {
      id: userInfo.usuario_id,
      name: userInfo.nombreCompleto,
      role_id: userInfo.rol_id,
      nombreRol: rolInfo ? rolInfo.nombreRol : 'Sin rol'
    });

    // Generar token JWT con la información del usuario incluyendo el rol
    const token = jwt.sign(
      {
        id: userInfo.usuario_id,
        name: userInfo.nombreCompleto,
        email: userInfo.email || usuario_id, // Si no hay email, usar el ID como fallback
        role: rolInfo ? rolInfo.nombreRol.toLowerCase() : 'normal' // Asegurar que el rol esté en minúsculas y sea 'administrador' o 'normal'
      },
      jwtConfig.secret,
      { expiresIn: jwtConfig.expiresIn }
    );

    res.json({
      success: true,
      user: userInfo,
      token: token,
    });
  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({ error: 'Error en el proceso de login' });
  }
});

/**
 * Ruta para crear un nuevo usuario
 * POST /api/usuarios
 * @access Solo Admin
 */
router.post('/', [verifyToken, checkRole(['administrador'])], async (req, res) => {
  try {
    const { usuario_id, nombreCompleto, password, telefono, role_id } = req.body;

    if (!usuario_id || !nombreCompleto || !password) {
      return res.status(400).json({
        error: 'ID de usuario, nombre completo y contraseña son requeridos',
      });
    }

    // Verificar que el ID de usuario no exista ya
    const existingUser = await userModel.getUserById(usuario_id);
    if (existingUser) {
      return res.status(409).json({ error: 'El ID de usuario ya existe' });
    }

    // Log the role_id to debug
    console.log('Creating user with rol_id:', role_id);

    const result = await userModel.createUser({
      usuarioId: usuario_id,
      nombreCompleto,
      password,
      telefono: telefono || null,
      role_id: role_id || null, // We keep 'role_id' here since it matches the frontend's field name
    });

    res.status(201).json({
      success: true,
      usuario_id: result.usuario_id,
      message: 'Usuario creado correctamente',
    });
  } catch (error) {
    console.error('Error al crear usuario:', error);
    res.status(500).json({ error: 'Error al crear usuario' });
  }
});

/**
 * Ruta para actualizar un usuario existente
 * PUT /api/usuarios/:id
 * @access Usuario autenticado (pero solo puede actualizar sus propios datos) o Admin (puede actualizar cualquier usuario)
 */
router.put('/:id', [verifyToken], async (req, res) => {
  // Verificar si el usuario tiene permisos para actualizar este perfil
  
  // Lista de roles que consideramos equivalentes a "administrador"
  const adminEquivalents = ['administrador', 'admin', 'Admin', 'ADMIN', 'ADMINISTRADOR'];
  
  // Obtenemos el rol del usuario sin convertirlo a minúsculas para depuración
  const userRole = req.user.role || '';
  console.log('PUT /:id - Usuario actual:', req.user.id, 'Role:', userRole, 'Solicitando actualizar usuario:', req.params.id);
  console.log('Token completo:', JSON.stringify(req.user));
  
  const isAdmin = adminEquivalents.includes(userRole);
  console.log('¿Es admin?', isAdmin, 'basado en rol:', userRole);
  
  if (!isAdmin && req.user.id !== req.params.id) {
    console.log('Acceso denegado: el usuario no es administrador ni es su propio perfil');
    console.log('Roles permitidos:', adminEquivalents);
    console.log('Rol del usuario:', userRole);
    return res.status(403).json({ 
      success: false,
      message: 'Acceso denegado. Solo puede actualizar su propio perfil.' 
    });
  }
  
  console.log('Acceso permitido para actualizar usuario:', req.params.id);
  try {
    const userId = req.params.id;
    const { nombreCompleto, password, telefono, role_id, activo } = req.body;
    
    console.log('PUT /usuarios/:id - Datos recibidos:', {
      userId,
      nombreCompleto,
      password: password ? '[PRESENTE]' : '[AUSENTE]',
      telefono,
      role_id,
      activo
    });

    const user = await userModel.getUserById(userId);
    if (!user) {
      console.log('Usuario no encontrado:', userId);
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }
    
    console.log('Usuario encontrado:', {
      usuario_id: user.usuario_id,
      nombreCompleto: user.nombreCompleto,
      telefono: user.telefono,
      rol_id: user.rol_id,
      activo: user.activo
    });

    await userModel.updateUser(userId, {
      nombreCompleto: nombreCompleto || user.nombreCompleto,
      password, // If password is undefined/empty, updateUser will handle it
      telefono: telefono !== undefined ? telefono : user.telefono,
      role_id: role_id !== undefined ? role_id : user.rol_id,
      activo: activo !== undefined ? activo : user.activo,
    });

    res.json({
      success: true,
      message: 'Usuario actualizado correctamente',
    });
  } catch (error) {
    console.error('Error al actualizar usuario:', error);
    res.status(500).json({ error: 'Error al actualizar usuario' });
  }
});

/**
 * Ruta para eliminar un usuario
 * DELETE /api/usuarios/:id
 * @access Solo Admin
 */
router.delete('/:id', [verifyToken, checkRole(['administrador'])], async (req, res) => {
  try {
    const userId = req.params.id;

    const user = await userModel.getUserById(userId);
    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    await userModel.deleteUser(userId);

    res.json({
      success: true,
      message: 'Usuario eliminado correctamente',
    });
  } catch (error) {
    console.error('Error al eliminar usuario:', error);
    res.status(500).json({ error: 'Error al eliminar usuario' });
  }
});

export default router;
