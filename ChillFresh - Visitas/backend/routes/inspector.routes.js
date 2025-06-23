/**
 * Rutas para inspectores
 */
import express from 'express';
import * as inspectorModel from '../models/inspector.model.js';

const router = express.Router();

/**
 * Ruta para obtener todos los inspectores
 * GET /api/inspectores
 */
router.get('/', async (req, res) => {
  try {
    const inspectores = await inspectorModel.getAllInspectores();
    res.json(inspectores);
  } catch (error) {
    console.error('Error al obtener inspectores:', error);
    res.status(500).json({ error: 'Error al obtener inspectores' });
  }
});

/**
 * Ruta para obtener un inspector por su ID
 * GET /api/inspectores/:id
 */
router.get('/:id', async (req, res) => {
  try {
    const inspectorId = parseInt(req.params.id);
    const inspector = await inspectorModel.getInspectorById(inspectorId);
    
    if (!inspector) {
      return res.status(404).json({ error: 'Inspector no encontrado' });
    }
    
    res.json(inspector);
  } catch (error) {
    console.error('Error al obtener inspector:', error);
    res.status(500).json({ error: 'Error al obtener inspector' });
  }
});

/**
 * Ruta para crear un nuevo inspector
 * POST /api/inspectores
 */
router.post('/', async (req, res) => {
  try {
    const { nombre, email } = req.body;
    
    if (!nombre || !email) {
      return res.status(400).json({ error: 'Nombre y email son requeridos' });
    }
    
    const result = await inspectorModel.createInspector({
      nombre,
      email
    });
    
    res.status(201).json({
      success: true,
      id: result.inspector_id,
      message: 'Inspector creado correctamente'
    });
  } catch (error) {
    console.error('Error al crear inspector:', error);
    res.status(500).json({ error: 'Error al crear inspector' });
  }
});

/**
 * Ruta para actualizar un inspector existente
 * PUT /api/inspectores/:id
 */
router.put('/:id', async (req, res) => {
  try {
    const inspectorId = parseInt(req.params.id);
    const { nombre, email, activo } = req.body;
    
    const inspector = await inspectorModel.getInspectorById(inspectorId);
    if (!inspector) {
      return res.status(404).json({ error: 'Inspector no encontrado' });
    }
    
    await inspectorModel.updateInspector(inspectorId, {
      nombre: nombre || inspector.nombre,
      email: email || inspector.email,
      activo: activo !== undefined ? activo : inspector.activo
    });
    
    res.json({
      success: true,
      message: 'Inspector actualizado correctamente'
    });
  } catch (error) {
    console.error('Error al actualizar inspector:', error);
    res.status(500).json({ error: 'Error al actualizar inspector' });
  }
});

/**
 * Ruta para eliminar un inspector
 * DELETE /api/inspectores/:id
 */
router.delete('/:id', async (req, res) => {
  try {
    const inspectorId = parseInt(req.params.id);
    
    const inspector = await inspectorModel.getInspectorById(inspectorId);
    if (!inspector) {
      return res.status(404).json({ error: 'Inspector no encontrado' });
    }
    
    await inspectorModel.deleteInspector(inspectorId);
    
    res.json({
      success: true,
      message: 'Inspector eliminado correctamente'
    });
  } catch (error) {
    console.error('Error al eliminar inspector:', error);
    res.status(500).json({ error: 'Error al eliminar inspector' });
  }
});

export default router;
