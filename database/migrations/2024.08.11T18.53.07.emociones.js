import { sequelize } from '../../libs/sequelize.js';
import { faker } from '@faker-js/faker';

const studentId = 2; // ID del estudiante para el que se guardarán las emociones
const validEmociones = ['Enojado', 'Disgustado', 'Miedoso', 'Feliz', "Triste", "Sorprendido", "Neutral"];

// Función para generar una emoción aleatoria
function generateEmocion() {
    const emocionAleatoria = validEmociones[Math.floor(Math.random() * validEmociones.length)];
    return {
        emocion: emocionAleatoria,
        created_at: new Date(),
        estudiante_id: studentId
    };
}

// Función para generar una fecha en el formato deseado
function generateDateForYear(year) {
    const month = faker.date.between({ from: `${year}-01-01`, to: `${year}-12-31` });
    const day = faker.date.between({ from: `${year}-01-01`, to: `${year}-12-31` });
    return day;
}

// Generar emociones para todo el año 2024
const emociones = [];
const year = 2024;
const daysInYear = 365;

for (let i = 0; i < daysInYear; i++) {
    const date = generateDateForYear(year);
    emociones.push({
        ...generateEmocion(),
        created_at: date
    });
}

/** @type {import('umzug').MigrationFn<any>} */
export const up = async () => {
    await sequelize.getQueryInterface().bulkInsert('emociones', emociones, {});
};

/** @type {import('umzug').MigrationFn<any>} */
export const down = async () => {
    await sequelize.getQueryInterface().bulkDelete('emociones', {
        estudiante_id: studentId
    }, {});
};
