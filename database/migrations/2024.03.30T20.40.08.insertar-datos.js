import {sequelize} from '../../libs/sequelize.js';
import { faker } from '@faker-js/faker'

const roles = ['Estudiante', 'Profesor', 'Profesional de salud'];
let userIdCounter = 1;


const users = [...Array(100)].map((user) => {
    const randomIndex = Math.floor(Math.random() * roles.length); 
    return {
      id:  userIdCounter++,
      email: faker.internet.email(),
      password: 'qwerty123',
      role: roles[randomIndex],
      created_at: new Date()
    }
})

userIdCounter = 1;
let userIdActual = 1;
const estudiantes = [...Array(80)].map((estudiantes) => {
    return {
        id: userIdCounter++,
        nombres: faker.person.firstName(),
        apellidos: faker.person.lastName(),
        fecha_nacimiento: faker.date.between({from: '1980-01-01', to: '2005-12-31'}).toLocaleDateString(),
        codigo_institucional: faker.number.int({min: 10000000, max: 99999999}),
        created_at: new Date(),
        user_id: userIdActual++
    }
})

userIdCounter = 1;
userIdActual = 81;
const profesores = [...Array(20)].map((profesores) => {
    return {
        id: userIdCounter++,
        nombres: faker.person.firstName(),
        apellidos: faker.person.lastName(),
        fecha_nacimiento: faker.date.between({from: '1980-01-01', to: '2005-12-31'}).toLocaleDateString(),
        codigo_institucional: faker.number.int({min: 10000000, max: 99999999}),
        created_at: new Date(),
        user_id: userIdActual++
    }
})

/** @type {import('umzug').MigrationFn<any>} */
export const up = async () => {
    // await sequelize.getQueryInterface().bulkInsert('users', users, {});
    // await sequelize.getQueryInterface().bulkInsert('estudiantes', estudiantes, {});
    // await sequelize.getQueryInterface().bulkInsert('profesores', profesores, {});
};

/** @type {import('umzug').MigrationFn<any>} */
export const down = async () => {
    // await sequelize.getQueryInterface().bulkDelete('estudiantes', null, {});
    // await sequelize.getQueryInterface().bulkDelete('profesores', null, {});
    // await sequelize.getQueryInterface().bulkDelete('users', null, {});
    
    
};


