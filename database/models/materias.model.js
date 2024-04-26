import { Model, DataTypes} from 'sequelize';
import { PROFESOR_TABLE } from './profesor.model.js';

/**
 * Se crea el schema de la tabla materias
 * sus relaciones con otras tablas
 * la configuracion de sequelize
*/

const MATERIAS_TABLE = 'materias';

const MateriasSchema = {
  id: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: DataTypes.INTEGER
  },
  nombre: {
    allowNull: false,
    type: DataTypes.STRING,
  },
  grupo: {
    allowNull: false,
    type: DataTypes.STRING,
  },
  createdAt: {
    allowNull: false,
    type: DataTypes.DATE,
    field: 'created_at',
    defaultValue: DataTypes.NOW
  },
  profesorId:{
    field: 'profesor_id',
    allowNull: false,
    type: DataTypes.INTEGER,
    refereces: {
      model: PROFESOR_TABLE,
      key: 'id'
    },
    onUpdate: 'CASCADE',
    onDelete: 'SET NULL'
  }
}

class Materias extends Model {
  static associate(models) {

  //Uno a Muchos con horarios
    this.hasMany(models.Horarios, {
      as: 'horarios',
      foreignKey: 'materiaId'
    });

    //Uno a Muchos con profesores
    this.belongsTo(models.Profesor, {as: 'profesor'});

    //Muchos a Muchos con estudiantes
    this.belongsToMany(models.Estudiante, {
      as: 'inscritos',
      through: models.EstudiantesMaterias,
      foreignKey: 'materiaId',
      otherKey: 'estudianteId'
    });
  }

  static config(sequelize) {
    return {
      sequelize,
      tableName: MATERIAS_TABLE,
      modelName: 'Materias',
      timestamps: false
    }
  }
}


export { MATERIAS_TABLE, MateriasSchema, Materias }