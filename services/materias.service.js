import  boom  from '@hapi/boom';
import  { sequelize }  from '../libs/sequelize.js';

class MateriasService {
  constructor() {}

  async create(data) {
    const newMaterias = await sequelize.models.Materias.create(data, {
      include: ['profesor']
    }); 
    return newMaterias;
  }

  async addInscripcion(data) {
    const newInscripcion = await sequelize.models.EstudiantesMaterias.create(data); 
    return newInscripcion;
  }

  async find() {
    const rta = await sequelize.models.Materias.findAll({
      include: ['profesor']
    });
    return rta;
  }

  async findOne(id) {
    const materias = await sequelize.models.Materias.findByPk(id, {
      include: ['inscritos']
    });
    if(!materias){
      throw boom.notFound('Materia no encontrado');
    }
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
