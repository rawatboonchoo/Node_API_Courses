'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      models.User.hasMany(models.Blog, {
        as: 'blogs',
        foreignKey: 'user_id', // fk ของ blogs 
        sourceKey: 'id' //pk ของ users
      });
    }
  };
  User.init({
    name: DataTypes.STRING(250),
    email: {
      type: DataTypes.STRING(250),
      allowNull: false,
      unique: true
    },
    password: DataTypes.STRING(250),
    role: DataTypes.STRING(50)
  }, {
    sequelize,
    modelName: 'User',
    tableName: 'users',
    timestamps: false
  });
  return User;
};