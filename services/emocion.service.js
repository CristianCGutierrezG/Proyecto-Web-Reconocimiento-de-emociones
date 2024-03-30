import  boom  from '@hapi/boom';
import  { sequelize }  from '../libs/sequelize.js';

class EmocionService {
  constructor() {}

  async create(data) {
    const newEmocion = await sequelize.models.Emocion.create(data); 
    return newEmocion;
  }

  async find() {
    const rta = await sequelize.models.Emocion.findAll({
      include: ['estudiante']
    });
    return rta;
  }

  async findOne(id) {
    const emocion = await sequelize.models.Emocion.findByPk(id);
    if(!emocion){
      throw boom.notFound('Emocion no encontrado');
    }
    return emocion;
  }

  async update(id, changes) {
    const emocion = await this.findOne(id);
    const rta = await emocion.update(changes);
    return rta;
  }

  async delete(id) {
    const emocion = await this.findOne(id);
    await emocion.destroy();
    return { id };
  }
}

export {EmocionService};
