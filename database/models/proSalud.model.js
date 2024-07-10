import { Model, DataTypes} from 'sequelize';
import { USER_TABLE } from './user.model.js';

/**
 * Se crea el schema de la tabla profesional_salud
 * sus relaciones con otras tablas
 * la configuracion de sequelize
 */

const PROSALUD_TABLE = 'profesional_salud';

const ProSaludSchema = {
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
    type: DataTypes.STRING,
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

class ProSalud extends Model {
  static associate(models) {
    //Uno a Uno con user
    this.belongsTo(models.User, {as: 'user'});
  }

  static config(sequelize) {
    return {
      sequelize,
      tableName: PROSALUD_TABLE,
      modelName: 'ProSalud',
      timestamps: false
    }
  }
}


export { PROSALUD_TABLE, ProSaludSchema, ProSalud }