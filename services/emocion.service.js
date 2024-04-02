import  boom  from '@hapi/boom';
import  { sequelize }  from '../libs/sequelize.js';

class EmocionService {
  constructor() {}

  async create(data, userId) {
    const estudiante = await sequelize.models.Estudiante.findOne({
      where: { userId },
    })
    const newData = {
      ...data,
      estudianteId: estudiante.dataValues.id
    }
    const newEmocion = await sequelize.models.Emocion.create(newData); 
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
      throw boom.notFound('Emocion no encontrada');
    }
    return emocion;
  }

  async findByUser(userId) {
    const emocion = await sequelize.models.Emocion.findAll({
      where: {
        '$estudiante.user.id$' :userId
      },
      include: [{
        association: 'estudiante',
        include: [{ 
          model: sequelize.models.User, 
          as: 'user',
          attributes: ['id', 'email', 'role']
        }]
      }]
    });
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
