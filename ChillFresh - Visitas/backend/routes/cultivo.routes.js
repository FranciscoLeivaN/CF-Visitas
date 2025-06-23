/**
 * Rutas para cultivos
 */
import express from 'express';
import * as cultivoModel from '../models/cultivo.model.js';

const router = express.Router();

/**
 * Ruta para obtener todos los cultivos
 * GET /api/cultivos
 */
router.get('/', async (req, res) => {
  try {
    const cultivos = await cultivoModel.getAllCultivos();
    res.json(cultivos);
  } catch (error) {
    console.error('Error al obtener cultivos:', error);
    res.status(500).json({ error: 'Error al obtener cultivos' });
  }
});

/**
 * Ruta para obtener un cultivo por su ID
 * GET /api/cultivos/:id
 */
router.get('/:id', async (req, res) => {
  try {
    const cultivoId = parseInt(req.params.id);
    const cultivo = await cultivoModel.getCultivoById(cultivoId);
    
    if (!cultivo) {
      return res.status(404).json({ error: 'Cultivo no encontrado' });
    }
    
    res.json(cultivo);
  } catch (error) {
    console.error('Error al obtener cultivo:', error);
    res.status(500).json({ error: 'Error al obtener cultivo' });
  }
});

/**
 * Ruta para crear un nuevo cultivo
 * POST /api/cultivos
 */
router.post('/', async (req, res) => {
  try {
    const { nombre, descripcion } = req.body;
    
    if (!nombre) {
      return res.status(400).json({ error: 'Nombre es requerido' });
    }
    
    const result = await cultivoModel.createCultivo({
      nombre,
      descripcion: descripcion || null
    });
    
    res.status(201).json({
      success: true,
      id: result.cultivo_id,
      message: 'Cultivo creado correctamente'
    });
  } catch (error) {
    console.error('Error al crear cultivo:', error);
    res.status(500).json({ error: 'Error al crear cultivo' });
  }
});

/**
 * Ruta para actualizar un cultivo existente
 * PUT /api/cultivos/:id
 */
router.put('/:id', async (req, res) => {
  try {
    const cultivoId = parseInt(req.params.id);
    const { nombre, descripcion } = req.body;
    
    const cultivo = await cultivoModel.getCultivoById(cultivoId);
    if (!cultivo) {
      return res.status(404).json({ error: 'Cultivo no encontrado' });
    }
    
    await cultivoModel.updateCultivo(cultivoId, {
      nombre: nombre || cultivo.nombre,
      descripcion: descripcion !== undefined ? descripcion : cultivo.descripcion
    });
    
    res.json({
      success: true,
      message: 'Cultivo actualizado correctamente'
    });
  } catch (error) {
    console.error('Error al actualizar cultivo:', error);
    res.status(500).json({ error: 'Error al actualizar cultivo' });
  }
});

/**
 * Ruta para eliminar un cultivo
 * DELETE /api/cultivos/:id
 */
router.delete('/:id', async (req, res) => {
  try {
    const cultivoId = parseInt(req.params.id);
    
    const cultivo = await cultivoModel.getCultivoById(cultivoId);
    if (!cultivo) {
      return res.status(404).json({ error: 'Cultivo no encontrado' });
    }
    
    await cultivoModel.deleteCultivo(cultivoId);
    
    res.json({
      success: true,
      message: 'Cultivo eliminado correctamente'
    });
  } catch (error) {
    console.error('Error al eliminar cultivo:', error);
    res.status(500).json({ error: 'Error al eliminar cultivo' });
  }
});

export default router;
