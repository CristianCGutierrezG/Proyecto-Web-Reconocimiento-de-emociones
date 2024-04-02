import  boom  from '@hapi/boom';
import  { sequelize }  from '../libs/sequelize.js';

class MateriasService {
  constructor() {}

  async create(data, userId) {
    const profesor = await sequelize.models.Profesor.findOne({
      where: { userId },
    })
    if(!profesor){
      throw boom.notFound('Profesor no encontrado');
    }
    const newData = {
      ...data,
      profesorId: profesor.dataValues.id
    }
    const newMaterias = await sequelize.models.Materias.create(newData, {
      include: ['profesor']
    }); 
    return newMaterias;
  }

  async addInscripcion(data, userId) {
    const estudiante = await sequelize.models.Estudiante.findOne({
      where: { userId },
    })
    if(!estudiante){
      throw boom.notFound('Estudiante no encontrado');
    }
    const newData = {
      ...data,
      estudianteId: estudiante.dataValues.id
    }
    const newInscripcion = await sequelize.models.EstudiantesMaterias.create(newData); 
    return newInscripcion;
  }

  async find(query) {
    const options = {
      include: [{
        association: 'profesor',
        attributes: {
          exclude: ['fechaNacimiento', 'createdAt', 'userId'] 
        }}
      ]
    };
    const { limit, offset } = query;
    if (limit && offset) {
      options.limit = limit;
      options.offset = offset;
    }
    const materias = await sequelize.models.Materias.findAll(options);
    return materias;
  }

  async findOne(id) {
    const materias = await sequelize.models.Materias.findByPk(id, {
      include: [{ 
        association: 'inscritos',
        attributes:  ['nombres', 'apellidos', 'codigoInstitucional']
      }]
    });
    if(!materias){
      throw boom.notFound('Materia no encontrado');
    }
    return materias;
  }

  async findByEstudiante(userId) {
    const materias = await sequelize.models.Materias.findAll({
      where: {
        '$inscritos.user.id$' :userId
      },
      include: [{
        association: 'inscritos',
        attributes: {
          exclude: ['fechaNacimiento', 'createdAt', 'userId'] 
        },
        include: [{ 
          model: sequelize.models.User, 
          as: 'user',
          attributes: ['id', 'email', 'role']
        }]
      }]
    });
    return materias;
  }

  async findByProfesor(userId) {
    const materias = await sequelize.models.Materias.findAll({
      where: {
        '$profesor.user.id$' :userId
      },
      include: [{
        association: 'profesor',
        include: [{ 
          model: sequelize.models.User, 
          as: 'user',
          attributes: ['id', 'email', 'role']
        }]
      }]
    });
    return materias;
  }

  async update(id, changes) {
    const materias = await this.findOne(id);
    const rta = await materias.update(changes);
    return rta;
  }

  async delete(id) {
    const materias = await this.findOne(id);
    await materias.destroy();
    return { id };
  }
}

export {MateriasService};
