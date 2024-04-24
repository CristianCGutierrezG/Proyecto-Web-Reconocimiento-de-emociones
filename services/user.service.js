import  boom  from '@hapi/boom';
import  { sequelize }  from '../libs/sequelize.js';

/**
 * Define las diferentes interaciones con la base de datos
 * para el API-REST,con la ayuda de sequileze en el modelo User
 * Obtiene los datos de la BD y los retorna
 */
class UserService {
  constructor() {}

  //Creacion de un nuevo usuario en la BD
  async create(data) {
    const newUser = await sequelize.models.User.create(data); 
    delete newUser.dataValues.password;
    return newUser;
  }

  //Encontrar todos los usuario en la BD
  //con limit y offset para limitar la cantidad de datos
  async find(query) {
    const options = {
      attributes: { exclude: ['password'] },
      include: [
        { 
          model: sequelize.models.Estudiante, 
          as: 'estudiante',
          attributes: ['nombres', 'apellidos', 'codigoInstitucional']
        },
        { 
          model: sequelize.models.Profesor, 
          as: 'profesor',
          attributes: ['nombres', 'apellidos', 'codigoInstitucional']
        },
        { 
          model: sequelize.models.ProSalud, 
          as: 'proSalud',
          attributes: ['nombres', 'apellidos', 'codigoInstitucional']
        }
      ],
    };
    const { limit, offset } = query;
    if (limit && offset) {
      options.limit = limit;
      options.offset = offset;
    }
    const users = await sequelize.models.User.findAll(options);
    return users;
  }

  //Encontrar un usuario que coincida con el id 
  async findOne(id) {
    const user = await sequelize.models.User.findByPk(id);
    if(!user){
      throw boom.notFound('Usuario no encontrado');
    }
    delete user.dataValues.password;
    return user;
  }

  //Encontrar un usuario que coincida con el email 
  async findByEmail(email) {
    const rta = await sequelize.models.User.findOne({
      where: { email },
    });
    return rta;
  }

  //Actualizar la info de un usuario
  async update(id, changes) {
    const user = await this.findOne(id);
    const rta = await user.update(changes);
    delete rta.dataValues.password;
    return rta;
  }

  //Eliminar un usuario
  async delete(id) {
    const user = await this.findOne(id);
    await user.destroy();
    return { id };
  }
}

export {UserService};
