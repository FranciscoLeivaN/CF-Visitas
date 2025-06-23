/**
 * Rutas para usuarios
 * Adaptado a la estructura de la tabla Usuarios existente
 */
import express from 'express';
import * as userModel from '../models/user.model.js';
import jwt from 'jsonwebtoken';
import jwtConfig from '../config/jwt.js';
import { authJwt } from '../middleware/index.js';

const router = express.Router();

/**
 * Ruta para obtener todos los usuarios
 * GET /api/usuarios
 */
router.get('/', [authJwt], async (req, res) => {
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
 * Ruta para obtener un usuario por su ID
 * GET /api/usuarios/:id
 */
router.get('/:id', [authJwt], async (req, res) => {
  try {
    const userId = req.params.id;
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
    
    // Generar token JWT con la información del usuario (nombre y correo)
    const token = jwt.sign(
      { 
        id: userInfo.usuario_id,
        name: userInfo.nombreCompleto,
        email: userInfo.email || usuario_id // Si no hay email, usar el ID como fallback
      },
      jwtConfig.secret,
      { expiresIn: jwtConfig.expiresIn }
    );
    
    res.json({ 
      success: true,
      user: userInfo,
      token: token
    });
  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({ error: 'Error en el proceso de login' });
  }
});

/**
 * Ruta para crear un nuevo usuario
 * POST /api/usuarios
 */
router.post('/', [authJwt], async (req, res) => {
  try {
    const { usuario_id, nombreCompleto, password, telefono } = req.body;
    
    if (!usuario_id || !nombreCompleto || !password) {
      return res.status(400).json({ 
        error: 'ID de usuario, nombre completo y contraseña son requeridos' 
      });
    }
    
    // Verificar que el ID de usuario no exista ya
    const existingUser = await userModel.getUserById(usuario_id);
    if (existingUser) {
      return res.status(409).json({ error: 'El ID de usuario ya existe' });
    }
    
    const result = await userModel.createUser({
      usuarioId: usuario_id,
      nombreCompleto,
      password,
      telefono: telefono || null
    });
    
    res.status(201).json({
      success: true,
      usuario_id: result.usuario_id,
      message: 'Usuario creado correctamente'
    });
  } catch (error) {
    console.error('Error al crear usuario:', error);
    res.status(500).json({ error: 'Error al crear usuario' });
  }
});

/**
 * Ruta para actualizar un usuario existente
 * PUT /api/usuarios/:id
 */
router.put('/:id', async (req, res) => {
  try {
    const userId = req.params.id;
    const { nombreCompleto, password, telefono } = req.body;
    
    const user = await userModel.getUserById(userId);
    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }
    
    await userModel.updateUser(userId, {
      nombreCompleto: nombreCompleto || user.nombreCompleto,
      password: password || user.passUsuario,
      telefono: telefono !== undefined ? telefono : user.telefono
    });
    
    res.json({
      success: true,
      message: 'Usuario actualizado correctamente'
    });
  } catch (error) {
    console.error('Error al actualizar usuario:', error);
    res.status(500).json({ error: 'Error al actualizar usuario' });
  }
});

/**
 * Ruta para eliminar un usuario
 * DELETE /api/usuarios/:id
 */
router.delete('/:id', async (req, res) => {
  try {
    const userId = req.params.id;
    
    const user = await userModel.getUserById(userId);
    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }
    
    await userModel.deleteUser(userId);
    
    res.json({
      success: true,
      message: 'Usuario eliminado correctamente'
    });
  } catch (error) {
    console.error('Error al eliminar usuario:', error);
    res.status(500).json({ error: 'Error al eliminar usuario' });
  }
});

export default router;
