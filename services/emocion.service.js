import  boom  from '@hapi/boom';
import  { sequelize }  from '../libs/sequelize.js';

/**
 * Define las diferentes interaciones con la base de datos
 * para el API-REST,con la ayuda de sequileze en el modelo Emociones
 * Obtiene los datos de la BD y los retorna
*/

class EmocionService {
  constructor() {}

   //Creacion de una nueva emocion en la BD
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

  //Encuentra las emociones relacionadas con el token de un estudiante
  async findByUser(userId) {
    const emocion = await sequelize.models.Emocion.findAll({
      where: {
        '$estudiante.user.id$' :userId
      },
      include: [{
        association: 'estudiante',
        attributes: ['id'],
        include: [{ 
          model: sequelize.models.User, 
          as: 'user',
          attributes: ['id']
        }]
      }]
    });
    return emocion;
  }

}

export {EmocionService};
