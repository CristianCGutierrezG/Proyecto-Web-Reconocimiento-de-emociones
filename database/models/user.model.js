import { Model, DataTypes, Sequelize } from 'sequelize';

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
  // cargo: {
  //   allowNull: true,
  //   type: DataTypes.STRING,
  //   validate: {
  //     isIn: [['Estudiante', 'Maestro', 'Profesional de la salud']]
  //   }
  // }, 
  createdAt: {
    allowNull: false,
    type: DataTypes.DATE,
    field: 'created_at',
    defaultValue: DataTypes.NOW
  }
}

class User extends Model {
  static associate() {
    // associate
  }

  static config(sequelize) {
    return {
      sequelize,
      tableName: USER_TABLE,
      modelName: 'User',
      timestamps: false
    }
  }
}


export { USER_TABLE, UserSchema, User }