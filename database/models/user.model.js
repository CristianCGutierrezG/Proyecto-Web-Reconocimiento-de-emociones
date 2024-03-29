import { Model, DataTypes} from 'sequelize';

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
  createdAt: {
    allowNull: false,
    type: DataTypes.DATE,
    field: 'created_at',
    defaultValue: DataTypes.NOW
  }
}

class User extends Model {
  static associate(models) {
    this.hasOne(models.Estudiante, {
      as: 'estudiante',
      foreignKey: 'userId'
    });
    this.hasOne(models.Profesor, {
      as: 'profesor',
      foreignKey: 'userId'
    });
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
      timestamps: false
    }
  }
}


export { USER_TABLE, UserSchema, User }