'use strict';
const periodic = require('periodicjs');
const pluralize = require('pluralize');
const helpers = require('./helpers');
const containers = require('./containers');
const mockSchemas = require('./schema/mock_schemas');
const JSONDictionary = require('./schema/dictionary');
const flatten = require('flat');

function generateManifestsFromCoreData(options = {}) {
  const extsettings = periodic.settings.extensions['@digifi-los/reactapp'];
  const adminRoute = options.customAdminRoute || helpers.getManifestPathPrefix(extsettings.adminPath);
  const { indexOptions, newOptions, showOptions, schema, schemaName, allSchemas, detailOptions, } = options;
  // options.extsettings = extsettings;
  options.adminRoute = adminRoute;
  return {
    [helpers.getContainerPath(options)]: containers.constructIndex({ schema, schemaName, allSchemas, adminRoute, indexOptions, extsettings, }),
    [`${helpers.getContainerPath(options)}/new`]: containers.constructDetail({ schema, schemaName, allSchemas, adminRoute, detailOptions, newEntity: true, extsettings, }),
    [`${helpers.getContainerPath(options)}/:id`]: containers.constructDetail({ schema, schemaName, allSchemas, adminRoute, detailOptions, extsettings, }),
  };
}

function generateCoreDataManifests(options = {}) {
  const Sequelize = require('sequelize');  
  const allSchemas = Array.from(periodic.models.keys()).reduce((result, key) => {
    let modelSchema = periodic.models.get(key).scheme;
    if ((modelSchema._id && modelSchema._id.primaryKey) || (modelSchema._id && modelSchema._id.type )) {
      modelSchema = Object.keys(modelSchema).reduce((newModelSchema, modelSchemaProp) => {
        if (modelSchema[ modelSchemaProp ] instanceof Sequelize.STRING
          || modelSchema[ modelSchemaProp ].type instanceof Sequelize.STRING
          || modelSchema[ modelSchemaProp ] instanceof Sequelize.TEXT
          || modelSchema[ modelSchemaProp ].type instanceof Sequelize.TEXT) {
          newModelSchema[ modelSchemaProp ] = 'String';
        } else if (modelSchema[ modelSchemaProp ] instanceof Sequelize.INTEGER
          || modelSchema[ modelSchemaProp ].type instanceof Sequelize.INTEGER
          || modelSchema[ modelSchemaProp ] instanceof Sequelize.BIGINT
          || modelSchema[ modelSchemaProp ].type instanceof Sequelize.BIGINT
          || modelSchema[ modelSchemaProp ] instanceof Sequelize.FLOAT
          || modelSchema[ modelSchemaProp ].type instanceof Sequelize.FLOAT
          || modelSchema[ modelSchemaProp ] instanceof Sequelize.REAL
          || modelSchema[ modelSchemaProp ].type instanceof Sequelize.REAL
          || modelSchema[ modelSchemaProp ] instanceof Sequelize.DOUBLE
          || modelSchema[ modelSchemaProp ].type instanceof Sequelize.DOUBLE) {
          newModelSchema[ modelSchemaProp ] = 'Number';
        } else if (modelSchema[ modelSchemaProp ] instanceof Sequelize.DATE
          || modelSchema[ modelSchemaProp ].type instanceof Sequelize.DATE
          || modelSchema[ modelSchemaProp ] instanceof Sequelize.DATEONLY
          || modelSchema[ modelSchemaProp ].type instanceof Sequelize.DATEONLY) {
          newModelSchema[ modelSchemaProp ] = 'Date';
        } else if (modelSchema[ modelSchemaProp ] instanceof Sequelize.BOOLEAN
          || modelSchema[ modelSchemaProp ].type instanceof Sequelize.BOOLEAN) {
          newModelSchema[ modelSchemaProp ] = 'Boolean';
        } else if (modelSchema[ modelSchemaProp ] instanceof Sequelize.ARRAY
          || modelSchema[ modelSchemaProp ].type instanceof Sequelize.ARRAY) {
          newModelSchema[ modelSchemaProp ] = 'Array';
        } else {
          newModelSchema[ modelSchemaProp ] = 'String';
        }
        return newModelSchema;
      }, {});
    }
    // console.log({modelSchema})
    const flattenedSchema = flatten(modelSchema, { maxDepth: 3, });
    // console.log({ flattenedSchema });
    for (let key in flattenedSchema) {
      if (JSONDictionary[ Symbol.for(flattenedSchema[ key ]) ]) {
        flattenedSchema[ key ] = JSONDictionary[ Symbol.for(flattenedSchema[ key ]) ];
      }
      if (JSONDictionary[ flattenedSchema[ key ] ]) {
        flattenedSchema[ key ] = JSONDictionary[ flattenedSchema[ key ]];
      }
    }
    // console.log({ flattenedSchema });
    result[key] =flatten.unflatten(flattenedSchema);
    return result;
  }, {});

  allSchemas.configuration = mockSchemas.configuration;
  allSchemas.extension = mockSchemas.extension;
  // console.log({ allSchemas });
  const coreDataGeneratedContainers = Array.from(Object.keys(allSchemas)).reduce((result, key) => {
    return result = Object.assign(result, generateManifestsFromCoreData({
      schemaName: key,
      schema: allSchemas[key],
      allSchemas,
    }));
  }, {});
  // console.log({ coreDataGeneratedContainers })
  return coreDataGeneratedContainers;
}

module.exports = {
  generateManifestsFromCoreData,
  generateCoreDataManifests,
};