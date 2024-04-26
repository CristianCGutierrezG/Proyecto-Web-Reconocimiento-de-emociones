import express from 'express';
import passport from 'passport';

import {EmocionService} from '../services/emocion.service.js';
import { MateriasService } from '../services/materias.service.js';
import { EstudiantesService } from '../services/estudiante.service.js'; 

/** 
 * Define los diferentes rutas o endpoint para opciones de obtener datos relacionados con el perfil del usuario
 * Comprobaciones.
 *  - Llave de acceso a la API
 *  - Datos de envio correctos
 *  - Autorizacion de rol y contraseña
*/

const router = express.Router();
const serviceEmocion = new EmocionService();
const serviceMaterias = new MateriasService();
const serviceEstudiante = new EstudiantesService();

/**
 * 
 * @swagger
 * components:
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
 * /api/v1/profile/estudiante-emociones:
 *  get:
 *    summary: Encuetra las emociones del estudiante segun el token de acceso
 *    tags: [Profile]
 *    security:
 *      - ApiKeyAuth: []
 *      - BearerAuth: []
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
 *    responses:
 *      200:
 *        description: las emociones de un estudiante especifico
 *        content:
 *          aplication/json:
 *            schema:
 *              type: array
 *              items:
 *                $ref: '#/components/schemas/Emociones'
 *      401:
 *        description: Unauthorized
 */
router.get(
  '/estudiante-emociones',
  passport.authenticate('jwt', { session: false }),
  async (req, res, next) => {
    try {
      const user = req.user;
      const emociones = await serviceEmocion.findByUser(user.sub, req.query);
      res.json(emociones);
    } catch (error) {
      next(error);
    }
  }
);

/**
 * @openapi
 * /api/v1/profile/estudiante-materias:
 *  get:
 *    summary: Encuetra las materias inscritas del estudiante segun el token de acceso
 *    tags: [Profile]
 *    security:
 *      - ApiKeyAuth: []
 *      - BearerAuth: []
 *    responses:
 *      200:
 *        description: las materias de un estudiante especifico
 *        content:
 *          aplication/json:
 *            schema:
 *              type: array
 *              items:
 *                $ref: '#/components/schemas/Materia'
 *      401:
 *        description: Unauthorized
 */
router.get(
  '/estudiante-materias',
  passport.authenticate('jwt', { session: false }),
  async (req, res, next) => {
    try {
      const user = req.user;
      const materias = await serviceMaterias.findByEstudiante(user.sub);
      res.json(materias);
    } catch (error) {
      next(error);
    }
  }
);

/**
 * @openapi
 * /api/v1/profile/estudiante-info:
 *  get:
 *    summary: Encuetra la informacion personal del estudiante segun el token de acceso
 *    tags: [Profile]
 *    security:
 *      - ApiKeyAuth: []
 *      - BearerAuth: []
 *    responses:
 *      200:
 *        description: la información de un estudiante especifico
 *        content:
 *          aplication/json:
 *            schema:
 *              type: array
 *              items:
 *                $ref: '#/components/schemas/Estudiante'
 *      401:
 *        description: Unauthorized
 */
router.get(
  '/estudiante-info',
  passport.authenticate('jwt', { session: false }),
  async (req, res, next) => {
    try {
      const user = req.user;
      const info = await serviceEstudiante.findByUser(user.sub);
      res.json(info);
    } catch (error) {
      next(error);
    }
  }
);

/**
 * @openapi
 * /api/v1/profile/profesor-materias:
 *  get:
 *    summary: Encuetra las materias del profesor segun el token de acceso
 *    tags: [Profile]
 *    security:
 *      - ApiKeyAuth: []
 *      - BearerAuth: []
 *    responses:
 *      200:
 *        description: la is materias de un profesor especifico
 *        content:
 *          aplication/json:
 *            schema:
 *              type: array
 *              items:
 *                $ref: '#/components/schemas/Profesor'
 *      401:
 *        description: Unauthorized
 */
router.get(
  '/profesor-materias',
  passport.authenticate('jwt', { session: false }),
  async (req, res, next) => {
    try {
      const user = req.user;
      const materias = await serviceMaterias.findByProfesor(user.sub);
      res.json(materias);
    } catch (error) {
      next(error);
    }
  }
);



export {router};