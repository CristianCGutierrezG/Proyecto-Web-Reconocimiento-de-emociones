// const { faker } = require('@faker-js/faker');
import boom from '@hapi/boom';

import { sequelize } from '../libs/sequelize.js';

class EstudiantesService {

  constructor() {}

  async create(data) {
    const newEstudiante = await sequelize.models.Estudiante.create(data, {
      include: ['user']
    }); 
    delete newEstudiante.user.dataValues.password;
    return newEstudiante;
  }

  async find(query) {
    const options = {
      include: [ 
        { 
          model: sequelize.models.User, 
          as: 'user',
          attributes: ['id', 'email', 'role']
        },
      ]
    };
    const { limit, offset } = query;
    if (limit && offset) {
      options.limit = limit;
      options.offset = offset;
    }
    const estudiantes = await sequelize.models.Estudiante.findAll(options);
    return estudiantes;
  }

  async findOne(id) {
    const estudiante = await sequelize.models.Estudiante.findByPk(id, {
      include: [
        { 
          model: sequelize.models.User, 
          as: 'user',
          attributes: ['id', 'email', 'role']
        }
      ]
    });
    if(!estudiante){
      throw boom.notFound('Estudiante no encontrado');
    }
    return estudiante;
  }

  async findOneByEmociones(id) {
    const estudiante = await sequelize.models.Estudiante.findByPk(id, {
      include: [ 
      { 
        model: sequelize.models.Emocion, 
        as: 'emociones',
        attributes: ['id', "emocion", "createdAt"]
      }
      ]  
    });
    if(!estudiante){
      throw boom.notFound('Estudiante no encontrado');
    }
    return estudiante;
  }

  async findOneByMaterias(id) {
    const estudiante = await sequelize.models.Estudiante.findByPk(id, {
      include: [ 
      { 
        model: sequelize.models.Materias, 
        as: 'inscritos',
        through: {attributes: ['id']}
      } 
    ]  
    });
    if(!estudiante){
      throw boom.notFound('Estudiante no encontrado');
    }
    return estudiante;
  }
  async update(id, changes) {
    const estudiante = await this.findOne(id);
    const rta = await estudiante.update(changes);
    return rta;
  }

  async delete(id) {
    const estudiante = await this.findOne(id);
    const user = await sequelize.models.User.findByPk(estudiante.user.dataValues.id);
    await estudiante.destroy();
    await user.destroy();
    return { rta:  true };
  }

  

}

export { EstudiantesService };
