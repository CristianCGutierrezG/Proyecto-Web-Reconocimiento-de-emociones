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
 *    summary: Encuentra las emociones de todos los estudiantes en un rango de fechas
 *    tags: [Emociones]
 *    security:
 *      - ApiKeyAuth: []
 *      - BearerAuth: []
 *    parameters:
 *      - in: query
 *        name: limit
 *        description: Número de items a recibir
 *        schema:
 *          type: integer
 *          minimum: 0
 *          default: 20
 *      - in: query
 *        name: offset
 *        description: El punto de inicio de los datos
 *        schema:
 *          type: integer
 *          minimum: 0
 *          default: 0
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
 *        description: Las emociones de todos los estudiantes en el rango de fechas
 *        content:
 *          application/json:
 *            schema:
 *              type: array
 *              items:
 *                $ref: '#/components/schemas/Emociones'
 *      401:
 *        description: Unauthorized
 */
router.get(
  '/',
  passport.authenticate('jwt', { session: false }),
  checkRoles('Administrador'),
  async (req, res, next) => {
    try {
      const emociones = await service.find(req.query);
      res.json(emociones);
    } catch (error) {
      next(error);
    }
  }
);

export { router };
