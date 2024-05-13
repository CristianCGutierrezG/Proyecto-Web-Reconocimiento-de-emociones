import { Model, DataTypes} from 'sequelize';
import bcrypt from 'bcrypt'

/**
 * Se crea el schema de la tabla users
 * sus relaciones con otras tablas
 * la configuracion de sequelize
 */

const USER_TABLE = 'users';

const UserSchema = {
  id: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: DataTypes.INTEGER
  },
  email: {
    allowNull: false,
    type: DataTypes.STRING,
    unique: true,
    validate: {
        isEmail: true,
        len: [1, 255]
    }
  },
  password: {
    allowNull: false,
    type: DataTypes.STRING
  },
  role: {
    allowNull: false,
    type: DataTypes.STRING,
    defaultValue: "Estudiante",
  }, 
  recoveryToken: {
    field: 'recovery_token',
    allowNull: true,
    type: DataTypes.STRING
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
  }
}

class User extends Model {
  static associate(models) {
    
    //Uno a Uno con estudiantes
    this.hasOne(models.Estudiante, {
      as: 'estudiante',
      foreignKey: 'userId'
    });

    //Uno a Uno con profesores
    this.hasOne(models.Profesor, {
      as: 'profesor',
      foreignKey: 'userId'
    });

    //Uno a Uno con profesores
    this.hasOne(models.ProSalud, {
      as: 'proSalud',
      foreignKey: 'userId'
    });
  }

  static config(sequelize) {
    return {
      sequelize,
      tableName: USER_TABLE,
      modelName: 'User',
      timestamps: false,
      hooks: {
        beforeCreate: async (user, options) => {
          const password = await bcrypt.hash(user.password, 10);
          user.password = password;
        },
      }
    }
  }
}


export { USER_TABLE, UserSchema, User }