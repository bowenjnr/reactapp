'use strict';
const Sequelize = require('sequelize');
const mongoose = require('mongoose');
const DEFAULT_TYPES = [
  {
    schemaType: Sequelize.STRING,
    input: 'String',
  },
  {
    schemaType: Sequelize.TEXT,
    input: 'String',
  },
  {
    schemaType: String,
    input: 'String',
  },
  {
    schemaType: 'String',
    input: 'String',
  },
  {
    schemaType: Sequelize.INTEGER,
    input: 'Number',
  },
  {
    schemaType: Sequelize.BIGINT,
    input: 'Number',
  },
  {
    schemaType: Sequelize.FLOAT,
    input: 'Number',
  },
  {
    schemaType: Sequelize.REAL,
    input: 'Number',
  },
  {
    schemaType: Sequelize.DOUBLE,
    input: 'Number',
  },
  {
    schemaType: Number,
    input: 'Number',
  },
  {
    schemaType: 'Number',
    input: 'Number',
  },
  {
    schemaType: Sequelize.DATE,
    input: 'Number',
  },
  {
    schemaType: Sequelize.DATEONLY,
    input: 'Number',
  },
  {
    schemaType: Date,
    input: 'Date',
  },
  {
    schemaType: 'Date',
    input: 'Date',
  },
  {
    schemaType: Boolean,
    input: 'Boolean',
  },
  {
    schemaType: 'Boolean',
    input: 'Boolean',
  },
  {
    schemaType: mongoose.Schema.ObjectId,
    input: 'ObjectId',
  },
  {
    schemaType: Sequelize.UUID,
    input: 'ObjectId',
  },
  {
    schemaType: 'ObjectId',
    input: 'ObjectId',
  },
  {
    schemaType: Sequelize.ARRAY,
    input: 'Array',
  },
  {
    schemaType: Array,
    input: 'Array',
  },
  {
    schemaType: 'Array',
    input: 'Array',
  },
  {
    schemaType: 'undefined',
    input: 'String',
  },
  {
    schemaType: undefined,
    input: 'String',
  },
];

module.exports = (function() {
  let dictionary = {};
  DEFAULT_TYPES.forEach(type => {
    Object.defineProperty(dictionary,
      (typeof type.schemaType === 'string') ?
      type.schemaType :
      Symbol.for(type.schemaType), {
        value: type.input,
        writable: false,
        configurable: false,
        // enumerable:true,
      });
  });
  return dictionary;
})();