import boom from '@hapi/boom';

import { sequelize } from '../libs/sequelize.js';

class ProfesoresService {

  constructor() {}

  async create(data) {
    const newProfesor = await sequelize.models.Profesor.create(data, {
      include: [ 'user' ]
    }); 
    return newProfesor;
  }

  async find() {
    const rta = await sequelize.models.Profesor.findAll({
      include: [ 
        { 
          model: sequelize.models.User, 
          as: 'user',
          attributes: ['id', 'email', 'role']
        },
      ]
    });
    return rta; 
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
    await profesor.destroy();
    return { rta:  true };
  }

}

export { ProfesoresService };
