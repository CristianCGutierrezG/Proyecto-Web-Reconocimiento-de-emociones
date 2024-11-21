import boom from '@hapi/boom';
import { sequelize, Op } from '../libs/sequelize.js';

/**
 * Define las diferentes interaciones con la base de datos
 * para el API-REST,con la ayuda de sequileze en el modelo Materias
 * Obtiene los datos de la BD y los retorna
 */

class MateriasService {
  constructor() { }

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

  // Creación de una nueva materia en la BD relacionada con la info de su profesor asignado
// Creado a través del token de un profesor
async createProfesor(data, userId) {
  const { nombre, grupo, horarios } = data;

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

  // Si ya existe una materia con los mismos datos
  if (existingMateria) {
    if (existingMateria.activo) {
      throw new Error('Ya existe una materia activa con estos datos.');
    } else {
      // Si la materia existe pero está inactiva, activarla y actualizar el profesor si es necesario
      existingMateria.activo = true;
      existingMateria.profesorId = profesor.id; // Actualizar el profesor asignado
      await existingMateria.save();

      // Crear o actualizar los horarios asociados si existen
      if (data.horarios && data.horarios.length > 0) {
        await sequelize.models.Horarios.destroy({
          where: { materiaId: existingMateria.id },
        });

        const horariosData = data.horarios.map(horario => ({
          ...horario,
          materiaId: existingMateria.id,
        }));

        await sequelize.models.Horarios.bulkCreate(horariosData);
      }

      return existingMateria;
    }
  }

  // Crear una nueva materia
  const newMateria = await sequelize.models.Materias.create({
    nombre,
    grupo,
    profesorId: profesor.id,
  });

  // Crear los horarios asociados si existen
  if (data.horarios && data.horarios.length > 0) {
    const horariosData = data.horarios.map(horario => ({
      ...horario,
      materiaId: newMateria.id,
    }));

    await sequelize.models.Horarios.bulkCreate(horariosData);
  }

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

    // Si ya existe una inscripción para el estudiante y la materia
    if (inscripcionExistente) {
      if (inscripcionExistente.activo) {
        throw new Error('Ya existe una inscripción activa para este estudiante y materia.');
      } else {
        // Si la inscripción existe pero está inactiva, la activamos
        inscripcionExistente.activo = true;
        await inscripcionExistente.save();
        return inscripcionExistente;
      }
    }

    // Si no existe inscripción previa, se crea una nueva
    const newInscripcion = await sequelize.models.EstudiantesMaterias.create(data);
    return newInscripcion;
  }

  // Actualiza el campo "activo" de EstudiantesMaterias a false según el id del estudiante y la materia
  async removeInscripcion(data) {
    const inscripcionExistente = await sequelize.models.EstudiantesMaterias.findOne({
      where: {
        materiaId: data.materiaId,
        estudianteId: data.estudianteId,
      },
    });

    if (!inscripcionExistente) {
      throw boom.notFound('Inscripción no encontrada');
    }

    if (!inscripcionExistente.activo) {
      throw new Error('La inscripción ya está inactiva');
    }

    // Actualiza el campo "activo" a false
    inscripcionExistente.activo = false;
    await inscripcionExistente.save();

    return inscripcionExistente;
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

    // Si ya existe una inscripción para el estudiante y la materia
    if (inscripcionExistente) {
      if (inscripcionExistente.activo) {
        throw new Error('Ya estás inscrito en esta materia.');
      } else {
        // Si la inscripción existe pero está inactiva, la activamos
        inscripcionExistente.activo = true;
        await inscripcionExistente.save();
        return inscripcionExistente;
      }
    }

    // Si no existe inscripción previa, se crea una nueva
    const newData = {
      ...data,
      estudianteId: estudiante.dataValues.id,
    };
    const newInscripcion =
      await sequelize.models.EstudiantesMaterias.create(newData);
    return newInscripcion;
  }

  // Actualiza el campo "activo" de EstudiantesMaterias a false según el token del usuario
  async removeInscripcionToken(materiaId, userId) {
    const estudiante = await sequelize.models.Estudiante.findOne({
      where: { userId },
    });
    if (!estudiante) {
      throw boom.notFound('Estudiante no encontrado');
    }

    const inscripcionExistente = await sequelize.models.EstudiantesMaterias.findOne({
      where: {
        materiaId,
        estudianteId: estudiante.dataValues.id,
      },
    });

    if (!inscripcionExistente) {
      throw boom.notFound('Inscripción no encontrada');
    }

    if (!inscripcionExistente.activo) {
      throw new Error('La inscripción ya está inactiva');
    }

    // Actualiza el campo "activo" a false
    inscripcionExistente.activo = false;
    await inscripcionExistente.save();

    return inscripcionExistente;
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
          through: {
            where: { activo: true },
          },
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
          through: {
            where: { activo: true }, 
          },
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
        activo: true,
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
    // Convertimos el valor de búsqueda a minúsculas para una búsqueda insensible a mayúsculas.
    const searchValue = value.toLowerCase();
  
    // Configuramos las condiciones de búsqueda utilizando ILIKE (para PostgreSQL).
    const searchConditions = {
      [Op.or]: [
        { nombre: { [Op.iLike]: `%${searchValue}%` } },
        { '$profesor.nombres$': { [Op.iLike]: `%${searchValue}%` } },
        { '$profesor.apellidos$': { [Op.iLike]: `%${searchValue}%` } },
      ],
    };
  
    // Configuración de opciones de búsqueda.
    const options = {
      where: {
        [Op.and]: [
          { activo: true },
          searchConditions,
        ],
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
      order: [['nombre', 'ASC']], // Ordenamos alfabéticamente por nombre
    };
  
    // Obtenemos el número total de resultados sin aplicar paginación.
    const totalResults = await sequelize.models.Materias.count(options);
  
    // Aplicamos la paginación si se proporciona.
    const { limit, offset } = query;
    if (limit && offset) {
      options.limit = limit;
      options.offset = offset;
    }
  
    // Realizamos la búsqueda con paginación.
    const materias = await sequelize.models.Materias.findAll(options);
  
    // Validamos si se encontraron resultados.
    if (materias.length === 0) {
      throw boom.notFound('Materia no encontrada');
    }
  
    // Incluimos la metadata con el conteo total de resultados.
    return {
      data: materias,
      metadata: {
        total: totalResults,
        count: materias.length,
        limit: limit || null,
        offset: offset || null,
      },
    };
  }
  

  async update(id, changes) {
    const materia = await this.findOne(id);
  
    // Verificar si hay cambios en nombre o grupo
    if (changes.nombre && changes.grupo) {
      const existingMateria = await sequelize.models.Materias.findOne({
        where: {
          nombre: changes.nombre,
          grupo: changes.grupo,
          id: { [Op.ne]: id }, 
        },
      });
  
      if (existingMateria) {
        throw new Error(`Ya existe una materia con el nombre "${changes.nombre}" y grupo "${changes.grupo}".`);
      }
    }
  
    const updatedMateria = await materia.update(changes);
  
    if (changes.horarios) {
      await sequelize.models.Horarios.destroy({ where: { materiaId: id } });
  
      const horariosData = changes.horarios.map((horario) => ({
        ...horario,
        materiaId: id,
      }));
      await sequelize.models.Horarios.bulkCreate(horariosData);
    }
  
    return updatedMateria;
  }

  // Cambia el campo "activo" de una materia a false y elimina los horarios relacionados
  async updateToInactive(id) {
    const materia = await this.findOne(id);

    if (!materia) {
      throw boom.notFound('Materia no encontrada');
    }

    if (!materia.activo) {
      throw new Error('La materia ya está inactiva');
    }

    // Actualiza el campo "activo" de la materia a false
    materia.activo = false;
    await materia.save();

    // Elimina los horarios relacionados con la materia
    await sequelize.models.Horarios.destroy({
      where: { materiaId: id },
    });

    // Opcional: Desactivar también todas las inscripciones asociadas
    await sequelize.models.EstudiantesMaterias.update(
      { activo: false },
      { where: { materiaId: id } }
    );

    return { id, activo: materia.activo };
  }


  //Eliminar una materia
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
