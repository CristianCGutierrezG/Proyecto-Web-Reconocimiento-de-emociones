import { USER_TABLE, UserSchema } from '../models/user.model.js';
import { ESTUDIANTE_TABLE, EstudianteSchema} from '../models/estudiante.model.js';
import { PROFESOR_TABLE , ProfesorSchema} from '../models/profesor.model.js';
import { EMOCION_TABLE, EmocionSchema } from '../models/emocion.model.js';
import { MATERIAS_TABLE, MateriasSchema } from '../models/materias.model.js';
import { ESTUDIANTES_MATERIAS_TABLE, EstudiantesMateriasSchema } from '../models/materias-estudiantes.model.js';
import { sequelize } from '../../libs/sequelize.js';

export const up = async () => {
    await sequelize.getQueryInterface().createTable(USER_TABLE, UserSchema);
    await sequelize.getQueryInterface().createTable(ESTUDIANTE_TABLE, EstudianteSchema);
    await sequelize.getQueryInterface().createTable(PROFESOR_TABLE , ProfesorSchema);
    await sequelize.getQueryInterface().createTable(EMOCION_TABLE , EmocionSchema);
    await sequelize.getQueryInterface().createTable(MATERIAS_TABLE , MateriasSchema);
    await sequelize.getQueryInterface().createTable(ESTUDIANTES_MATERIAS_TABLE , EstudiantesMateriasSchema);
};
// /** @type {import('umzug').MigrationFn<any>} */
// export const up = async () => {
//     await sequelize.getQueryInterface().createTable(USER_TABLE, {
//         id: {
//             allowNull: false,
//             autoIncrement: true,
//             primaryKey: true,
//             type: DataTypes.INTEGER
//         },
//         email: {
//           allowNull: false,
//           type: DataTypes.STRING,
//           unique: true,
//           validate: {
//               isEmail: true,
//               len: [1, 255]
//           }
//         },
//         password: {
//           allowNull: false,
//           type: DataTypes.STRING
//         },
//         role: {
//           allowNull: false,
//           type: DataTypes.STRING,
//           defaultValue: "Estudiante",
//         }, 
//         createdAt: {
//           allowNull: false,
//           type: DataTypes.DATE,
//           field: 'created_at',
//           defaultValue: DataTypes.NOW
//         }
//     });
//     await sequelize.getQueryInterface().createTable(ESTUDIANTE_TABLE, {
//         id: {
//           allowNull: false,
//           autoIncrement: true,
//           primaryKey: true,
//           type: DataTypes.INTEGER
//         },
//         nombres: {
//           allowNull: false,
//           type: DataTypes.STRING,
//         },
//         apellidos: {
//           allowNull: false,
//           type: DataTypes.STRING,
//         },
//         fechaNacimiento: {
//           allowNull: false,
//           type: DataTypes.DATEONLY,
//           field: 'fecha_nacimiento',
//         },
//         codigoInstitucional: {
//           allowNull: false,
//           type: DataTypes.INTEGER,
//           unique: true,
//           field: 'codigo_institucional',
//         },
//         createdAt: {
//           allowNull: false,
//           type: DataTypes.DATE,
//           field: 'created_at',
//           defaultValue: DataTypes.NOW
//         },
//         userId: {
//           field: 'user_id',
//           allowNull: false,
//           type: DataTypes.INTEGER,
//           unique: true,
//           refereces: {
//             model: USER_TABLE,
//             key: 'id'
//           },
//           onUpdate: 'CASCADE',
//           onDelete: 'SET NULL'
//         }
//     });
//     await sequelize.getQueryInterface().createTable(PROFESOR_TABLE, {
//         id: {
//           allowNull: false,
//           autoIncrement: true,
//           primaryKey: true,
//           type: DataTypes.INTEGER
//         },
//         nombres: {
//           allowNull: false,
//           type: DataTypes.STRING,
//         },
//         apellidos: {
//           allowNull: false,
//           type: DataTypes.STRING,
//         },
//         fechaNacimiento: {
//           allowNull: false,
//           type: DataTypes.DATEONLY,
//           field: 'fecha_nacimiento',
//         },
//         codigoInstitucional: {
//           allowNull: false,
//           type: DataTypes.INTEGER,
//           unique: true,
//           field: 'codigo_institucional',
//         },
//         createdAt: {
//           allowNull: false,
//           type: DataTypes.DATE,
//           field: 'created_at',
//           defaultValue: DataTypes.NOW
//         },
//         userId: {
//           field: 'user_id',
//           allowNull: false,
//           type: DataTypes.INTEGER,
//           unique: true,
//           refereces: {
//             model: USER_TABLE,
//             key: 'id'
//           },
//           onUpdate: 'CASCADE',
//           onDelete: 'SET NULL'
//         }
//     });
//     await sequelize.getQueryInterface().createTable(PROSALUD_TABLE, {
//         id: {
//           allowNull: false,
//           autoIncrement: true,
//           primaryKey: true,
//           type: DataTypes.INTEGER
//         },
//         nombres: {
//           allowNull: false,
//           type: DataTypes.STRING,
//         },
//         apellidos: {
//           allowNull: false,
//           type: DataTypes.STRING,
//         },
//         fechaNacimiento: {
//           allowNull: false,
//           type: DataTypes.DATEONLY,
//           field: 'fecha_nacimiento',
//         },
//         codigoInstitucional: {
//           allowNull: false,
//           type: DataTypes.INTEGER,
//           unique: true,
//           field: 'codigo_institucional',
//         },
//         createdAt: {
//           allowNull: false,
//           type: DataTypes.DATE,
//           field: 'created_at',
//           defaultValue: DataTypes.NOW
//         },
//         userId: {
//           field: 'user_id',
//           allowNull: false,
//           type: DataTypes.INTEGER,
//           unique: true,
//           refereces: {
//             model: USER_TABLE,
//             key: 'id'
//           },
//           onUpdate: 'CASCADE',
//           onDelete: 'SET NULL'
//         }
//     });
//     await sequelize.getQueryInterface().createTable(EMOCION_TABLE, {
//         id: {
//           allowNull: false,
//           autoIncrement: true,
//           primaryKey: true,
//           type: DataTypes.INTEGER
//         },
//         emocion: {
//           allowNull: false,
//           type: DataTypes.STRING,
//         },
//         createdAt: {
//           allowNull: false,
//           type: DataTypes.DATE,
//           field: 'created_at',
//           defaultValue: DataTypes.NOW
//         },
//         estudianteId: {
//           field: 'estudiante_id',
//           allowNull: false,
//           type: DataTypes.INTEGER,
//           refereces: {
//             model: ESTUDIANTE_TABLE,
//             key: 'id'
//           },
//           onUpdate: 'CASCADE',
//           onDelete: 'SET NULL'
//         }
//     });
//     await sequelize.getQueryInterface().createTable(MATERIAS_TABLE, {
//         id: {
//           allowNull: false,
//           autoIncrement: true,
//           primaryKey: true,
//           type: DataTypes.INTEGER
//         },
//         nombre: {
//           allowNull: false,
//           type: DataTypes.STRING,
//         },
//         grupo: {
//           allowNull: false,
//           type: DataTypes.STRING,
//         },
//         createdAt: {
//           allowNull: false,
//           type: DataTypes.DATE,
//           field: 'created_at',
//           defaultValue: DataTypes.NOW
//         },
//         profesorId:{
//           field: 'profesor_id',
//           allowNull: false,
//           type: DataTypes.INTEGER,
//           refereces: {
//             model: PROFESOR_TABLE,
//             key: 'id'
//           },
//           onUpdate: 'CASCADE',
//           onDelete: 'SET NULL'
//         }
//     });
//     await sequelize.getQueryInterface().createTable(ESTUDIANTES_MATERIAS_TABLE, {
//         id: {
//           allowNull: false,
//           autoIncrement: true,
//           primaryKey: true,
//           type: DataTypes.INTEGER
//         },
//         materiaId: {
//           field: 'materia_id',
//           allowNull: false,
//           type: DataTypes.INTEGER,
//           refereces: {
//             model: MATERIAS_TABLE,
//             key: 'id'
//           },
//           onUpdate: 'CASCADE',
//           onDelete: 'SET NULL'
//         },
//         estudianteId: {
//           field: 'estudiante_id',
//           allowNull: false,
//           type: DataTypes.INTEGER,
//           refereces: {
//             model: ESTUDIANTE_TABLE,
//             key: 'id'
//           },
//           onUpdate: 'CASCADE',
//           onDelete: 'SET NULL'
//         },
//         createdAt: {
//           allowNull: false,
//           type: DataTypes.DATE,
//           field: 'created_at',
//           defaultValue: DataTypes.NOW
//         },
//     });
// };

/** @type {import('umzug').MigrationFn<any>} */
export const down = async () => {
    await sequelize.getQueryInterface().dropTable(ESTUDIANTES_MATERIAS_TABLE);
    await sequelize.getQueryInterface().dropTable(MATERIAS_TABLE);
    await sequelize.getQueryInterface().dropTable(EMOCION_TABLE);
    await sequelize.getQueryInterface().dropTable(PROFESOR_TABLE);
    await sequelize.getQueryInterface().dropTable(ESTUDIANTE_TABLE);
    await sequelize.getQueryInterface().dropTable(USER_TABLE);
};
