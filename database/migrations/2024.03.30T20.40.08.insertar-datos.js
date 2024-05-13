import {sequelize} from '../../libs/sequelize.js';
import { faker } from '@faker-js/faker';
import bcrypt from 'bcrypt';

let userIdCounter = 1;
const password = await bcrypt.hash('qwerty123', 10);
function generateUser(role) {
    return {
        email: faker.internet.email(),
        //Colocor el hash en la contraseña
        password: password,
        role: role,
        created_at: new Date(),
        activo: true
    };
}

function generatePersona(role) {
    return {
        nombres: faker.person.firstName(),
        apellidos: faker.person.lastName(),
        fecha_nacimiento: faker.date.between({from: '1980-01-01', to: '2005-12-31'}).toLocaleDateString(),
        codigo_institucional: faker.number.int({min: 10000000, max: 99999999}),
        created_at: new Date(),
        activo: true,
        user_id: userIdCounter++
    };
}

const validEmociones = ['Feliz', 'Triste', 'Furioso', 'Enojado'];

function generateEmociones() {
    // const emocionAleatoria = validEmociones[Math.floor(Math.random() * validEmociones.length)]; // Selecciona una emoción aleatoria
    return {
        emocion: faker.string.fromCharacters(['Feliz', 'Triste', 'Furioso', 'Enojado']),
        created_at: new Date(),
        estudiante_id: faker.number.int({ min: 1, max: 80 })
    };
}

function generateMateria() {
    const numeroGrupo = faker.number.int({ min: 100, max: 999 }); 
    const letraGrupo = faker.string.fromCharacters(['A', 'B', 'C', 'D'])
    return {
        nombre: faker.lorem.words(),
        grupo: `${numeroGrupo}-${letraGrupo}`,
        profesor_id: faker.number.int({ min: 1, max: 20}),
        activo: true,
        created_at: new Date()
    };
}

function generateHorario(){
    return{
        dia: faker.string.fromCharacters(['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes']),
        hora_inicio: faker.date.between({from: '2024-01-01T08:00:00', to: '2024-01-01T18:00:00'}).toLocaleTimeString(),
        hora_fin: faker.date.between({from: '2024-01-01T10:00:00', to: '2024-01-01T22:00:00'}).toLocaleTimeString(),
        created_at: new Date(),
        activo: true,
        materia_id: faker.number.int({ min: 1, max: 30})
    }
}

function inscribirAlumno(){
    return{
        materia_id: faker.number.int({ min: 1, max: 30}),
        estudiante_id: faker.number.int({ min: 1, max: 80}),
        activo: true,
        created_at: new Date()
    }
}

const users = [];
const estudiantes = [];
const profesores = [];
const proSalud = [];
const emociones = [];
const materias = [];
const horarios= [];
const materiasEstudiantes = [];

// Generar 80 estudiantes
for (let i = 0; i < 80; i++) {
    const user = generateUser('Estudiante');
    users.push(user);
    estudiantes.push(generatePersona());
}

// Generar 20 profesores
for (let i = 0; i < 20; i++) {
    const user = generateUser('Profesor');
    users.push(user);
    profesores.push(generatePersona());
}

// Generar 10 profesionales de salud
for (let i = 0; i < 10; i++) {
    const user = generateUser('Profesional de salud');
    users.push(user);
    proSalud.push(generatePersona());
}

//Genera 500 emociones
for (let i=0; i < 500; i++){
    emociones.push(generateEmociones());
}

//Genera 30 materias
for (let i=0; i < 30; i++){
    materias.push(generateMateria());
}

//Genera 50 horarios
for (let i=0; i < 30; i++){
    horarios.push(generateHorario());
}

//Inscibe 160 veces
for (let i=0; i < 160; i++){
    materiasEstudiantes.push(inscribirAlumno());
}


/** @type {import('umzug').MigrationFn<any>} */
export const up = async () => {
    await sequelize.getQueryInterface().bulkInsert('users', users, {});
    await sequelize.getQueryInterface().bulkInsert('estudiantes', estudiantes, {});
    await sequelize.getQueryInterface().bulkInsert('profesores', profesores, {});
    await sequelize.getQueryInterface().bulkInsert('profesional_salud', proSalud, {});
    await sequelize.getQueryInterface().bulkInsert('emociones', emociones, {});
    await sequelize.getQueryInterface().bulkInsert('materias', materias, {});
    await sequelize.getQueryInterface().bulkInsert('horarios', horarios, {});
    await sequelize.getQueryInterface().bulkInsert('estudiantes_materias', materiasEstudiantes, {});
};

/** @type {import('umzug').MigrationFn<any>} */
export const down = async () => {
    // await sequelize.getQueryInterface().bulkDelete('users', null, {});
    // await sequelize.getQueryInterface().bulkDelete('profesional_salud', null, {});
    // await sequelize.getQueryInterface().bulkDelete('estudiantes', null, {});
    // await sequelize.getQueryInterface().bulkDelete('profesores', null, {});
};


