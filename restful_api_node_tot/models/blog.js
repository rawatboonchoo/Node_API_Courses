'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Blog extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      models.Blog.belongsTo(models.User,{
         as: 'user',
         foreignKey: 'user_id', // fk ของ blogs
         sourceKey: 'id' // pk ของ users
      });
    }
  };
  Blog.init({
    title: DataTypes.STRING(255),
    status:DataTypes.BOOLEAN,
    // get(){
    //   return this.getDataValue('title').toUpperCase()
    // },
    // approve:{
    //   type:DataTypes.VIRTURL,
    //   get(){
    //     return this.status ? 'อนุมัติ' : 'ไม่อนุมัติ'
    //   }
    // },
    created_at: DataTypes.DATE,
    user_id: DataTypes.INTEGER,
    // published_at: {
    //   type: DataTypes.VIRTUAL,
    //   get() {
    //     //custom logic
    //     return `${this.created_at.getDate()}/${this.created_at.getMonth()+1}/${this.created_at.getFullYear()+543}`
    //   }
    // }

  }, {
    sequelize,
    modelName: 'Blog',
    timestamps: false,
    tableName: 'blogs'
  });
  return Blog;
};