//TODO: Need to write out the models 

const { Model, DataTypes } = require('sequelize');

const sequelize = require('../config/connection.js');

class Category extends Model {}

//all ids will autoincrement
Category.init(
      //We will first define the columns for the model
  {
    id: {
      type: DataTypes.INTEGER, 
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    category_name: {
      type: DataTypes.STRING,
      allowNull: false
    }
  },
  {
    sequelize,
    timestamps: false,
    freezeTableName: true,
    underscored: true,
    modelName: 'category',
  }
);


//always export at end script
module.exports = Category;
