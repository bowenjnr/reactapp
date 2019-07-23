'use strict';

const periodic = require('periodicjs');
// const utilities = require('../utilities');
const controllers = require('../controllers');
const componentRouter = periodic.express.Router();
// const componentSettings = utilities.getSettings();

const oauth2serverControllers = periodic.controllers.extension.get('periodicjs.ext.oauth2server');
const passport_mfaControllers = periodic.controllers.extension.get('periodicjs.ext.passport_mfa');
const user_access_controlControllers = periodic.controllers.extension.get('periodicjs.ext.user_access_control');
let ensureApiAuthenticated = oauth2serverControllers.auth.ensureApiAuthenticated;
const uacController = user_access_controlControllers.uac;

componentRouter.post('/manifest', ensureApiAuthenticated, uacController.loadUserRoles, controllers.reactapp.loadManifest);
componentRouter.get('/public_manifest', controllers.reactapp.loadUnauthenticatedManifest);
componentRouter.post('/preferences', ensureApiAuthenticated, uacController.loadUserRoles, controllers.reactapp.loadUserPreferences);
componentRouter.post('/navigation', ensureApiAuthenticated, uacController.loadUserRoles, controllers.reactapp.loadNavigation);
componentRouter.post('/configurations', ensureApiAuthenticated, uacController.loadUserRoles, controllers.reactapp.loadConfigurations);
if (periodic.controllers.extension.has('periodicjs.ext.passport_mfa')) {
  const mfaController = passport_mfaControllers.mfa;  
  componentRouter.post('/mfa', ensureApiAuthenticated, mfaController.authenticateTotp);
}
componentRouter.get('/components/:component', controllers.reactapp.loadComponent);
componentRouter.get('/healthcheck', function(req, res) {
  res.status(200).send({ status: 'ok', });
});
componentRouter.get('/healthcheck/:id/:name', function(req, res) {
  console.log(req.params);
  res.status(200).send({ status: 'ok', params: req.params, });
});

module.exports = componentRouter;