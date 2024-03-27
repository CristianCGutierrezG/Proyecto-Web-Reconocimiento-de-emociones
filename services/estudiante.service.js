// const { faker } = require('@faker-js/faker');
import boom from '@hapi/boom';

import { sequelize } from '../libs/sequelize.js';

class EstudiantesService {

  constructor() {}

  // generate() {
  //   const limit = 100;
  //   for (let index = 0; index < limit; index++) {
  //     this.products.push({
  //       id: faker.datatype.uuid(),
  //       name: faker.commerce.productName(),
  //       price: parseInt(faker.commerce.price(), 10),
  //       image: faker.image.imageUrl(),
  //       isBlock: faker.datatype.boolean(),
  //     });
  //   }
  // }

  // async create(data) {
  //   const newProduct = {
  //     id: faker.datatype.uuid(),
  //     ...data
  //   }
  //   this.products.push(newProduct);
  //   return newProduct;
  // }

  async create(data) {
    const newEstudiante = await sequelize.models.Estudiante.create(data, {
      include: ['user']
    }); 
    return newEstudiante;
  }

  async find() {
    const rta = await sequelize.models.Estudiante.findAll({
      include: ['user']
    });
    return rta; 
  }

  async findOne(id) {
    const estudiante = await sequelize.models.Estudiante.findByPk(id);
    if(!estudiante){
      throw boom.notFound('Estudiante no encontrado');
    }
    return estudiante;
  }

  async update(id, changes) {
    const estudiante = await this.findOne(id);
    const rta = await estudiante.update(changes);
    return rta;
  }

  async delete(id) {
    const estudiante = await this.findOne(id);
    await estudiante.destroy();
    return { rta:  true };
  }

  

}

export { EstudiantesService };
