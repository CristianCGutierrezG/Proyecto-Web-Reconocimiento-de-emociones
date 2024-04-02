import boom from '@hapi/boom';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';

import { config } from '../config/config.js';
import { UserService } from './user.service.js';
const service = new UserService();

class AuthService {
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
    return user;
  }

  signToken(user) {
    const payload = {
      sub: user.id,
      role: user.role,
    };
    const token = jwt.sign(payload, config.jwtSecret);
    return {
      user,
      token,
    };
  }

  async sendMail(email) {
    const user = await service.findByEmail(email);
    if (!user) {
      throw boom.unauthorized();
    }

    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      secure: true, // true for 465, false for other ports
      port: 465,
      auth: {
        user: config.emailSender,
        pass: config.emailPassword
      },
    });

    await transporter.sendMail({
      from: `${config.emailSender}`, // sender address
      to: `${user.email}`, // list of receivers
      subject: 'Nuevo correo de prueba', // Subject line
      text: 'Estoy usando Nodemailer!', // plain text body
      html: '<b>Holaaaaaaaaaa!</b>', // html body
    });

    return { message: 'Correo enviado!' };
  }
}

export {AuthService};