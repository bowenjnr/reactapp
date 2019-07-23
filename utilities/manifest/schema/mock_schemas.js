'use strict';
const configuration = {
  id: 'ObjectId',
  filepath: 'String',
  environment: 'String',
  container: {
    type: 'String',
    default: 'periodicjs.container.default',
  },
  config: 'Object',
  createdat: {
    type: 'Date',
  },
  updatedat: {
    type: 'Date',
  },
};

const extension = {
  id: 'ObjectId',
  name: {
    type: 'String',
    unique: true,
  },
  require: 'String',
  source: 'String',
  version: 'String',
  enabled: 'Boolean',
  periodic_type: 'Number', //0-core, 1-communication, 2-auth, 3-uac, 4-api, 5-admin,6-data,7-ui
  periodic_priority: 'Number',
  periodic_compatibility: 'String',
  periodic_config: 'Object',
  periodic_dependencies: 'Object',
  author: 'Object',
  contributors: 'Object',
  description: 'String',
  createdat: {
    type: 'Date',
  },
  updatedat: {
    type: 'Date',
  },
};

module.exports = {
  configuration,
  extension,
};