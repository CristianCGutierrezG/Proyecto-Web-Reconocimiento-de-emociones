import  boom  from '@hapi/boom';
import  { sequelize }  from '../libs/sequelize.js';

class HorariosService {
  constructor() {}

  async create(data) {
    const newHorario = await sequelize.models.Horarios.create(data, {
      include: [ 'materia' ]
    }); 
    return newHorario;
  }

  async findOne(id) {
    const horario = await sequelize.models.Horarios.findByPk(id);
    if(!horario){
      throw boom.notFound('Horario no encontrado');
    }
    return horario;
  }

  async update(id, changes) {
    const horaio = await this.findOne(id);
    const rta = await horaio.update(changes);
    return rta;
  }

  async delete(id) {
    const horario = await this.findOne(id);
    await horario.destroy();
    return { id };
  }
}

export {HorariosService};
