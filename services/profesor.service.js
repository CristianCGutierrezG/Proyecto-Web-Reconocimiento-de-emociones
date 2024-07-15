import boom from '@hapi/boom';
import { sequelize } from '../libs/sequelize.js';

/**
 * Define las diferentes interaciones con la base de datos
 * para el API-REST,con la ayuda de sequileze en el modelo Profesores
 * Obtiene los datos de la BD y los retorna
*/

class ProfesoresService {

  constructor() {}

  //Creacion de un nuevo profesor en la BD
  //Relacionado con la info de su usuario asignado
  async create(data, email, codigo) {
    // Verificar la unicidad del correo electrónico y el código institucional 
    const [existingUser, existingProfesor] = await Promise.all([
      sequelize.models.User.findOne({
        where: { email: email}
      }),
      sequelize.models.Profesor.findOne({
        where: { codigoInstitucional: codigo }
      })
    ]);

    if (existingUser) {
      throw new Error('El correo electrónico ya está en uso');
    }

    if (existingProfesor) {
      throw new Error('El código institucional ya está en uso');
    }

    // Crear el usuario y el profesor
    const newProfesor = await sequelize.models.Profesor.create(data, {
      include: [ 'user' ]
    }); 
    delete newProfesor.user.dataValues.password;
    return newProfesor;
  }

  //Encontrar todos los profesores en la BD
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
    const profesor = await sequelize.models.Profesor.findAll(options);
    return profesor;
  }

  //Encontrar un profesor que coincida con el id 
  async findOne(id) {
    const profesor = await sequelize.models.Profesor.findByPk(id,{
      include: [ 
        { 
          model: sequelize.models.User, 
          as: 'user',
          attributes: ['id', 'email', 'role']
        },
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

  //Encontrar la info asignadas a un profesor segun su token
  async findByUser(userId) {
    const profesor = await sequelize.models.Profesor.findOne({
      where: {
        userId: userId
      },
        include: [{ 
          model: sequelize.models.User, 
          as: 'user',
          attributes: ['id', 'email', 'role']
        }]
    });
    return profesor;
  }


  //Actualizar la info de un profesor
  async update(id, changes) {
    const profesor = await this.findOne(id);
    const rta = await profesor.update(changes);
    return rta;
  }

  //Actualizar la info de un profesor segun su token
  async updateToken(id, changes) {
    const profesor = await this.findByUser(id);
    const rta = await profesor.update(changes);
    return rta;
  }

  //Eliminar un profesor
  async delete(id) {
    const profesor = await this.findOne(id);
    const user = await sequelize.models.User.findByPk(profesor.user.dataValues.id);
    await profesor.destroy();
    await user.destroy();
    return { rta:  true };
  }

}

export { ProfesoresService };
