/**
 * Rutas para productores
 */
import express from 'express';
import * as productorModel from '../models/productor.model.js';
import { authJwt } from '../middleware/index.js';

const router = express.Router();

/**
 * Ruta para obtener todos los productores
 * GET /api/productores
 */
router.get('/', [authJwt], async (req, res) => {
  try {
    const productores = await productorModel.getAllProductores();
    res.json(productores);
  } catch (error) {
    console.error('Error al obtener productores:', error);
    res.status(500).json({ error: 'Error al obtener productores' });
  }
});

/**
 * Ruta para obtener un productor por su ID
 * GET /api/productores/:id
 */
router.get('/:id', [authJwt], async (req, res) => {
  try {
    const productorId = parseInt(req.params.id);
    const productor = await productorModel.getProductorById(productorId);

    if (!productor) {
      return res.status(404).json({ error: 'Productor no encontrado' });
    }

    res.json(productor);
  } catch (error) {
    console.error('Error al obtener productor:', error);
    res.status(500).json({ error: 'Error al obtener productor' });
  }
});

/**
 * Ruta para crear un nuevo productor
 * POST /api/productores
 */
router.post('/', async (req, res) => {
  try {
    const { codigo, nombre, ubicacion, email1, email2, email3 } = req.body;

    if (!codigo || !nombre) {
      return res.status(400).json({ error: 'Código y nombre son requeridos' });
    }

    const result = await productorModel.createProductor({
      codigo,
      nombre,
      ubicacion: ubicacion || '',
      email1: email1 || null,
      email2: email2 || null,
      email3: email3 || null,
    });

    res.status(201).json({
      success: true,
      id: result.productor_id,
      message: 'Productor creado correctamente',
    });
  } catch (error) {
    console.error('Error al crear productor:', error);
    res.status(500).json({ error: 'Error al crear productor' });
  }
});

/**
 * Ruta para actualizar un productor existente
 * PUT /api/productores/:id
 */
router.put('/:id', async (req, res) => {
  try {
    const productorId = parseInt(req.params.id);
    const { codigo, nombre, ubicacion, email1, email2, email3 } = req.body;

    const productor = await productorModel.getProductorById(productorId);
    if (!productor) {
      return res.status(404).json({ error: 'Productor no encontrado' });
    }

    await productorModel.updateProductor(productorId, {
      codigo: codigo || productor.codigo,
      nombre: nombre || productor.nombre,
      ubicacion: ubicacion !== undefined ? ubicacion : productor.ubicacion,
      email1: email1 !== undefined ? email1 : productor.email1,
      email2: email2 !== undefined ? email2 : productor.email2,
      email3: email3 !== undefined ? email3 : productor.email3,
    });

    res.json({
      success: true,
      message: 'Productor actualizado correctamente',
    });
  } catch (error) {
    console.error('Error al actualizar productor:', error);
    res.status(500).json({ error: 'Error al actualizar productor' });
  }
});

/**
 * Ruta para eliminar un productor
 * DELETE /api/productores/:id
 */
router.delete('/:id', async (req, res) => {
  try {
    const productorId = parseInt(req.params.id);

    const productor = await productorModel.getProductorById(productorId);
    if (!productor) {
      return res.status(404).json({ error: 'Productor no encontrado' });
    }

    await productorModel.deleteProductor(productorId);

    res.json({
      success: true,
      message: 'Productor eliminado correctamente',
    });
  } catch (error) {
    console.error('Error al eliminar productor:', error);
    res.status(500).json({ error: 'Error al eliminar productor' });
  }
});

export default router;
