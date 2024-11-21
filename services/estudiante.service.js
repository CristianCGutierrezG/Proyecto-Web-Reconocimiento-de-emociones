import boom from '@hapi/boom';

import { sequelize, Op } from '../libs/sequelize.js';

/**
 * Define las diferentes interaciones con la base de datos
 * para el API-REST,con la ayuda de sequileze en el modelo Estudiante
 * Obtiene los datos de la BD y los retorna
 */

class EstudiantesService {
  constructor() { }

  //Creacion de un nuevo estudiante en la BD
  //Relacionado con la info de su usuario asignado
  async create(data, email, codigo) {
    // Verificar la unicidad del correo electrónico y el código institucional
    const [existingUser, existingEstudiante] = await Promise.all([
      sequelize.models.User.findOne({
        where: { email: email },
      }),
      sequelize.models.Estudiante.findOne({
        where: { codigoInstitucional: codigo },
      }),
    ]);

    if (existingUser) {
      throw new Error('El correo electrónico ya está en uso');
    }

    if (existingEstudiante) {
      throw new Error('El código institucional ya está en uso');
    }

    // Crear el usuario y el estudiante
    const newEstudiante = await sequelize.models.Estudiante.create(data, {
      include: ['user'],
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
          attributes: ['id', 'email', 'role'],
        },
      ],
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
          attributes: ['id', 'email', 'role'],
        },
      ],
    });
    if (!estudiante) {
      throw boom.notFound('Estudiante no encontrado');
    }
    return estudiante;
  }

  //Encontrar la info asignadas a un estudiante segun su token
  async findByUser(userId) {
    const estudiante = await sequelize.models.Estudiante.findOne({
      where: {
        userId: userId,
      },
      include: [
        {
          model: sequelize.models.User,
          as: 'user',
          attributes: ['id', 'email', 'role'],
        },
      ],
    });
    return estudiante;
  }

  // Encontrar las emociones asignadas a un estudiante según su id, filtradas por un rango de fechas
  async findOneByEmociones(id, startDate, endDate) {
    const options = {
      include: [
        {
          model: sequelize.models.Emocion,
          as: 'emociones',
          attributes: ['id', 'emocion', 'createdAt'],
        },
      ],
    };

    // Agregar filtro de rango de fechas
    if (startDate && endDate) {
      options.include[0].where = {
        createdAt: {
          [Op.between]: [new Date(startDate), new Date(endDate)],
        },
      };
    }

    const estudiante = await sequelize.models.Estudiante.findByPk(id, options);

    if (!estudiante) {
      throw boom.notFound('Estudiante no encontrado');
    }

    return estudiante;
  }

  //Encontrar las materias asignadas a un estudiante sgun su id
  async findOneByMaterias(id) {
    const estudiante = await sequelize.models.Estudiante.findByPk(id, {
      include: [
        {
          model: sequelize.models.Materias,
          as: 'inscritos',
          through: {
            where: { activo: true },
          },
          attributes: ['id', 'nombre', 'grupo'],
          include: [
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
        },
      ],
    });

    if (!estudiante) {
      throw boom.notFound('Estudiante no encontrado');
    }

    return estudiante;
  }

  //Encontrar un estudiante segun su nombre o codigo estudiantil
  async findByNameOrCode(value, query) {
    // Convertimos el valor de búsqueda a minúsculas para hacer la búsqueda insensible a mayúsculas.
    const searchValue = value.toLowerCase();
  
    // Configuramos las condiciones de búsqueda utilizando ILIKE (para PostgreSQL).
    let searchConditions;
  
    // Si el valor contiene un espacio, asumimos que es "nombre apellido"
    if (searchValue.includes(' ')) {
      const [firstName, lastName] = searchValue.split(' ');
      searchConditions = {
        [Op.and]: [
          { nombres: { [Op.iLike]: `%${firstName}%` } },
          { apellidos: { [Op.iLike]: `%${lastName}%` } },
        ],
      };
    } else {
      // Búsqueda por nombre, apellido o código
      searchConditions = {
        [Op.or]: [
          { nombres: { [Op.iLike]: `%${searchValue}%` } },
          { apellidos: { [Op.iLike]: `%${searchValue}%` } },
          { codigoInstitucional: { [Op.iLike]: `%${searchValue}%` } },
        ],
      };
    }
  
    // Configuración de opciones para la búsqueda, incluyendo el ordenamiento
    const options = {
      where: searchConditions,
      include: [
        {
          model: sequelize.models.User,
          as: 'user',
          attributes: ['id', 'email', 'role'],
        },
      ],
      order: [['nombres', 'ASC'], ['apellidos', 'ASC']], // Ordenar alfabéticamente por nombre y apellido
    };
  
    // Obtenemos el número total de resultados antes de la paginación
    const totalResults = await sequelize.models.Estudiante.count(options);
  
    // Aplicamos la paginación si se proporciona
    const { limit, offset } = query;
    if (limit && offset) {
      options.limit = parseInt(limit, 10);
      options.offset = parseInt(offset, 10);
    }
  
    // Realizamos la búsqueda con paginación
    const estudiantes = await sequelize.models.Estudiante.findAll(options);
  
    // Validamos si se encontraron resultados
    if (estudiantes.length === 0) {
      throw boom.notFound('Estudiante no encontrado');
    }
  
    // Incluimos la metadata con el conteo total de resultados
    return {
      data: estudiantes,
      metadata: {
        total: totalResults,
        count: estudiantes.length,
        limit: limit ? parseInt(limit, 10) : null,
        offset: offset ? parseInt(offset, 10) : null,
      },
    };
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
    const user = await sequelize.models.User.findByPk(
      estudiante.user.dataValues.id,
    );
    await estudiante.destroy();
    await user.destroy();
    return { rta: true };
  }
}

export { EstudiantesService };
