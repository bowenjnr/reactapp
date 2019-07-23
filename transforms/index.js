'use strict';
const periodic = require('periodicjs');
const asset = require('./asset');
const reactappLocals = periodic.locals.extensions.get('@digifi-los/reactapp');
const reactapp = reactappLocals.reactapp();
module.exports = {
  pre: {
    GET: {
      // '/some/route/path/:id': [testPreTransform],
    },
    PUT: {},
  },
  post: {
    GET: {
      [`${reactapp.manifest_prefix}contentdata/standard_assets/:id`]: [
        asset.formatAssetItem,
        // asset.getFileMetaInfo(periodic),
      ],
      [`${reactapp.manifest_prefix}contentdata/standard_assets`]: [
        asset.formatAssetIndex,
      ],
    },
    PUT: {},
  },
};