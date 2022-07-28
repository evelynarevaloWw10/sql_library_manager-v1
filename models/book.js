'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Book extends Model {
   
    static associate(models) {
      // define association here
    }
  }
  Book.init({
    title: { 
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: {
        // custom error message
        msg: '"Title" is required',
       }
      }
    },

    author: { 
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: {
        // custom error message
        msg: 'Please provide a value for "author"',
      }
     }
    },
    
    genre:{
      type: DataTypes.STRING,
      allowNull: true,
    },
    
    year:{
      type:DataTypes.INTEGER,
      allowNull: true,
     },
   }, {
     modelName: 'Book',
     sequelize,
     
   });
   return Book;
 };

