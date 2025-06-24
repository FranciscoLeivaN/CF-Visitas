/**
 * Rutas para visitas
 * Adaptado a la estructura de la tabla Visitas existente
 */
import express from 'express';
import * as visitaModel from '../models/visita.model.js';

const router = express.Router();

/**
 * Ruta para obtener todas las visitas
 * GET /api/visitas
 */
router.get('/', async (req, res) => {
  try {
    const visitas = await visitaModel.getAllVisitas();
    res.json(visitas);
  } catch (error) {
    console.error('Error al obtener visitas:', error);
    res.status(500).json({ error: 'Error al obtener visitas' });
  }
});

/**
 * Ruta para obtener una visita por su ID
 * GET /api/visitas/:id
 */
router.get('/:id', async (req, res) => {
  try {
    const visitaId = parseInt(req.params.id);
    const visita = await visitaModel.getVisitaById(visitaId);

    if (!visita) {
      return res.status(404).json({ error: 'Visita no encontrada' });
    }

    res.json(visita);
  } catch (error) {
    console.error('Error al obtener visita:', error);
    res.status(500).json({ error: 'Error al obtener visita' });
  }
});

/**
 * Ruta para obtener visitas por productor
 * GET /api/visitas/productor/:productorId
 */
router.get('/productor/:productorId', async (req, res) => {
  try {
    const productorId = parseInt(req.params.productorId);
    const visitas = await visitaModel.getVisitasByProductor(productorId);
    res.json(visitas);
  } catch (error) {
    console.error('Error al obtener visitas del productor:', error);
    res.status(500).json({ error: 'Error al obtener visitas del productor' });
  }
});

/**
 * Ruta para obtener visitas por inspector
 * GET /api/visitas/inspector/:inspectorId
 */
router.get('/inspector/:inspectorId', async (req, res) => {
  try {
    const inspectorId = parseInt(req.params.inspectorId);
    const visitas = await visitaModel.getVisitasByInspector(inspectorId);
    res.json(visitas);
  } catch (error) {
    console.error('Error al obtener visitas del inspector:', error);
    res.status(500).json({ error: 'Error al obtener visitas del inspector' });
  }
});

/**
 * Ruta para crear una nueva visita
 * POST /api/visitas
 */
router.post('/', async (req, res) => {
  try {
    const { fecha, productor_id, cultivo_id, inspector_id, observaciones, recomendaciones } =
      req.body;

    if (!productor_id || !fecha || !cultivo_id || !inspector_id) {
      return res.status(400).json({
        error: 'Productor, fecha, cultivo e inspector son campos requeridos',
      });
    }

    const result = await visitaModel.createVisita({
      fecha,
      productor_id,
      cultivo_id,
      inspector_id,
      observaciones,
      recomendaciones,
    });

    res.status(201).json({
      success: true,
      id: result.visita_id,
      message: 'Visita creada correctamente',
    });
  } catch (error) {
    console.error('Error al crear visita:', error);
    res.status(500).json({ error: 'Error al crear visita' });
  }
});

/**
 * Ruta para actualizar una visita existente
 * PUT /api/visitas/:id
 */
router.put('/:id', async (req, res) => {
  try {
    const visitaId = parseInt(req.params.id);
    const {
      fecha,
      productor_id,
      cultivo_id,
      inspector_id,
      observaciones,
      recomendaciones,
      informe_enviado,
    } = req.body;

    const visita = await visitaModel.getVisitaById(visitaId);
    if (!visita) {
      return res.status(404).json({ error: 'Visita no encontrada' });
    }

    await visitaModel.updateVisita(visitaId, {
      fecha: fecha || visita.fecha,
      productor_id: productor_id || visita.productor_id,
      cultivo_id: cultivo_id || visita.cultivo_id,
      inspector_id: inspector_id || visita.inspector_id,
      observaciones: observaciones !== undefined ? observaciones : visita.observaciones,
      recomendaciones: recomendaciones !== undefined ? recomendaciones : visita.recomendaciones,
      informe_enviado: informe_enviado !== undefined ? informe_enviado : visita.informe_enviado,
    });

    res.json({
      success: true,
      message: 'Visita actualizada correctamente',
    });
  } catch (error) {
    console.error('Error al actualizar visita:', error);
    res.status(500).json({ error: 'Error al actualizar visita' });
  }
});

/**
 * Ruta para marcar una visita como enviada
 * PUT /api/visitas/:id/enviar
 */
router.put('/:id/enviar', async (req, res) => {
  try {
    const visitaId = parseInt(req.params.id);

    const visita = await visitaModel.getVisitaById(visitaId);
    if (!visita) {
      return res.status(404).json({ error: 'Visita no encontrada' });
    }

    await visitaModel.marcarVisitaEnviada(visitaId);

    res.json({
      success: true,
      message: 'Visita marcada como enviada correctamente',
    });
  } catch (error) {
    console.error('Error al marcar visita como enviada:', error);
    res.status(500).json({ error: 'Error al marcar visita como enviada' });
  }
});

/**
 * Ruta para eliminar una visita
 * DELETE /api/visitas/:id
 */
router.delete('/:id', async (req, res) => {
  try {
    const visitaId = parseInt(req.params.id);

    const visita = await visitaModel.getVisitaById(visitaId);
    if (!visita) {
      return res.status(404).json({ error: 'Visita no encontrada' });
    }

    await visitaModel.deleteVisita(visitaId);

    res.json({
      success: true,
      message: 'Visita eliminada correctamente',
    });
  } catch (error) {
    console.error('Error al eliminar visita:', error);
    res.status(500).json({ error: 'Error al eliminar visita' });
  }
});

export default router;
