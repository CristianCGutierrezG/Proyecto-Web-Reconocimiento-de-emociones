import { Model,DataTypes,Sequelize } from 'sequelize';
import { MATERIAS_TABLE } from './materias.model.js';

/**
 * Se crea el schema de la tabla horarios
 * sus relaciones con otras tablas
 * la configuracion de sequelize
*/

const HORARIOS_TABLE = 'horarios';

const TimeOnly = DataTypes.DATEONLY;

const HorariosSchema = {
  id: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: DataTypes.INTEGER
  },
  dia: {
    allowNull: false,
    type: DataTypes.STRING,
  },
  horaInicio: {
    allowNull: false,
    type: TimeOnly,
    field: 'hora_inicio'
  },
  horaFin: {
    allowNull: false,
    type: TimeOnly,
    field: 'hora_fin'
  },
  createdAt: {
    allowNull: false,
    type: DataTypes.DATE,
    field: 'created_at',
    defaultValue: DataTypes.NOW
  },
  materiaId:{
    field: 'materia_id',
    allowNull: false,
    type: DataTypes.INTEGER,
    refereces: {
      model: MATERIAS_TABLE,
      key: 'id'
    },
    onUpdate: 'CASCADE',
    onDelete: 'SET NULL'
  }
}

class Horarios extends Model {
  static associate(models) {
    //Uno a Muchos con materias
    this.belongsTo(models.Materias, {as: 'materia'});
  }

  static config(sequelize) {
    return {
      sequelize,
      tableName: HORARIOS_TABLE,
      modelName: 'Horarios',
      timestamps: false
    }
  }
}


export { HORARIOS_TABLE, HorariosSchema, Horarios }