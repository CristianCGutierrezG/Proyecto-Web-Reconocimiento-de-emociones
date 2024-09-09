import boom from '@hapi/boom';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';

import { config } from '../config/config.js';
import { UserService } from './user.service.js';

/**
 * Define las diferentes interaciones con la base de datos
 * para el API-REST,con la ayuda de sequileze para la autenticacion
 * Obtiene los datos de la BD y los retorna
*/

const service = new UserService();

class AuthService {

  //Obtiene el usuario asignado a un correo en especificando
  //realizando la comprobacion de su contraseña
  async getUser(email, password) {
    const user = await service.findByEmail(email);
    if (!user) {
      throw boom.unauthorized();
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw boom.unauthorized();
    }
    delete user.dataValues.password;
    delete user.dataValues.recoveryToken;
    return user;
  }

  //asigna el token dependiendo del rol del usuario que ingresa
   signToken(user) {
    const payload = {
      sub: user.id,
      role: user.role,
    };
    const token = jwt.sign(payload, config.jwtSecret, {
      expiresIn: '1h',
    });
    return {
      user,
      token,
    };
  }

  //método para recuperar el token
  async recoverToken(userId) {
    const user = await service.findOne(userId);
    if (!user) {
      throw boom.unauthorized();
    }

    const tokenData = this.signToken(user);
    
    return tokenData; 
  }

  //Envio del link de recuperacion de contraseña al correo especificado
  async sendRecovery(email) {
    const user = await service.findByEmail(email);
    if (!user) {
      throw boom.unauthorized();
    }

    const payload = { sub: user.id };
    const token = jwt.sign(payload, config.jwtRecoverySecret, {
      expiresIn: '15min',
    });
    const link = `http://localhost:3000/cambio-contrasena?token=${token}`;
    await service.update(user.id, { recoveryToken: token });
    const mail = {
      from: `${config.emailSender}`,
      to: `${user.email}`,
      subject: 'Email para recuperar contraseña',
      html: `<b>Ingresa a este link para recuperar tu contraseña: ${link}</b>`,
    };

    const rta = await this.sendMail(mail);
    return rta;
  }

  //Cambio de contraseña en la bd
  async changePassword(token, newPassword) {
    try {
      const payload = jwt.verify(token, config.jwtRecoverySecret);
      const user = await service.findOne(payload.sub);

      if (user.recoveryToken !== token) {
        throw boom.unauthorized();
      }

      const hash = await bcrypt.hash(newPassword, 10);
      await service.update(user.id, { recoveryToken: null, password: hash });
      return { message: 'La contraseña fue cambiada' };
    } catch (error) {
      throw boom.unauthorized();
    }
  }

  //Especificaciones del envio de correo
  async sendMail(infoMail) {
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      secure: true, // true for 465, false for other ports
      port: 465,
      auth: {
        user: config.emailSender,
        pass: config.emailPassword,
      },
    });

    await transporter.sendMail(infoMail);
    return { message: 'Mensaje enviado' };
  }
}

export {AuthService};