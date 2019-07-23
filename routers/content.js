'use strict';

const periodic = require('periodicjs');
// const utilities = require('../utilities');
const controllers = require('../controllers');
const contentRouter = periodic.express.Router();
// const contentSettings = utilities.getSettings();
const oauth2serverControllers = periodic.controllers.extension.get('periodicjs.ext.oauth2server');
let ensureApiAuthenticated = oauth2serverControllers.auth.ensureApiAuthenticated;

// const assetController = resources.app.controller.native.asset;
const helperController = controllers.helper;
const updateProfile = [
  helperController.handleFileUpload,
  helperController.fixCodeMirrorSubmit,
  helperController.fixFlattenedSubmit,
  helperController.updateUserProfile,
  helperController.handleControllerDataResponse
];
// const transformController = resources.app.controller.extension.reactapp.controller.transform;
// const contentdataController = resources.app.controller.extension.reactapp.controller.contentdata;

// contentRouter.use(helperController.approveOptionsRequest, ensureApiAuthenticated, helperController.fixCodeMirrorSubmit, helperController.fixFlattenedSubmit);
// contentRouter.get('/:dbname/secure-asset/:id/:filename', assetController.loadAsset, assetController.decryptAsset);

contentRouter.use(helperController.approveOptionsRequest, ensureApiAuthenticated);
contentRouter.put('/update_standard_accounts_profile/:id', updateProfile);
contentRouter.put('/update_standard_users_profile/:id',updateProfile);
contentRouter.get('/:dbname/dbstats',
  helperController.getDBStats,
  helperController.handleControllerDataResponse);
contentRouter.get('/appsettings',
  helperController.getAppSettings,
  helperController.handleControllerDataResponse);

module.exports = contentRouter;