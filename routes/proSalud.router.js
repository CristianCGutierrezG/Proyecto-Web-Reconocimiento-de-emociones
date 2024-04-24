import express from 'express';
import passport from 'passport';

import {ProSaludService} from '../services/proSalud.service.js'
import { createProSaludSchema, updateProSaludSchema, getProSaludSchema, queryProSaludSchema } from '../schemas/proSalud.schema.js';
import {validatorHandler} from '../middlewares/validator.handler.js'
import { checkRoles } from '../middlewares/auth.handler.js';


/** 
 * Define los diferentes rutas o endpoint para los datos de un Profesional de salud
 * Comprobaciones.
 *  - Llave de acceso a la API
 *  - Datos de envio correctos
 *  - Autorizacion de rol y contraseña
*/

const router = express.Router();
const service = new ProSaludService();

/**
 * 
 * @swagger
 * components:
 *  schemas:
 *    ProSalud:
 *      type: object
 *      properties:
 *        nombres:
 *          type: string
 *          description: nombres del proSalud
 *        apellidos:
 *          type: string
 *          description: apellidos del proSalud
 *        fechaNacimiento:
 *          type: string
 *          format: date
 *          description: fecha de nacimiento 
 *        codigoInstitucional:
 *          type: number
 *          format: int64
 *          description: codigo unico asignado en la institución
 *        user:
 *          type: object
 *          properties:
 *            email:
 *              type: string
 *              description: correo de acceso del usuario
 *            password:
 *              type: string
 *              description: contraseña de acceso del usuario
 *            role:
 *              type: string
 *              description: rol especifico del usuario ['Profesional de salud']
 *      required:
 *        - nombres
 *        - apellidos
 *        - fechaNacimiento
 *        - codigoInstitucional
 *        - user
 *      example:
 *        nombres: Juan
 *        apellidos: Perez
 *        fechaNacimiento: 1990-01-01
 *        codigoInstitucional: 123456789
 *        user:
 *          email: juanperez@example.com
 *          password: Contraseña123
 *          role: Profesional de salud
 *    proSaludUpdate:
 *      type: object
 *      properties:
 *        nombres:
 *          type: string
 *          description: nombres del proSalud
 *        apellidos:
 *          type: string
 *          description: apellidos del proSalud
 *        fechaNacimiento:
 *          type: string
 *          format: date
 *          description: fecha de nacimiento 
 *        codigoInstitucional:
 *          type: number
 *          format: int64
 *          description: codigo unico asignado en la institución
 *      example:
 *        nombres: Juan
 *        apellidos: Perez
 *        fechaNacimiento: 1990-01-01
 *        codigoInstitucional: 123456789      
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
 * /api/v1/proSalud:
 *  get:
 *    summary: retorna todos los proSalud
 *    tags: [ProSalud]
 *    description: Usuarios con acceso [Administrador]
 *    parameters:
 *      - in: query
 *        name: limit
 *        description: numero de items a recibir
 *        schema:   
 *          type: integer
 *          minimum: 0
 *          default: 20
 *      - in: query
 *        name: offset
 *        description: el punto de inicio de los datos
 *        schema:
 *          type: integer 
 *          minimum: 0  
 *          default: 0
 *    security:
 *      - ApiKeyAuth: []
 *      - BearerAuth: []
 *    responses:
 *      200:
 *        description: todos los proSalud
 *        content:
 *          aplication/json:
 *            schema:
 *              type: array
 *              items:
 *                $ref: '#/components/schemas/ProSalud'
 *      401:
 *        description: Unauthorized
 */
router.get('/',
  passport.authenticate('jwt', {session: false}),
  checkRoles('Administrador'),
  validatorHandler(queryProSaludSchema, 'params'),
  async (req, res, next) => {
    try {
      const proSalud = await service.find(req.query);
      res.status(200).json(proSalud);
    } catch (error) {
      next(error);
    }
  }
);

/**
 * @openapi
 * /api/v1/proSalud/{id}:
 *  get:
 *    summary: retorna un proSalud
 *    tags: [ProSalud]
 *    description: Usuarios con acceso [Profesional de salud, Administrador]
 *    parameters:
 *      - in: path
 *        name: id
 *        schema:
 *          type: integer
 *        required: true
 *        description: el id del proSalud
 *    security:
 *      - ApiKeyAuth: []
 *      - BearerAuth: []
 *    responses:
 *      200:
 *        description: un proSalud especifico
 *        content:
 *          aplication/json:
 *            schema:
 *              type: array
 *              items:
 *                $ref: '#/components/schemas/ProSalud'
 *      401:
 *        description: Unauthorized
 *      404:
 *        description: ProSalud no encontrado
 */
router.get('/:id',
  passport.authenticate('jwt', {session: false}),
  checkRoles('Profesional de salud', 'Administrador'),
  validatorHandler(getProSaludSchema, 'params'),
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const proSalud = await service.findOne(id);
      res.json(proSalud);
    } catch (error) {
      next(error);
    }
  }
);

/**
 * @openapi
 * /api/v1/proSalud:
 *  post:
 *    summary: crea un nuevo proSalud
 *    tags: [ProSalud]
 *    description: Usuarios con acceso [Administrador]
 *    security:
 *      - ApiKeyAuth: []
 *      - BearerAuth: []
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            $ref: '#/components/schemas/ProSalud'
 *    responses:
 *      201:
 *        description: nuevo proSalud creado!
 *      401:
 *        description: Unauthorized
 *      409: 
 *        description: Conflicto - proSalud ya existente
 */
router.post('/',
  passport.authenticate('jwt', {session: false}),
  checkRoles('Administrador'),
  validatorHandler(createProSaludSchema, 'body'),
  async (req, res, next) => {
    try {
      const email = req.body.user.email;
      const codigo = req.body.codigoInstitucional;
      const body = req.body;
      const newProSalud = await service.create(body, email, codigo);
      res.status(201).json(newProSalud);
    } catch (error) {
      next(error);
    }
  }
);

/**
 * @openapi
 * /api/v1/proSalud/{id}:
 *  patch:
 *    summary: actualiza un proSalud segun su id
 *    tags: [ProSalud]
 *    description: Usuarios con acceso [Administrador]
 *    parameters: 
 *      - in: path
 *        name: id
 *        schema:
 *          type: string
 *        required: true
 *        description: el id del proSalud
 *    security:
 *      - ApiKeyAuth: []
 *      - BearerAuth: []
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            $ref: '#/components/schemas/proSaludUpdate'
 *    responses:
 *      200:
 *        description: ProSalud actualizado 
 *      401:
 *        description: Unauthorized
 *      404:
 *        description: ProSalud no encontrado
 */
router.patch('/:id',
  passport.authenticate('jwt', {session: false}),
  checkRoles('Administrador'),
  validatorHandler(getProSaludSchema, 'params'),
  validatorHandler(updateProSaludSchema, 'body'),
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const body = req.body;
      const proSalud = await service.update(id, body);
      res.json(proSalud);
    } catch (error) {
      next(error);
    }
  }
);

/**
 * @openapi
 * /api/v1/proSalud:
 *  patch:
 *    summary: actualiza un proSalud segun su token
 *    tags: [ProSalud]
 *    description: Usuarios con acceso [Profesional de salud]
 *    security:
 *      - ApiKeyAuth: []
 *      - BearerAuth: []
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            $ref: '#/components/schemas/proSaludUpdate'
 *    responses:
 *      200:
 *        description: ProSalud actualizado 
 *      401:
 *        description: Unauthorized
 *      404:
 *        description: ProSalud no encontrado
 */
router.patch('/',
  passport.authenticate('jwt', {session: false}),
  checkRoles('Profesional de salud'),
  validatorHandler(updateProSaludSchema, 'body'),
  async (req, res, next) => {
    try {
      const user = req.user;
      const body = req.body;
      const proSalud = await service.updateToken(user.sub, body);
      res.json(proSalud);
    } catch (error) {
      next(error);
    }
  }
);

/**
 * @openapi
 * /api/v1/proSalud/{id}:
 *  delete:
 *    summary: elimina un proSalud
 *    tags: [ProSalud]
 *    description: Usuarios con acceso [Administrador]
 *    parameters: 
 *      - in: path
 *        name: id
 *        schema:
 *          type: string
 *        required: true
 *        description: el id del proSalud
 *    security:
 *      - ApiKeyAuth: []
 *      - BearerAuth: []
 *    responses:
 *      201:
 *        description: usuario eliminado 
 *        content:
 *          aplication/json:
 *            schema:
 *              type: object
 *              properties:
 *                id:
 *                  type: integer
 *                  description: id del proSalud eliminado
 *      401:
 *        description: Unauthorized
 *      404:
 *        description: proSalud no encontrado
 */
router.delete('/:id',
  passport.authenticate('jwt', {session: false}),
  checkRoles('Administrador'),
  validatorHandler(getProSaludSchema, 'params'),
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