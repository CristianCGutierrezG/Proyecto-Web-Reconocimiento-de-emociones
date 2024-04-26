import express from 'express';
import passport from 'passport';
import { checkRoles } from '../middlewares/auth.handler.js';

import { HorariosService } from '../services/horarios.service.js'; 
import { validatorHandler } from './../middlewares/validator.handler.js';
import { createHorariosSchema, updateHorariosSchema, getHorariosSchema  } from '../schemas/horario.schema.js'; 

/** 
 * Define los diferentes rutas o endpoint para los datos de un horario
 * Comprobaciones.
 *  - Llave de acceso a la API
 *  - Datos de envio correctos
 *  - Autorizacion de rol y contraseña
*/

const router = express.Router();
const service = new HorariosService();

/**
 * 
 * @swagger
 * components:
 *  schemas:
 *    Horario:
 *      type: object
 *      properties:
 *        dia:
 *          type: string
 *          description: dia en que se dicta la materia
 *        horaInicio:
 *          type: string
 *          description: Hora de inicio 
 *        horaFin:
 *          type: string
 *          description: Hora de fin
 *        materiaId:
 *          type: integer
 *          description: Materia a que se le asigna ese horario
 *      required:
 *        - dia
 *        - horaInicio
 *        - horaFin
 *        - materiaId
 *      example:
 *        dia: Martes
 *        horaInicio: 12:00:00
 *        horaFin: 14:00:00
 *        materiaId: 1
 *    updateHorario:
 *      type: object
 *      properties:
 *        dia:
 *          type: string
 *          description: dia en que se dicta la materia
 *        horaInicio:
 *          type: string
 *          description: Hora de inicio 
 *        horaFin:
 *          type: string
 *          description: Hora de fin
 *      example:
 *        dia: Lunes
 *        horaInicio: 12:00:00
 *        horaFin: 14:00:00  
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
 * /api/v1/horarios:
 *  post:
 *    summary: Crea un nuevo horario
 *    tags: [Horario]
 *    description: Usuarios con acceso [Profesor, Administrador]
 *    security:
 *      - ApiKeyAuth: []
 *      - BearerAuth: []
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            $ref: '#/components/schemas/Horario'
 *    responses:
 *      201:
 *        description: nuevo Horario creada!
 *      401:
 *        description: Unauthorized
 *      409: 
 *        description: Conflicto - Horario ya existente
 */
router.post('/',
  passport.authenticate('jwt', {session: false}),
  checkRoles('Profesor', 'Administrador'),
  validatorHandler(createHorariosSchema, 'body'),
  async (req, res, next) => {
    try {
        const body = req.body;
        const newHorario = await service.create(body);
        res.status(201).json(newHorario);
    } catch (error) {
        next(error);
    }
  }
);

/**
 * @openapi
 * /api/v1/horarios/{id}:
 *  patch:
 *    summary: Actualiza un horario segun su id
 *    tags: [Horario]
 *    description: Usuarios con acceso [Profesor, Administrador]
 *    parameters: 
 *      - in: path
 *        name: id
 *        schema:
 *          type: string
 *        required: true
 *        description: el id del horario
 *    security:
 *      - ApiKeyAuth: []
 *      - BearerAuth: []
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            $ref: '#/components/schemas/updateHorario'
 *    responses:
 *      200:
 *        description: Horario actualizado
 *      401:
 *        description: Unauthorized
 *      404:
 *        description: Horario no encontrado
 */
router.patch('/:id',
  passport.authenticate('jwt', {session: false}),
  checkRoles('Profesor', 'Administrador'),
  validatorHandler(getHorariosSchema, 'params'),
  validatorHandler(updateHorariosSchema, 'body'),
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const body = req.body;
      const horarios = await service.update(id, body);
      res.json(horarios);
    } catch (error) {
      next(error);
    }
  }
);

/**
 * @openapi
 * /api/v1/horarios/{id}:
 *  delete:
 *    summary: elimina una materia
 *    tags: [Horario]
 *    description: Usuarios con acceso [Profesor, Administrador]
 *    parameters: 
 *      - in: path
 *        name: id
 *        schema:
 *          type: string
 *        required: true
 *        description: el id del horario
 *    security:
 *      - ApiKeyAuth: []
 *      - BearerAuth: []
 *    responses:
 *      201:
 *        description: Horario eliminado
 *        content:
 *          aplication/json:
 *            schema:
 *              type: object
 *              properties:
 *                id:
 *                  type: integer
 *                  description: id del horario eliminado
 *      401:
 *        description: Unauthorized
 *      404:
 *        description: Materia no encontrada
 */
router.delete('/:id',
  passport.authenticate('jwt', {session: false}),
  checkRoles('Profesor', 'Administrador'),
  validatorHandler(getHorariosSchema, 'params'),
  async (req, res, next) => {
    try {
      const { id } = req.params;
      await service.delete(id);
      res.status(201).json({id});
    } catch (error) {
      next(error);
    }
  }
);

export {router};

