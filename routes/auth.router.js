import express  from 'express';
import passport from 'passport';
import { AuthService } from '../services/auth.service.js';
import { validatorHandler } from '../middlewares/validator.handler.js'; 
import { loginAuthSchema, recoveryAuthSchema, changePasswordAuthSchema } from '../schemas/auth.schema.js';

/** 
 * Define los diferentes rutas o endpoint para la autentificacion y cambio de contraseña
 * Comprobaciones.
 *  - Llave de acceso a la API
 *  - Datos de envio correctos
 *  - Autorizacion de rol y contraseña
*/

const router = express.Router();
const service = new AuthService();

/**
 * 
 * @swagger
 * components:
 *  schemas:
 *    Login:
 *      type: object
 *      properties:
 *        email:
 *          type: string
 *          description: correo de acceso del usuario
 *        password:
 *          type: string
 *          description: contraseña de acceso del usuario
 *      required:
 *        - email
 *        - password
 *      example:
 *        email: user@email.com
 *        password: password123
 *    recovery:
 *      type: object
 *      properties:
 *        email:
 *          type: string
 *          description: correo de acceso del usuario
 *      required:
 *        - email
 *      example:
 *        email: user@email.com
 *    change:
 *      type: object
 *      properties:
 *        token:
 *          type: string
 *          description: token enviado con el correo de confirmacion
 *        password:
 *          type: string
 *          description: contraseña de acceso del usuario
 *      required:
 *        - token
 *        - password
 *      example:
 *        token: ''
 *        password: password123
 */

/**
 * @openapi
 * /api/v1/auth/login:
 *  post:
 *    summary: Ingreso de usuario y asignacion de token
 *    tags: [Auth]
 *    security:
 *      - ApiKeyAuth: []
 *      - BearerAuth: []
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            $ref: '#/components/schemas/Login'
 *    responses:
 *      200:
 *        description: Ingreso
 *        content:
 *          aplication/json:
 *            schema:
 *              type: object 
 *              $ref: '#/components/schemas/User'  
 *      401:
 *        description: Unauthorized
*/
router.post(
  '/login',
  validatorHandler(loginAuthSchema, 'body'),
  passport.authenticate('local', { session: false }),
  async (req, res, next) => {
    try {
      const user = req.user;
      res.json(service.signToken(user));
    } catch (error) {
      next(error);
    }
  }
);

/**
 * @openapi
 * /api/v1/auth/recovery:
 *  post:
 *    summary: envio de correo para recuperacion de contraseña
 *    tags: [Auth]
 *    security:
 *      - ApiKeyAuth: []
 *      - BearerAuth: []
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            $ref: '#/components/schemas/recovery'
 *    responses:
 *      201:
 *        description: Mensaje enviado
 *      401:
 *        description: Unauthorized
*/
router.post(
  '/recovery', 
  validatorHandler(recoveryAuthSchema, 'body'),
  async (req, res, next) => {
  try {
    const { email } = req.body;
    const rta = await service.sendRecovery(email);
    res.json(rta);
  } catch (error) {
    next(error);
  }
});


/**
 * @openapi
 * /api/v1/auth/change-password:
 *  post:
 *    summary: confirmación del token y cambio de contraseña
 *    tags: [Auth]
 *    security:
 *      - ApiKeyAuth: []
 *      - BearerAuth: []
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            $ref: '#/components/schemas/change'
 *    responses:
 *      201:
 *        description: La contraseña fue cambiada
 *      401:
 *        description: Unauthorized
*/
router.post(
  '/change-password', 
  validatorHandler(changePasswordAuthSchema, 'body'),
  async (req, res, next) => {
  try {
    const { token, newPassword } = req.body;
    const rta = await service.changePassword(token, newPassword);
    res.json(rta);
  } catch (error) {
    next(error);
  }
});

export {router};
