import  boom  from '@hapi/boom';
import  { sequelize }  from '../libs/sequelize.js';

/**
 * Define las diferentes interaciones con la base de datos
 * para el API-REST,con la ayuda de sequileze en el modelo Horarios
 * Obtiene los datos de la BD y los retorna
*/

class HorariosService {
  constructor() {}

   //Creacion de una materia en la BD con base al id de un horario
  async create(data) {
    const newHorario = await sequelize.models.Horarios.create(data, {
      include: [ 'materia' ]
    }); 
    return newHorario;
  }

  //Encontrar un horario que coincida con el id
  async findOne(id) {
    const horario = await sequelize.models.Horarios.findByPk(id);
    if(!horario){
      throw boom.notFound('Horario no encontrado');
    }
    return horario;
  }

  //Actualizar la info de un horario
  async update(id, changes) {
    const horaio = await this.findOne(id);
    const rta = await horaio.update(changes);
    return rta;
  }

  //Eliminar un horario
  async delete(id) {
    const horario = await this.findOne(id);
    await horario.destroy();
    return { id };
  }
}

export {HorariosService};
