import { Model, DataTypes} from 'sequelize';
import { ESTUDIANTE_TABLE } from './estudiante.model.js';

/**
 * Se crea el schema de la tabla emociones
 * sus relaciones con otras tablas
 * la configuracion de sequelize
 */

const EMOCION_TABLE = 'emociones';

const EmocionSchema = {
  id: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: DataTypes.INTEGER
  },
  emocion: {
    allowNull: false,
    type: DataTypes.STRING,
  },
  createdAt: {
    allowNull: false,
    type: DataTypes.DATE,
    field: 'created_at',
    defaultValue: DataTypes.NOW
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
  }
}

class Emocion extends Model {
  static associate(models) {
    //Uno a Muchos con estudiantes
    this.belongsTo(models.Estudiante, {as: 'estudiante'});
  }

  static config(sequelize) {
    return {
      sequelize,
      tableName: EMOCION_TABLE,
      modelName: 'Emocion',
      timestamps: false
    }
  }
}


export { EMOCION_TABLE, EmocionSchema, Emocion }