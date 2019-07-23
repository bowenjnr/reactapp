'use strict';

const periodic = require('periodicjs');
const utilities = require('../utilities');
const controllers = require('../controllers');
const reactapp = utilities.reactapp();
const reactappRouter = periodic.express.Router();

const reactappExtSettings = reactapp.settings;
if (reactappExtSettings.include_index_route) {
  reactappRouter.get('/', controllers.reactapp.index);
}
if (!reactappExtSettings.skip_catch_all_route) {
  reactappRouter.get('/*', controllers.reactapp.index);
  reactappRouter.get('*', controllers.reactapp.index);
}

module.exports = reactappRouter;