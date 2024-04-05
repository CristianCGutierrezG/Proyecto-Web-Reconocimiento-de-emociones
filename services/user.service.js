import  boom  from '@hapi/boom';
import  { sequelize }  from '../libs/sequelize.js';


class UserService {
  constructor() {}

  async create(data) {
    const newUser = await sequelize.models.User.create(data); 
    delete newUser.dataValues.password;
    return newUser;
  }

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

  async findByEmail(email) {
    const rta = await sequelize.models.User.findOne({
      where: { email },
    });
    return rta;
  }

  async findOne(id) {
    const user = await sequelize.models.User.findByPk(id);
    if(!user){
      throw boom.notFound('Usuario no encontrado');
    }
    delete user.dataValues.password;
    return user;
  }

  async update(id, changes) {
    const user = await this.findOne(id);
    const rta = await user.update(changes);
    delete rta.dataValues.password;
    return rta;
  }

  async delete(id) {
    const user = await this.findOne(id);
    await user.destroy();
    return { id };
  }
}

export {UserService};
