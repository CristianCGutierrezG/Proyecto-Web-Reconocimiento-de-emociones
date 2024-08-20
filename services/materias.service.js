import boom from '@hapi/boom';
import { sequelize, Op } from '../libs/sequelize.js';

/**
 * Define las diferentes interaciones con la base de datos
 * para el API-REST,con la ayuda de sequileze en el modelo Materias
 * Obtiene los datos de la BD y los retorna
 */

class MateriasService {
  constructor() {}

  //Creacion de una materia en la BD con base al id de un profesor
  async create(data) {
    const existingMateria = await sequelize.models.Materias.findOne({
      where: {
        nombre: data.nombre,
        grupo: data.grupo,
      },
    });

    // Si ya existe una materia con los mismos datos, lanzar un error
    if (existingMateria) {
      throw new Error('Ya existe una materia con estos datos');
    }

    const newMateria = await sequelize.models.Materias.create(data);
    return newMateria;
  }

  //Creacion de una nueva materia en la BD
  //Relacionado con la info de su profesor asignado
  //Creado a traves del token de un profesor
  async createProfesor(data, userId) {
    // Buscar el profesor asociado al usuario
    const profesor = await sequelize.models.Profesor.findOne({
      where: { userId },
    });

    // Verificar si el profesor existe
    if (!profesor) {
      throw boom.notFound('Profesor no encontrado');
    }

    // Verificar si ya existe una materia con los mismos datos
    const existingMateria = await sequelize.models.Materias.findOne({
      where: {
        nombre: data.nombre,
        grupo: data.grupo,
      },
    });

    // Si ya existe una materia con los mismos datos, lanzar un error
    if (existingMateria) {
      throw new Error('Ya existe una materia con estos datos');
    }

    // Si el profesor existe y no existe una materia con los mismos datos, crear una nueva materia
    const newMateria = await sequelize.models.Materias.create({
      ...data,
      profesorId: profesor.id,
    });

    return newMateria;
  }

  //Añade la relacion entre un estudiante y una materia segun el id
  async addInscripcion(data) {
    const inscripcionExistente =
      await sequelize.models.EstudiantesMaterias.findOne({
        where: {
          materiaId: data.materiaId,
          estudianteId: data.estudianteId,
        },
      });

    // Si ya existe una inscripción para el estudiante y la materia, no se crea una nueva
    if (inscripcionExistente) {
      throw new Error(
        'Ya existe una inscripción para este estudiante y materia.',
      );
    }
    const newInscripcion =
      await sequelize.models.EstudiantesMaterias.create(data);
    return newInscripcion;
  }

  //Añade la relacion entre un estudiante y una materia segun el token
  async addInscripcionToken(data, userId) {
    const estudiante = await sequelize.models.Estudiante.findOne({
      where: { userId },
    });
    if (!estudiante) {
      throw boom.notFound('Estudiante no encontrado');
    }
    const inscripcionExistente =
      await sequelize.models.EstudiantesMaterias.findOne({
        where: {
          materiaId: data.materiaId,
          estudianteId: estudiante.dataValues.id,
        },
      });

    // Si ya existe una inscripción para el estudiante y la materia, no se crea una nueva
    if (inscripcionExistente) {
      throw new Error('Ya estas inscrito');
    }

    const newData = {
      ...data,
      estudianteId: estudiante.dataValues.id,
    };
    const newInscripcion =
      await sequelize.models.EstudiantesMaterias.create(newData);
    return newInscripcion;
  }

  //Encontrar todas las materias en la BD con el profesor y horarios asignados
  //con limit y offset para limitar la cantidad de datos
  async find(query) {
    const options = {
      include: [
        {
          association: 'profesor',
          attributes: {
            exclude: ['fechaNacimiento', 'createdAt', 'userId', 'id'],
          },
        },
        {
          association: 'horarios',
          attributes: ['dia', 'horaInicio', 'horaFin'],
        },
      ],
    };
    const { limit, offset } = query;
    if (limit && offset) {
      options.limit = limit;
      options.offset = offset;
    }
    const materias = await sequelize.models.Materias.findAll(options);
    return materias;
  }

  //Encontrar una materia que coincida con el id
  async findOne(id) {
    const materias = await sequelize.models.Materias.findByPk(id, {
      include: [
        {
          association: 'inscritos',
          attributes: ['nombres', 'apellidos', 'codigoInstitucional'],
        },
        {
          association: 'horarios',
          attributes: ['dia', 'horaInicio', 'horaFin'],
        },
      ],
    });
    if (!materias) {
      throw boom.notFound('Materia no encontrado');
    }
    return materias;
  }

  //Encontrar las materias inscritas por un estudiante
  async findByEstudiante(userId) {
    const materias = await sequelize.models.Materias.findAll({
      where: {
        '$inscritos.user.id$': userId,
      },
      include: [
        {
          association: 'inscritos',
          attributes: ['id'],
          include: [
            {
              model: sequelize.models.User,
              as: 'user',
              attributes: ['email'],
            },
          ],
        },
        {
          association: 'horarios',
          attributes: ['dia', 'horaInicio', 'horaFin'],
        },
        {
          association: 'profesor',
          attributes: {
            exclude: ['fechaNacimiento', 'createdAt', 'userId', 'activo']
            }
        },
      ],
    });
    return materias;
  }

  //Encontrar las materias dictadas por un profesor
  async findByProfesor(userId) {
    const materias = await sequelize.models.Materias.findAll({
      where: {
        '$profesor.user.id$': userId,
      },
      include: [
        {
          association: 'profesor',
          attributes: ['nombres', 'apellidos', 'codigoInstitucional'],
          include: [
            {
              model: sequelize.models.User,
              as: 'user',
              attributes: ['email', 'role'],
            },
          ],
        },
      ],
    });
    return materias;
  }

  async findByNameOrProfessor(value, query) {
    const values = value.split(' ');

    let searchConditions = [];
    if (values.length > 1) {
      searchConditions = values.map((v) => ({
        [Op.or]: [
          { nombre: { [Op.like]: `%${v}%` } },
          { '$profesor.nombres$': { [Op.like]: `%${v}%` } },
          { '$profesor.apellidos$': { [Op.like]: `%${v}%` } },
        ],
      }));
    } else {
      searchConditions = {
        [Op.or]: [
          { nombre: { [Op.like]: `%${value}%` } },
          { '$profesor.nombres$': { [Op.like]: `%${value}%` } },
          { '$profesor.apellidos$': { [Op.like]: `%${value}%` } },
        ],
      };
    }

    const options = {
      where: {
        [Op.or]: searchConditions,
      },
      include: [
        {
          model: sequelize.models.Profesor,
          as: 'profesor',
          attributes: ['id', 'nombres', 'apellidos'],
        },
        {
          association: 'horarios',
          attributes: ['dia', 'horaInicio', 'horaFin'],
        },
      ],
      subQuery: false,
    };

    const { limit, offset } = query;
    if (limit && offset) {
      options.limit = limit;
      options.offset = offset;
    }

    const materias = await sequelize.models.Materias.findAll(options);

    if (materias.length === 0) {
      throw boom.notFound('Materia no encontrada');
    }

    return materias;
  }



  //Actualizar la info de una materia
  async update(id, changes) {
    const materias = await this.findOne(id);
    const rta = await materias.update(changes);
    return rta;
  }

  //Eliminar un profesor
  async delete(id) {
    const materia = await this.findOne(id);

    // Eliminar a todos los estudiantes inscritos
    await sequelize.models.EstudiantesMaterias.destroy({
      where: {
        materiaId: id,
      },
    });

    await materia.destroy();
    return { id };
  }
}

export { MateriasService };
