import boom from '@hapi/boom';

import { sequelize } from '../libs/sequelize.js';

class ProfesoresService {

  constructor() {}

  async create(data) {
    const newProfesor = await sequelize.models.Profesor.create(data, {
      include: [ 'user' ]
    }); 
    delete newProfesor.user.dataValues.password;
    return newProfesor;
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
    const profesor = await sequelize.models.Profesor.findAll(options);
    return profesor;
  }

  async findOne(id) {
    const profesor = await sequelize.models.Profesor.findByPk(id,{
      include: [ 
      { 
        model: sequelize.models.Materias, 
        as: 'materias',
        attributes: ['id', 'nombre', 'grupo']
      }
      ]  
    });
    if(!profesor){
      throw boom.notFound('Profesor no encontrado');
    }
    return profesor;
  }

  async update(id, changes) {
    const profesor = await this.findOne(id);
    const rta = await profesor.update(changes);
    return rta;
  }

  async delete(id) {
    const profesor = await this.findOne(id);
    const user = await sequelize.models.User.findByPk(profesor.user.dataValues.id);
    await profesor.destroy();
    await user.destroy();
    return { rta:  true };
  }

}

export { ProfesoresService };
