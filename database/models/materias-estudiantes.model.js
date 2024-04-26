import { Model, DataTypes} from 'sequelize';
import { ESTUDIANTE_TABLE } from './estudiante.model.js';
import { MATERIAS_TABLE } from './materias.model.js';

/**
 * Se crea el schema de la tabla de union estudiantes_materias
 * sus relaciones con otras tablas
 * la configuracion de sequelize
*/

const ESTUDIANTES_MATERIAS_TABLE = 'estudiantes_materias';

const EstudiantesMateriasSchema = {
  id: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: DataTypes.INTEGER
  },
  materiaId: {
    field: 'materia_id',
    allowNull: false,
    type: DataTypes.INTEGER,
    refereces: {
      model: MATERIAS_TABLE,
      key: 'id'
    },
    onUpdate: 'CASCADE',
    onDelete: 'SET NULL'
  },
  estudianteId: {
    field: 'estudiante_id',
    allowNull: false,
    type: DataTypes.INTEGER,
    refereces: {
      model: ESTUDIANTE_TABLE,
      key: 'id'
    },
    onUpdate: 'CASCADE',
    onDelete: 'SET NULL'
  },
  createdAt: {
    allowNull: false,
    type: DataTypes.DATE,
    field: 'created_at',
    defaultValue: DataTypes.NOW
  },
}

class EstudiantesMaterias extends Model {
  static associate(models) {
  }

  static config(sequelize) {
    return {
      sequelize,
      tableName: ESTUDIANTES_MATERIAS_TABLE,
      modelName: 'EstudiantesMaterias',
      timestamps: false
    }
  }
}


export { ESTUDIANTES_MATERIAS_TABLE,  EstudiantesMateriasSchema , EstudiantesMaterias }