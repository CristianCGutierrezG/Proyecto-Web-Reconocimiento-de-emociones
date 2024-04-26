import express from 'express';
import passport from 'passport';

import { checkRoles } from '../middlewares/auth.handler.js';
import {UserService} from './../services/user.service.js';
import {validatorHandler} from './../middlewares/validator.handler.js';
import { updateUserSchema, createUserSchema, getUserSchema, queryUserSchema } from './../schemas/user.schema.js';
import { checkApiKey } from '../middlewares/auth.handler.js'  

/** 
 * Define los diferentes rutas o endpoint para los datos de un Usuario
 * Comprobaciones.
 *  - Llave de acceso a la API
 *  - Datos de envio correctos
 *  - Autorizacion de rol y contraseña
*/

const router = express.Router();
const service = new UserService();

/**
 * @swagger
 * components:
 *  schemas:
 *    User:
 *      type: object
 *      properties:
 *        email:
 *          type: string
 *          description: correo de acceso del usuario
 *        password:
 *          type: string
 *          description: contraseña de acceso del usuario
 *        role:
 *          type: string
 *          description: rol valido ['Estudiante', 'Profesor', 'Profesional de salud', 'Administrador']
 *      required:
 *        - email
 *        - password
 *        - role
 *      example:
 *        email: user@email.com
 *        password: password123
 *        role: Administrador
 *    UserUpdate:
 *      type: object
 *      properties:
 *        email:
 *          type: string
 *          description: correo de acceso del usuario
 *        role:
 *          type: string
 *          description: rol valido ['Estudiante', 'Profesor', 'Profesional de salud', 'Administrador'] 
 *      example:
 *        email: user@email.com
 *        role: Administrador  
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
 * /api/v1/users:
 *  get:
 *    summary: retorna todos los usuarios
 *    tags: [Users]
 *    parameters:
 *      - in: query
 *        name: limit
 *        description: numero de itemes a recibir
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
 *        description: todos los usuarios
 *        content:
 *          aplication/json:
 *            schema:
 *              type: array
 *              items:
 *                $ref: '#/components/schemas/User'
 *      401:
 *        description: Unauthorized
 */
router.get('/',
  checkApiKey,
  passport.authenticate('jwt', {session: false}),
  checkRoles('Administrador'),
  validatorHandler(queryUserSchema, 'params'),
  async (req, res, next) => {
    try {
      const usuario = await service.find(req.query);
      res.status(200).json(usuario);
    } catch (error) {
      next(error);
    }
  }
);
  
/**
 * @openapi
 * /api/v1/users/{id}:
 *  get:
 *    summary: retorna un usuario
 *    tags: [Users]
 *    parameters: 
 *      - in: path
 *        name: id
 *        schema:
 *          type: integer
 *        required: true
 *        description: el id del usuario
 *    security:
 *      - ApiKeyAuth: []
 *      - BearerAuth: []
 *    responses:
 *      200:
 *        description: un usuario especifico
 *        content:
 *          aplication/json:
 *            schema:
 *              type: object 
 *              $ref: '#/components/schemas/User'                
 *      401:
 *        description: Unauthorized
 *      404:
 *        description: Usuario no encontrado
 */
router.get('/:id',
  checkApiKey,
  passport.authenticate('jwt', {session: false}),
  checkRoles('Administrador'),
  validatorHandler(getUserSchema, 'params'),
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const usuario = await service.findOne(id);
      res.json(usuario);
    } catch (error) {
      next(error);
    }
  }
);

/**
 * @openapi
 * /api/v1/users:
 *  post:
 *    summary: crea un nuevo usuario
 *    tags: [Users]
 *    security:
 *      - ApiKeyAuth: []
 *      - BearerAuth: []
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            $ref: '#/components/schemas/User'
 *    responses:
 *      201:
 *        description: nuevo usuario creado!
 *      401:
 *        description: Unauthorized
 *      409: 
 *        description: Conflicto - usuario ya existente
*/
router.post('/',
  checkApiKey,
  passport.authenticate('jwt', {session: false}),
  checkRoles('Administrador'),
  validatorHandler(createUserSchema, 'body'),
  async (req, res, next) => {
    try {
      const body = req.body;
      const newUsuario = await service.create(body);
      res.status(201).json(newUsuario);
    } catch (error) {
      next(error);
    }
  }
);


/**
 * @openapi
 * /api/v1/users/{id}:
 *  patch:
 *    summary: actualiza un usuario
 *    tags: [Users]
 *    parameters: 
 *      - in: path
 *        name: id
 *        schema:
 *          type: string
 *        required: true
 *        description: el id del usuario
 *    security:
 *      - ApiKeyAuth: []
 *      - BearerAuth: []
 *    requestBody:
 *      required: true
 *      content:
 *          application/json:
 *            schema:
 *              type: object
 *              $ref: '#/components/schemas/UserUpdate'
 *    responses:
 *      200:
 *        description: usuario actualizado 
 *      401:
 *        description: Unauthorized
 *      404:
 *        description: Usuario no encontrado
 */
router.patch('/:id',
  checkApiKey,
  passport.authenticate('jwt', {session: false}),
  checkRoles('Administrador'),
  validatorHandler(getUserSchema, 'params'),
  validatorHandler(updateUserSchema, 'body'),
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const body = req.body;
      const usuario = await service.update(id, body);
      res.json(usuario);
    } catch (error) {
      next(error);
    }
  }
);

/**
 * @openapi
 * /api/v1/users/{id}:
 *  delete:
 *    summary: elimina un usuario
 *    tags: [Users]
 *    parameters: 
 *      - in: path
 *        name: id
 *        schema:
 *          type: string
 *        required: true
 *        description: el id del usuario
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
 *                  description: id del usuario eliminado
 *      401:
 *        description: Unauthorized
 *      404:
 *        description: Usuario no encontrado
 */
router.delete('/:id',
  checkApiKey,
  passport.authenticate('jwt', {session: false}),
  checkRoles('Administrador'),
  validatorHandler(getUserSchema, 'params'),
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



