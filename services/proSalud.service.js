import boom from '@hapi/boom';

import { sequelize } from '../libs/sequelize.js';

class ProSaludService {

  constructor() {}

  async create(data) {
    const newProSalud = await sequelize.models.ProSalud.create(data, {
      include: ['user']
    }); 
    return newProSalud;
  }

  async find() {
    const rta = await sequelize.models.ProSalud.findAll({
      include: ['user']
    });
    return rta; 
  }

  async findOne(id) {
    const proSalud = await sequelize.models.ProSalud.findByPk(id);
    if(!proSalud){
      throw boom.notFound('Profesional de Salud no encontrado');
    }
    return proSalud;
  }

  async update(id, changes) {
    const proSalud = await this.findOne(id);
    const rta = await proSalud.update(changes);
    return rta;
  }

  async delete(id) {
    const proSalud = await this.findOne(id);
    await proSalud.destroy();
    return { rta:  true };
  }

  

}

export { ProSaludService };
