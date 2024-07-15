import boom from '@hapi/boom';

import { sequelize } from '../libs/sequelize.js';

/**
 * Define las diferentes interaciones con la base de datos
 * para el API-REST,con la ayuda de sequileze en el modelo ProSalud
 * Obtiene los datos de la BD y los retorna
*/

class ProSaludService {

  constructor() {}

  //Creacion de un nuevo proSalud en la BD
  //Relacionado con la info de su usuario asignado
  async create(data, email, codigo) { 
    // Verificar la unicidad del correo electrónico y el código institucional 
    const [existingUser, existingProSalud] = await Promise.all([
      sequelize.models.User.findOne({
        where: { email: email}
      }),
      sequelize.models.ProSalud.findOne({
        where: { codigoInstitucional: codigo }
      })
    ]);

    if (existingUser) {
      throw new Error('El correo electrónico ya está en uso');
    }

    if (existingProSalud) {
      throw new Error('El código institucional ya está en uso');
    }

    // Crear el usuario y el proSalud
    const newProSalud = await sequelize.models.ProSalud.create(data, {
      include: ['user']
    }); 
    delete newProSalud.user.dataValues.password;
    return newProSalud;
  }

  //Encontrar todos los ProSalud en la BD
  //con limit y offset para limitar la cantidad de datos
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
    const proSalud = await sequelize.models.ProSalud.findAll(options);
    return proSalud;
  }

   //Encontrar un proSalud que coincida con el id 
   async findOne(id) {
    const proSalud = await sequelize.models.ProSalud.findByPk(id, {
      include: [
        { 
          model: sequelize.models.User, 
          as: 'user',
          attributes: ['id', 'email', 'role']
        }
      ]
    });
    if(!proSalud){
      throw boom.notFound('Profesional de salud no encontrado');
    }
    return proSalud;
  }

  //Encontrar la info asignadas a un proSalud segun su token
  async findByUser(userId) {
    const proSalud = await sequelize.models.ProSalud.findOne({
      where: {
        userId: userId
      },
        include: [{ 
          model: sequelize.models.User, 
          as: 'user',
          attributes: ['id', 'email', 'role']
        }]
    });
    return proSalud;
  }

  //Actualizar la info de un proSalud
  async update(id, changes) {
    const proSalud = await this.findOne(id);
    const rta = await proSalud.update(changes);
    return rta;
  }

  //Actualizar la info de un proSalud segun su token
  async updateToken(id, changes) {
    const proSalud = await this.findByUser(id);
    const rta = await proSalud.update(changes);
    return rta;
  }

  //Eliminar un proSalud
  async delete(id) {
    const proSalud = await this.findOne(id);
    const user = await sequelize.models.User.findByPk(proSalud.user.dataValues.id);
    await proSalud.destroy();
    await user.destroy();
    return { rta:  true };
  }

}

export { ProSaludService };