import express from 'express';
import passport from 'passport';
import { checkRoles } from '../middlewares/auth.handler.js';

import { EmocionService } from '../services/emocion.service.js';
import { validatorHandler } from './../middlewares/validator.handler.js';
import { createEmocionSchema } from '../schemas/emociones.schema.js';

const router = express.Router();
const service = new EmocionService();

/**
 *
 * @swagger
 * components:
 *  schemas:
 *    Emociones:
 *      type: object
 *      properties:
 *        emocion:
 *          type: string
 *          description: tipo de emocion
 *      required:
 *        - emocion
 *      example:
 *        emocion: Triste
 *  securitySchemes:
 *    ApiKeyAuth:
 *      type: apiKey
 *      in: header
 *      name: api
 *    BearerAuth:
 *      type: http
 *      scheme: bearer
 */

/**
 * @openapi
 * /api/v1/emociones:
 *  post:
 *    summary: Crea una emoción según el token del estudiante
 *    tags: [Emociones]
 *    security:
 *      - ApiKeyAuth: []
 *      - BearerAuth: []
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            $ref: '#/components/schemas/Emociones'
 *    responses:
 *      201:
 *        description: ¡Nueva emoción creada!
 *      401:
 *        description: Unauthorized
 */
router.post('/',
  passport.authenticate('jwt', {session: false}),
  checkRoles('Estudiante', 'Administrador'),
  validatorHandler(createEmocionSchema, 'body'),
  async (req, res, next) => {
    try {
      const body = req.body;
      const user = req.user;
      const newEmocion = await service.create(body, user.sub);
      res.status(201).json(newEmocion);
    } catch (error) {
      next(error);
    }
  }
);

/**
 * @openapi
 * /api/v1/emociones:
 *  get:
 *    summary: Encuentra las emociones de todos los estudiantes en un rango de fechas para una materia específica
 *    tags: [Emociones]
 *    security:
 *      - ApiKeyAuth: []
 *      - BearerAuth: []
 *    parameters:
 *      - in: query
 *        name: id
 *        description: ID de la materia para la que se buscan las emociones
 *        schema:
 *          type: integer
 *          minimum: 0
 *          required: true
 *      - in: query
 *        name: startDate
 *        description: Fecha de inicio del rango (YYYY-MM-DD)
 *        schema:
 *          type: string
 *          format: date
 *      - in: query
 *        name: endDate
 *        description: Fecha de fin del rango (YYYY-MM-DD)
 *        schema:
 *          type: string
 *          format: date
 *    responses:
 *      200:
 *        description: Las emociones de todos los estudiantes en el rango de fechas para la materia especificada
 *        content:
 *          application/json:
 *            schema:
 *              type: array
 *              items:
 *                $ref: '#/components/schemas/Emociones'
 *      401:
 *        description: Unauthorized
 *      404:
 *        description: Materia no encontrada
 */
router.get(
  '/',
  passport.authenticate('jwt', { session: false }),
  checkRoles('Administrador', 'Profesor'),
  async (req, res, next) => {
    try {
      const { id, startDate, endDate } = req.query;

      // Validar parámetros
      if (!id) {
        return res.status(400).json({ error: 'ID de la materia es requerido' });
      }

      const emociones = await service.findEmocionesByMateria(id, startDate, endDate);
      res.json(emociones);
    } catch (error) {
      next(error);
    }
  }
);

export { router };
