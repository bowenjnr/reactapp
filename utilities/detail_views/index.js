'use strict';
const Promisie = require('promisie');
const fs = Promisie.promisifyAll(require('fs-extra'));
const gather = require('./lib/gather');
const manifest = require('./lib/manifest');
const dbstats = require('./layouts/dbstats.manifest.layout');

var generateManifest = function generateManifest(connection, options = {}) {
  let schemas = gather(connection);
  // console.log({ schemas,options });
  let generated = manifest(schemas, options);
  if (typeof options.filePath === 'string') return fs.writeJsonAsync(options.filePath, generated);
  // console.log({ generated });
  return generated;
};

module.exports = {
  generateManifest,
  // layouts: {
  //   dbstats,
  // },
};