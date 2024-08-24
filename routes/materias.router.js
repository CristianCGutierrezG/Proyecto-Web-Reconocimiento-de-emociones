import express from 'express';
import passport from 'passport';

import { checkRoles } from '../middlewares/auth.handler.js';
import { MateriasService } from '../services/materias.service.js';
import { validatorHandler } from './../middlewares/validator.handler.js';
import { updateMateriasSchema, createMateriasSchema, getMateriasSchema, queryMateriaSchema, addInscripcionSchema } from '../schemas/materias.schema.js';

/** 
 * Define los diferentes rutas o endpoint para los datos de una materia
 * Comprobaciones.
 *  - Llave de acceso a la API
 *  - Datos de envio correctos
 *  - Autorizacion de rol y contraseña
*/

const router = express.Router();
const service = new MateriasService();

/**
 * 
 * @swagger
 * components:
 *  schemas:
 *    Materia:
 *      type: object
 *      properties:
 *        nombre:
 *          type: string
 *          description: nombre de la materia
 *        grupo:
 *          type: string
 *          description: grupo de la materia
 *        profesorId:
 *          type: integer
 *          description: id del profesor asignado
 *      required:
 *        - nombre
 *        - grupo
 *        - profesorId
 *      example:
 *        nombre: Calculo III
 *        grupo: 102-1
 *        profesorId: 4
 *    Inscripcion:
 *      type: object
 *      properties:
 *        materiaId:
 *          type: integer
 *          description: id del profesor asignado
 *        estudianteId:
 *          type: integer
 *          description: id del profesor asignad
 *      example:
 *        materiaId: 2
 *        estudianteId: 4  
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
 * /api/v1/materias:
 *  get:
 *    summary: Retorna todos las materias
 *    tags: [Materia]
 *    description: Usuarios con acceso [Estudiante, Profesor, Profesional de salud, Administrador]
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
 *        description: todos las materias
 *        content:
 *          aplication/json:
 *            schema:
 *              type: array
 *              items:
 *                $ref: '#/components/schemas/Materia'
 *      401:
 *        description: Unauthorized
 */
router.get('/',
  passport.authenticate('jwt', { session: false }),
  checkRoles('Estudiante', 'Profesor', 'Profesional de salud', 'Administrador'),
  validatorHandler(queryMateriaSchema, 'params'),
  async (req, res, next) => {
    try {
      const materia = await service.find(req.query);
      res.status(200).json(materia);
    } catch (error) {
      next(error);
    }
  }
);

/**
 * @openapi
 * /api/v1/materias/buscar/{value}:
 *  get:
 *    summary: Busca materias por nombre o nombre del profesor
 *    tags: [Materia]
 *    description: Usuarios con acceso [Estudiante, Profesor, Administrador]
 *    parameters:
 *      - in: path
 *        name: value
 *        schema:
 *          type: string
 *        required: true
 *        description: Nombre de la materia o nombre del profesor
 *      - in: query
 *        name: limit
 *        schema:
 *          type: integer
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
 *        description: Materias encontradas
 *        content:
 *          application/json:
 *            schema:
 *              type: array
 *              items:
 *                $ref: '#/components/schemas/Materia'
 *      401:
 *        description: Unauthorized
 *      404:
 *        description: Materia no encontrada
 */
router.get('/buscar/:value',
  passport.authenticate('jwt', { session: false }),
  checkRoles('Estudiante', 'Profesor', 'Administrador'),
  async (req, res, next) => {
    try {
      const { value } = req.params;
      const { limit, offset } = req.query;
      const materias = await service.findByNameOrProfessor(value, { limit, offset });
      res.json(materias);
    } catch (error) {
      next(error);
    }
  }
);


/**
 * @openapi
 * /api/v1/materias/{id}:
 *  get:
 *    summary: Retorna una materia
 *    tags: [Materia]
 *    description: Usuarios con acceso [Estudiante, Profesor, Profesional de salud, Administrador]
 *    parameters:
 *      - in: path
 *        name: id
 *        schema:
 *          type: integer
 *        required: true
 *        description: el id de la materia
 *    security:
 *      - ApiKeyAuth: []
 *      - BearerAuth: []
 *    responses:
 *      200:
 *        description: una materia en especifico
 *        content:
 *          aplication/json:
 *            schema:
 *              type: array
 *              items:
 *                $ref: '#/components/schemas/Materia'
 *      401:
 *        description: Unauthorized
 *      404:
 *        description: Materia no encontrada
 */
router.get('/:id',
  passport.authenticate('jwt', { session: false }),
  checkRoles('Estudiante', 'Profesor', 'Profesional de salud', 'Administrador'),
  validatorHandler(getMateriasSchema, 'params'),
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const materias = await service.findOne(id);
      res.json(materias);
    } catch (error) {
      next(error);
    }
  }
);

/**
 * @openapi
 * /api/v1/materias/token:
 *  post:
 *    summary: Crea una nueva materia con base al token de profesor 
 *    tags: [Materia]
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
 *            $ref: '#/components/schemas/Materia'
 *    responses:
 *      201:
 *        description: nueva Materia creada!
 *      401:
 *        description: Unauthorized
 *      409: 
 *        description: Conflicto - Materia ya existente
 */
router.post('/token',
  passport.authenticate('jwt', { session: false }),
  checkRoles('Profesor'),
  async (req, res, next) => {
    try {
      const body = req.body;
      const user = req.user
      const newMaterias = await service.createProfesor(body, user.sub);
      res.status(201).json(newMaterias);
    } catch (error) {
      next(error);
    }
  }
);


/**
 * @openapi
 * /api/v1/materias:
 *  post:
 *    summary: Crea una nueva materia
 *    tags: [Materia]
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
 *            $ref: '#/components/schemas/Materia'
 *    responses:
 *      201:
 *        description: nueva Materia creada!
 *      401:
 *        description: Unauthorized
 *      409: 
 *        description: Conflicto - Materia ya existente
 */
router.post('/',
  passport.authenticate('jwt', { session: false }),
  checkRoles('Administrador'),
  validatorHandler(createMateriasSchema, 'body'),
  async (req, res, next) => {
    try {
      const body = req.body;
      const newMaterias = await service.create(body);
      res.status(201).json(newMaterias);
    } catch (error) {
      next(error);
    }
  }
);

/**
 * @openapi
 * /api/v1/materias/add-inscripcionToken:
 *  post:
 *    summary: Inscribe un estudiante a una materia con base al token del estudiante
 *    tags: [Materia]
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
 *            $ref: '#/components/schemas/Inscripcion'
 *    responses:
 *      201:
 *        description: nueva Inscripcion creada!
 *      401:
 *        description: Unauthorized
 *      409: 
 *        description: Conflicto - Inscripcion ya existente
 */
router.post('/add-inscripcionToken',
  passport.authenticate('jwt', { session: false }),
  checkRoles('Estudiante'),
  validatorHandler(addInscripcionSchema, 'body'),
  async (req, res, next) => {
    try {
      const body = req.body;
      const user = req.user
      const newInscripcion = await service.addInscripcionToken(body, user.sub);
      res.status(201).json(newInscripcion);
    } catch (error) {
      next(error);
    }
  }
);

/**
 * @openapi
 * /api/v1/materias/add-inscripcion:
 *  post:
 *    summary: Inscribe un estudiante a una materia con base al id del estudiante
 *    tags: [Materia]
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
 *            $ref: '#/components/schemas/Inscripcion'
 *    responses:
 *      201:
 *        description: nueva Inscripcion creada!
 *      401:
 *        description: Unauthorized
 *      409: 
 *        description: Conflicto - Inscripcion ya existente
 */
router.post('/add-inscripcion',
  passport.authenticate('jwt', { session: false }),
  checkRoles('Profesor', 'Administrador'),
  validatorHandler(addInscripcionSchema, 'body'),
  async (req, res, next) => {
    try {
      const body = req.body;
      const newInscripcion = await service.addInscripcion(body);
      res.status(201).json(newInscripcion);
    } catch (error) {
      next(error);
    }
  }
);

/**
 * @openapi
 * /api/v1/materias/{id}:
 *  patch:
 *    summary: Actualiza una materia segun su id
 *    tags: [Materia]
 *    description: Usuarios con acceso [Profesor, Administrador]
 *    parameters: 
 *      - in: path
 *        name: id
 *        schema:
 *          type: string
 *        required: true
 *        description: el id de la materia
 *    security:
 *      - ApiKeyAuth: []
 *      - BearerAuth: []
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            $ref: '#/components/schemas/Materia'
 *    responses:
 *      200:
 *        description: Materia actualizada
 *      401:
 *        description: Unauthorized
 *      404:
 *        description: Materia no encontrada
 */
router.patch('/:id',
  passport.authenticate('jwt', { session: false }),
  checkRoles('Profesor', 'Administrador'),
  validatorHandler(getMateriasSchema, 'params'),
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const body = req.body;
      const materias = await service.update(id, body);
      res.json(materias);
    } catch (error) {
      next(error);
    }
  }
);

/**
 * @openapi
 * /api/v1/materias/{id}:
 *  delete:
 *    summary: elimina una materia
 *    tags: [Materia]
 *    description: Usuarios con acceso [Profesor, Administrador]
 *    parameters: 
 *      - in: path
 *        name: id
 *        schema:
 *          type: string
 *        required: true
 *        description: el id de la materia
 *    security:
 *      - ApiKeyAuth: []
 *      - BearerAuth: []
 *    responses:
 *      201:
 *        description: materia eliminada
 *        content:
 *          aplication/json:
 *            schema:
 *              type: object
 *              properties:
 *                id:
 *                  type: integer
 *                  description: id de la materia eliminado
 *      401:
 *        description: Unauthorized
 *      404:
 *        description: Materia no encontrada
 */
router.delete('/:id',
  passport.authenticate('jwt', { session: false }),
  checkRoles('Profesor', 'Administrador'),
  validatorHandler(getMateriasSchema, 'params'),
  async (req, res, next) => {
    try {
      const { id } = req.params;
      await service.delete(id);
      res.status(201).json({ id });
    } catch (error) {
      next(error);
    }
  }
);

export { router };

