import express from 'express';
import passport from 'passport';
import { checkRoles } from '../middlewares/auth.handler.js';

import { EmocionService } from '../services/emocion.service.js';
import { validatorHandler } from './../middlewares/validator.handler.js';
import {createEmocionSchema} from '../schemas/emociones.schema.js'; 

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
 *    summary: crea una emocion segun el token del estudiante
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
 *        description: nueva emocion creada!
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
      const user = req.user
      const newEmocion = await service.create(body, user.sub);
      res.status(201).json(newEmocion);
    } catch (error) {
      next(error);
    }
  }
);


export {router};

