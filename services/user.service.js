import  boom  from '@hapi/boom';
import  { sequelize }  from '../libs/sequelize.js';

class UserService {
  constructor() {}

  async create(data) {
    const newUser = await sequelize.models.User.create(data); 
    return newUser;
  }

  async find() {
    const rta = await sequelize.models.User.findAll();
    return rta;
  }

  async findOne(id) {
    const user = await sequelize.models.User.findByPk(id);
    if(!user){
      throw boom.notFound('Usuario no encontrado');
    }
    return user;
  }

  async update(id, changes) {
    const user = await this.findOne(id);
    const rta = await user.update(changes);
    return rta;
  }

  async delete(id) {
    const user = await this.findOne(id);
    await user.destroy();
    return { id };
  }
}

export {UserService};
