import express  from 'express';
import passport from 'passport';
import { AuthService } from '../services/auth.service.js';
import { validatorHandler } from '../middlewares/validator.handler.js'; 
import { loginAuthSchema, recoveryAuthSchema, changePasswordAuthSchema } from '../schemas/auth.schema.js';

const router = express.Router();
const service = new AuthService();

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
