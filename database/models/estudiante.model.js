import { Model, DataTypes} from 'sequelize';
import { USER_TABLE } from './user.model.js';

/**
 * Se crea el schema de la tabla estudiantes
 * sus relaciones con otras tablas
 * la configuracion de sequelize
 */

const ESTUDIANTE_TABLE = 'estudiantes';

const EstudianteSchema = {
  id: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: DataTypes.INTEGER
  },
  nombres: {
    allowNull: false,
    type: DataTypes.STRING,
  },
  apellidos: {
    allowNull: false,
    type: DataTypes.STRING,
  },
  fechaNacimiento: {
    allowNull: false,
    type: DataTypes.DATEONLY,
    field: 'fecha_nacimiento',
  },
  codigoInstitucional: {
    allowNull: false,
    type: DataTypes.INTEGER,
    unique: true,
    field: 'codigo_institucional',
  },
  activo: {
    allowNull: false,
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  createdAt: {
    allowNull: false,
    type: DataTypes.DATE,
    field: 'created_at',
    defaultValue: DataTypes.NOW
  },
  userId: {
    field: 'user_id',
    allowNull: false,
    type: DataTypes.INTEGER,
    unique: true,
    refereces: {
      model: USER_TABLE,
      key: 'id'
    },
    onUpdate: 'CASCADE',
    onDelete: 'SET NULL'
  }
}

class Estudiante extends Model {
  static associate(models) {
    //Uno a Uno con user
    this.belongsTo(models.User, {as: 'user'});

    //Uno a Muchos con emociones
    this.hasMany(models.Emocion, {
      as: 'emociones',
      foreignKey: 'estudianteId'
    });

    //Muchos a Muchos con materias
    this.belongsToMany(models.Materias, {
      as: 'inscritos',
      through: models.EstudiantesMaterias,
      foreignKey: 'estudianteId',
      otherKey: 'materiaId'
    });
  }

  static config(sequelize) {
    return {
      sequelize,
      tableName: ESTUDIANTE_TABLE,
      modelName: 'Estudiante',
      timestamps: false
    }
  }
}


export { ESTUDIANTE_TABLE, EstudianteSchema, Estudiante }