import boom from '@hapi/boom';
import { sequelize, Op } from '../libs/sequelize.js';
import { EstudiantesService } from '../services/estudiante.service.js'
import { MateriasService } from '../services/materias.service.js';

const serviceMateria = new MateriasService();
const serviceEstudiantes = new EstudiantesService();

class EmocionService {
  constructor() { }

  // Creación de una nueva emoción en la BD
  async create(data, userId) {
    const estudiante = await sequelize.models.Estudiante.findOne({
      where: { userId },
    });
    const newData = {
      ...data,
      estudianteId: estudiante.dataValues.id,
    };
    const newEmocion = await sequelize.models.Emocion.create(newData);
    return newEmocion;
  }

  // Encuentra las emociones relacionadas con el token de un estudiante en un rango de fechas
  async findByUser(userId, query) {
    const { startDate, endDate, limit, offset } = query;
    const options = {
      where: {
        '$estudiante.user.id$': userId,
      },
      include: [
        {
          association: 'estudiante',
          attributes: ['id'],
          include: [
            {
              model: sequelize.models.User,
              as: 'user',
              attributes: ['id'],
            },
          ],
        },
      ],
    };

    // Filtro por rango de fechas
    if (startDate && endDate) {
      options.where.createdAt = {
        [Op.between]: [startDate, endDate],
      };
    }

    // Paginación
    if (limit && offset) {
      options.limit = limit;
      options.offset = offset;
    }

    const emocion = await sequelize.models.Emocion.findAll(options);
    return emocion;
  }

  // Encontrar las emociones asignadas a todos los estudiantes en una materia por el id, filtradas por un rango de fechas
  async findEmocionesByMateria(id, startDate, endDate) {
    // Encontrar la materia con los estudiantes inscritos
    const materia = await serviceMateria.findOne(id);

    // Obtener todos los IDs de los estudiantes inscritos
    const estudianteIds = materia.inscritos.map(estudiante => estudiante.EstudiantesMaterias.estudianteId);

    if (estudianteIds.length === 0) {
      return [];
    }

    // Buscar las emociones de los estudiantes en el rango de fechas
    const emociones = await sequelize.models.Estudiante.findAll({
      where: {
        id: {
          [Op.in]: estudianteIds,
        },
      },
      include: [
        {
          model: sequelize.models.Emocion,
          as: 'emociones',
          attributes: ['id', 'emocion', 'createdAt'],
          where: {
            createdAt: {
              [Op.between]: [new Date(startDate), new Date(endDate)],
            },
          },
        },
      ],
    });

    return emociones;
  }

  async findEmocionesByFecha(startDate, endDate) {
    
    const emociones = await sequelize.models.Estudiante.findAll({
      include: [
        {
          model: sequelize.models.Emocion,
          as: 'emociones',
          attributes: ['id', 'emocion', 'createdAt'],
          where: {
            createdAt: {
              [Op.between]: [new Date(startDate), new Date(endDate)],
            },
          },
        },
      ],
    });
  
    return emociones;
  }
}

export { EmocionService };
