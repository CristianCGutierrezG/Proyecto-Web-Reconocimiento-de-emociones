import boom from '@hapi/boom';
import { sequelize, Op } from '../libs/sequelize.js';

class EmocionService {
  constructor() {}

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

  // Encuentra las emociones de todos los estudiantes en un rango de fechas
  async find(query) {
    const { startDate, endDate, limit, offset } = query;
    const options = {
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
      options.where = {
        createdAt: {
          [Op.between]: [startDate, endDate],
        },
      };
    }

    // Paginación
    if (limit && offset) {
      options.limit = limit;
      options.offset = offset;
    }

    const emociones = await sequelize.models.Emocion.findAll(options);
    return emociones;
  }
}

export { EmocionService };
