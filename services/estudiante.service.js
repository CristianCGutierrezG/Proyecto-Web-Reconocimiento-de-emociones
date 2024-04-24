import boom from '@hapi/boom';

import { sequelize } from '../libs/sequelize.js';
import { escape } from 'sequelize/lib/sql-string';


/**
 * Define las diferentes interaciones con la base de datos
 * para el API-REST,con la ayuda de sequileze en el modelo Estudiante
 * Obtiene los datos de la BD y los retorna
*/

class EstudiantesService {

  constructor() {}

  //Creacion de un nuevo estudiante en la BD
  //Relacionado con la info de su usuario asignado
  async create(data, email, codigo) { 
    // Verificar la unicidad del correo electrónico y el código institucional 
    const [existingUser, existingEstudiante] = await Promise.all([
      sequelize.models.User.findOne({
        where: { email: email}
      }),
      sequelize.models.Estudiante.findOne({
        where: { codigoInstitucional: codigo }
      })
    ]);

    if (existingUser) {
      throw new Error('El correo electrónico ya está en uso');
    }

    if (existingEstudiante) {
      throw new Error('El código institucional ya está en uso');
    }

    // Crear el usuario y el estudiante
    const newEstudiante = await sequelize.models.Estudiante.create(data, {
      include: ['user']
    });

    delete newEstudiante.user.dataValues.password;
    return newEstudiante;
  }
    
  

  //Encontrar todos los estudiantes en la BD
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
    const estudiantes = await sequelize.models.Estudiante.findAll(options);
    return estudiantes;
  }

  //Encontrar un estudiante que coincida con el id 
  async findOne(id) {
    const estudiante = await sequelize.models.Estudiante.findByPk(id, {
      include: [
        { 
          model: sequelize.models.User, 
          as: 'user',
          attributes: ['id', 'email', 'role']
        }
      ]
    });
    if(!estudiante){
      throw boom.notFound('Estudiante no encontrado');
    }
    console.log(estudiante)
    return estudiante;
  }

  //Encontrar la info asignadas a un estudiante sgun su token
  async findByUser(userId) {
    const estudiante = await sequelize.models.Estudiante.findOne({
      where: {
        userId: userId
      },
        include: [{ 
          model: sequelize.models.User, 
          as: 'user',
          attributes: ['id', 'email', 'role']
        }]
    });
    console.log(estudiante)
    return estudiante;
  }

 //Encontrar las emociones asignadas a un estudiante segun su token
  async findOneByEmociones(id) {
    const estudiante = await sequelize.models.Estudiante.findByPk(id, {
      include: [ 
      { 
        model: sequelize.models.Emocion, 
        as: 'emociones',
        attributes: ['id', "emocion", "createdAt"]
      }
      ]  
    });
    if(!estudiante){
      throw boom.notFound('Estudiante no encontrado');
    }
    return estudiante;
  }

  //Encontrar las materias asignadas a un estudiante sgun su token
  async findOneByMaterias(id) {
    const estudiante = await sequelize.models.Estudiante.findByPk(id, {
      include: [ 
      { 
        model: sequelize.models.Materias, 
        as: 'inscritos',
        through: {attributes: ['id']}
      } 
    ]  
    });
    if(!estudiante){
      throw boom.notFound('Estudiante no encontrado');
    }
    return estudiante;
  }

  //Actualizar la info de un estudiante
  async update(id, changes) {
    const estudiante = await this.findOne(id);
    const rta = await estudiante.update(changes);
    return rta;
  }

  //Actualizar la info de un estudiante segun su token
  async updateToken(id, changes) {
    const estudiante = await this.findByUser(id);
    const rta = await estudiante.update(changes);
    return rta;
  }

  //Eliminar un estudiante
  async delete(id) {
    const estudiante = await this.findOne(id);
    const user = await sequelize.models.User.findByPk(estudiante.user.dataValues.id);
    await estudiante.destroy();
    await user.destroy();
    return { rta:  true };
  }

  

}

export { EstudiantesService };
