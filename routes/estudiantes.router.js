import express from 'express';
import passport from 'passport';

import {EstudiantesService} from '../services/estudiante.service.js'
import {validatorHandler} from '../middlewares/validator.handler.js'
import { createEstudianteSchema, updateEstudianteSchema, getEstudianteSchema, queryEstudianteSchema } from '../schemas/estudiante.schema.js';
import { checkRoles } from '../middlewares/auth.handler.js';
import { checkApiKey } from '../middlewares/auth.handler.js';

/**
 * Define los diferentes rutas o endpoint para los datos de un Estudiante
 * Comprobaciones.
 *  - Llave de acceso a la API
 *  - Datos de envio correctos
 *  - Autorizacion de rol y contraseña
*/

const router = express.Router();
const service = new EstudiantesService();

/**
 *
 * @swagger
 * components:
 *  schemas:
 *    Estudiante:
 *      type: object
 *      properties:
 *        nombres:
 *          type: string
 *          description: nombres del estudiante
 *        apellidos:
 *          type: string
 *          description: apellidos del usuario
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
 *    EstudianteUpdate:
 *      type: object
 *      properties:
 *        nombres:
 *          type: string
 *          description: nombres del estudiante
 *        apellidos:
 *          type: string
 *          description: apellidos del estudiante
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
 * /api/v1/estudiantes:
 *  get:
 *    summary: retorna todos los estudiantes
 *    tags: [Estudiante]
 *    description: Usuarios con acceso [Profesor, Profesional de salud, Administrador]
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
 *        description: todos los estudiantes
 *        content:
 *          aplication/json:
 *            schema:
 *              type: array
 *              items:
 *                $ref: '#/components/schemas/Estudiante'
 *      401:
 *        description: Unauthorized
 */
router.get('/',
  checkApiKey,
  passport.authenticate('jwt', {session: false}),
  checkRoles('Profesor', 'Profesional de salud', 'Administrador'),
  validatorHandler(queryEstudianteSchema, 'params'),
  async (req, res, next) => {
    try {
      const estudiante = await service.find(req.query);
      res.status(200).json(estudiante);
    } catch (error) {
      next(error);
    }
  }
);

/**
 * @openapi
 * /api/v1/estudiantes/buscar/{value}:
 *  get:
 *    summary: Busca estudiantes por nombre, apellido o código estudiantil
 *    tags: [Estudiante]
 *    description: Usuarios con acceso [Profesor, Profesional de salud, Administrador]
 *    parameters:
 *      - in: path
 *        name: value
 *        schema:
 *          type: string
 *        required: true
 *        description: Nombre, apellido o código estudiantil del estudiante
 *      - in: query
 *        name: limit
 *        schema:
 *          type: integer
 *          minimum: 0
 *          default: 20
 *        required: false
 *        description: Número máximo de resultados a devolver
 *      - in: query
 *        name: offset
 *        schema:
 *          type: integer
 *        required: false
 *        description: Número de resultados a saltar antes de empezar a devolver resultados
 *    security:
 *      - ApiKeyAuth: []
 *      - BearerAuth: []
 *    responses:
 *      200:
 *        description: Estudiantes encontrados
 *        content:
 *          application/json:
 *            schema:
 *              type: array
 *              items:
 *                $ref: '#/components/schemas/Estudiante'
 *      401:
 *        description: Unauthorized
 *      404:
 *        description: Estudiante no encontrado
 */
router.get('/buscar/:value',
  passport.authenticate('jwt', { session: false }),
  checkRoles('Profesor', 'Profesional de salud', 'Administrador'),
  async (req, res, next) => {
    try {
      const { value } = req.params;
      const { limit, offset } = req.query;
      const estudiantes = await service.findByNameOrCode(value, { limit, offset });
      res.json(estudiantes);
    } catch (error) {
      next(error);
    }
  }
);


/**
 * @openapi
 * /api/v1/estudiantes/{id}:
 *  get:
 *    summary: retorna un estudiante
 *    tags: [Estudiante]
 *    description: Usuarios con acceso [Profesor, Profesional de salud, Administrador]
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
 *        description: un estudiante especifico
 *        content:
 *          aplication/json:
 *            schema:
 *              type: array
 *              items:
 *                $ref: '#/components/schemas/Estudiante'
 *      401:
 *        description: Unauthorized
 *      404:
 *        description: Estudiante no encontrado
 */
router.get('/:id',
  passport.authenticate('jwt', {session: false}),
  checkRoles('Profesor', 'Profesional de salud', 'Administrador'),
  validatorHandler(getEstudianteSchema, 'params'),
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const Estudiante = await service.findOne(id);
      res.json(Estudiante);
    } catch (error) {
      next(error);
    }
  }
);

/**
 * @openapi
 * /api/v1/estudiantes/{id}/emociones:
 *  get:
 *    summary: Retorna las emociones del estudiante con un respectivo id en un rango de fechas
 *    tags: [Estudiante]
 *    description: Usuarios con acceso [Profesor, Profesional de salud, Administrador]
 *    parameters:
 *      - in: path
 *        name: id
 *        schema:
 *          type: integer
 *        required: true
 *        description: El ID del estudiante
 *      - in: query
 *        name: startDate
 *        schema:
 *          type: string
 *          format: date-time
 *        required: false
 *        description: Fecha de inicio para el rango de búsqueda
 *      - in: query
 *        name: endDate
 *        schema:
 *          type: string
 *          format: date-time
 *        required: false
 *        description: Fecha de fin para el rango de búsqueda
 *    security:
 *      - ApiKeyAuth: []
 *      - BearerAuth: []
 *    responses:
 *      200:
 *        description: Todas las emociones del estudiante en el rango de fechas
 *        content:
 *          application/json:
 *            schema:
 *              type: array
 *              items:
 *                $ref: '#/components/schemas/Estudiante'
 *      401:
 *        description: Unauthorized
 *      404:
 *        description: Usuario no encontrado
 */
router.get('/:id/emociones',
  passport.authenticate('jwt', { session: false }),
  checkRoles('Profesor', 'Profesional de salud', 'Administrador'),
  validatorHandler(getEstudianteSchema, 'params'),
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const { startDate, endDate } = req.query;
      const estudiante = await service.findOneByEmociones(id, startDate, endDate);
      res.json(estudiante);
    } catch (error) {
      next(error);
    }
  }
);

/**
 * @openapi
 * /api/v1/estudiantes/{id}/materias:
 *  get:
 *    summary: retorna a las materias del estudiante con un respectivo id
 *    tags: [Estudiante]
 *    description: Usuarios con acceso [Profesor, Profesional de salud, Administrador]
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
 *        description: todos los estudiantes
 *        content:
 *          aplication/json:
 *            schema:
 *              type: array
 *              items:
 *                $ref: '#/components/schemas/Estudiante'
 *      401:
 *        description: Unauthorized
 *      404:
 *        description: Usuario no encontrado
 */
router.get('/:id/materias',
passport.authenticate('jwt', {session: false}),
checkRoles('Profesor', 'Profesional de salud', 'Administrador'),
  validatorHandler(getEstudianteSchema, 'params'),
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const Estudiante = await service.findOneByMaterias(id);
      res.json(Estudiante);
    } catch (error) {
      next(error);
    }
  }
);

/**
 * @openapi
 * /api/v1/estudiantes:
 *  post:
 *    summary: crea un nuevo estudiante
 *    tags: [Estudiante]
 *    security:
 *      - ApiKeyAuth: []
 *      - BearerAuth: []
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            $ref: '#/components/schemas/Estudiante'
 *    responses:
 *      201:
 *        description: nuevo estudiante creado!
 *      401:
 *        description: Unauthorized
 *      409:
 *        description: Conflicto - estudiante ya existente
 */
router.post('/',
  validatorHandler(createEstudianteSchema, 'body'),
  async (req, res, next) => {
    try {
      const email = req.body.user.email ;
      const codigo = req.body.codigoInstitucional;
      const body = req.body;
      const newEstudiante = await service.create(body, email, codigo);
      res.status(201).json(newEstudiante);
    } catch (error) {
      next(error);
    }
  }
);

/**
 * @openapi
 * /api/v1/estudiantes/{id}:
 *  patch:
 *    summary: actualiza un estudiante segun su id
 *    tags: [Estudiante]
 *    description: Usuarios con acceso [Administrador]
 *    parameters:
 *      - in: path
 *        name: id
 *        schema:
 *          type: string
 *        required: true
 *        description: el id del estudiante
 *    security:
 *      - ApiKeyAuth: []
 *      - BearerAuth: []
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            $ref: '#/components/schemas/EstudianteUpdate'
 *    responses:
 *      200:
 *        description: estudiante actualizado
 *      401:
 *        description: Unauthorized
 *      404:
 *        description: estudiante no encontrado
 */
router.patch('/:id',
  passport.authenticate('jwt', {session: false}),
  checkRoles('Administrador'),
  validatorHandler(getEstudianteSchema, 'params'),
  validatorHandler(updateEstudianteSchema, 'body'),
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const body = req.body;
      const Estudiante = await service.update(id, body);
      res.json(Estudiante);
    } catch (error) {
      next(error);
    }
  }
);


/**
 * @openapi
 * /api/v1/estudiantes:
 *  patch:
 *    summary: actualiza un estudiante segun su token
 *    tags: [Estudiante]
 *    description: Usuarios con acceso [Estudiante]
 *    security:
 *      - ApiKeyAuth: []
 *      - BearerAuth: []
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            $ref: '#/components/schemas/EstudianteUpdate'
 *    responses:
 *      200:
 *        description: estudiante actualizado
 *      401:
 *        description: Unauthorized
 *      404:
 *        description: estudiante no encontrado
 */
router.patch('/',
  passport.authenticate('jwt', {session: false}),
  checkRoles('Estudiante'),
  validatorHandler(updateEstudianteSchema, 'body'),
  async (req, res, next) => {
    try {
      const user = req.user;
      const body = req.body;
      const Estudiante = await service.updateToken(user.sub, body);
      res.json(Estudiante);
    } catch (error) {
      next(error);
    }
  }
);


/**
 * @openapi
 * /api/v1/estudiantes/{id}:
 *  delete:
 *    summary: elimina un estudiante
 *    tags: [Estudiante]
 *    description: Usuarios con acceso [Administrador]
 *    parameters:
 *      - in: path
 *        name: id
 *        schema:
 *          type: string
 *        required: true
 *        description: el id del estudiante
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
 *                  description: id del estudiante eliminado
 *      401:
 *        description: Unauthorized
 *      404:
 *        description: estudiante no encontrado
 */
router.delete('/:id',
  passport.authenticate('jwt', {session: false}),
  checkRoles('Administrador'),
  validatorHandler(getEstudianteSchema, 'params'),
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
