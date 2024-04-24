import express from 'express';
import passport from 'passport';

import { ProfesoresService } from '../services/profesor.service.js';
import { createProfesorSchema, updateProfesorSchema, getProfesorSchema, queryProfesorSchema } from '../schemas/profesor.schema.js';
import {validatorHandler} from '../middlewares/validator.handler.js';
import { checkRoles } from '../middlewares/auth.handler.js';

/** 
 * Define los diferentes rutas o endpoint para los datos de un Profesor
 * Comprobaciones.
 *  - Llave de acceso a la API
 *  - Datos de envio correctos
 *  - Autorizacion de rol y contraseña
*/

const router = express.Router();
const service = new ProfesoresService();

/**
 * 
 * @swagger
 * components:
 *  schemas:
 *    Profesor:
 *      type: object
 *      properties:
 *        nombres:
 *          type: string
 *          description: nombres del profesor
 *        apellidos:
 *          type: string
 *          description: apellidos del profesor
 *        fechaNacimiento:
 *          type: string
 *          format: date
 *          description: fecha de nacimiento 
 *        codigoInstitucional:
 *          type: number
 *          format: int64
 *          description: fecha de nacimiento 
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
 *              description: rol especifico del usuario ['Profesor']
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
 *          role: Profesor
 *    ProfesorUpdate:
 *      type: object
 *      properties:
 *        nombres:
 *          type: string
 *          description: nombres del profesor
 *        apellidos:
 *          type: string
 *          description: apellidos del profesor
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
 * /api/v1/profesores:
 *  get:
 *    summary: retorna todos los profesores
 *    tags: [Profesor]
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
 *        description: todos los profesores
 *        content:
 *          aplication/json:
 *            schema:
 *              type: array
 *              items:
 *                $ref: '#/components/schemas/Profesor'
 *      401:
 *        description: Unauthorized
 */
router.get('/',
  passport.authenticate('jwt', {session: false}),
  checkRoles('Administrador'),
  validatorHandler(queryProfesorSchema, 'params'),
  async (req, res, next) => {
    try {
      const profesor = await service.find(req.query);
      res.status(200).json(profesor);
    } catch (error) {
      next(error);
    }
  }
);

/**
 * @openapi
 * /api/v1/profesores/{id}:
 *  get:
 *    summary: retorna un profesore
 *    tags: [Profesor]
 *    description: Usuarios con acceso [Profesor, Administrador]
 *    parameters:
 *      - in: path
 *        name: id
 *        schema:
 *          type: integer
 *        required: true
 *        description: el id del estudiante
 *    security:
 *      - ApiKeyAuth: []
 *      - BearerAuth: []
 *    responses:
 *      200:
 *        description: un profesor especifico
 *        content:
 *          aplication/json:
 *            schema:
 *              type: array
 *              items:
 *                $ref: '#/components/schemas/Profesor'
 *      401:
 *        description: Unauthorized
 *      404:
 *        description: Profesore no encontrado
 */
router.get('/:id',
  passport.authenticate('jwt', {session: false}),
  checkRoles('Profesor', 'Administrador'),
  validatorHandler(getProfesorSchema, 'params'),
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const profesor = await service.findOne(id);
      res.json(profesor);
    } catch (error) {
      next(error);
    }
  }
);

/**
 * @openapi
 * /api/v1/profesores:
 *  post:
 *    summary: crea un nuevo profesor
 *    tags: [Profesor]
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
 *            $ref: '#/components/schemas/Profesor'
 *    responses:
 *      201:
 *        description: nuevo profesor creado!
 *      401:
 *        description: Unauthorized
 *      409: 
 *        description: Conflicto - profesor ya existente
 */
router.post('/',
  passport.authenticate('jwt', {session: false}),
  checkRoles('Administrador'),
  validatorHandler(createProfesorSchema, 'body'),
  async (req, res, next) => {
    try {
      const email = req.body.user.email;
      const codigo = req.body.codigoInstitucional;
      const body = req.body;
      const newProfesor = await service.create(body, email, codigo);
      res.status(201).json(newProfesor);
    } catch (error) {
      next(error);
    }
  }
);

/**
 * @openapi
 * /api/v1/profesores/{id}:
 *  patch:
 *    summary: actualiza un profesor segun su id
 *    tags: [Profesor]
 *    description: Usuarios con acceso [Administrador]
 *    parameters: 
 *      - in: path
 *        name: id
 *        schema:
 *          type: string
 *        required: true
 *        description: el id del profesor
 *    security:
 *      - ApiKeyAuth: []
 *      - BearerAuth: []
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            $ref: '#/components/schemas/ProfesorUpdate'
 *    responses:
 *      200:
 *        description: Profesor actualizado 
 *      401:
 *        description: Unauthorized
 *      404:
 *        description: Profesor no encontrado
 */
router.patch('/:id',
  passport.authenticate('jwt', {session: false}),
  checkRoles('Administrador'),
  validatorHandler(getProfesorSchema, 'params'),
  validatorHandler(updateProfesorSchema, 'body'),
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const body = req.body;
      const profesor = await service.update(id, body);
      res.json(profesor);
    } catch (error) {
      next(error);
    }
  }
);

/**
 * @openapi
 * /api/v1/profesores:
 *  patch:
 *    summary: actualiza un profesor segun su token
 *    tags: [Profesor]
 *    description: Usuarios con acceso [Profesor]
 *    security:
 *      - ApiKeyAuth: []
 *      - BearerAuth: []
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            $ref: '#/components/schemas/ProfesorUpdate'
 *    responses:
 *      200:
 *        description: Profesor actualizado 
 *      401:
 *        description: Unauthorized
 *      404:
 *        description: Profesor no encontrado
 */
router.patch('/',
  passport.authenticate('jwt', {session: false}),
  checkRoles('Profesor'),
  validatorHandler(updateProfesorSchema, 'body'),
  async (req, res, next) => {
    try {
      const user = req.user;
      const body = req.body;
      const Profesor = await service.updateToken(user.sub, body);
      res.json(Profesor);
    } catch (error) {
      next(error);
    }
  }
);

/**
 * @openapi
 * /api/v1/profesores/{id}:
 *  delete:
 *    summary: elimina un profesor
 *    tags: [Profesor]
 *    description: Usuarios con acceso [Administrador]
 *    parameters: 
 *      - in: path
 *        name: id
 *        schema:
 *          type: string
 *        required: true
 *        description: el id del profesor
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
 *                  description: id del profesor eliminado
 *      401:
 *        description: Unauthorized
 *      404:
 *        description: Profesor no encontrado
 */
router.delete('/:id',
  passport.authenticate('jwt', {session: false}),
  checkRoles('Administrador'),
  validatorHandler(getProfesorSchema, 'params'),
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
