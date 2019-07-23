'use strict';

const periodic = require('periodicjs');
const utilities = require('../utilities');
const controllers = require('../controllers');
const contentdataRouter = periodic.express.Router();
const dataRouters = utilities.data.getDataCoreController();
const oauth2serverControllers = periodic.controllers.extension.get('periodicjs.ext.oauth2server');
let ensureApiAuthenticated = oauth2serverControllers.auth.ensureApiAuthenticated;

// const assetController = resources.app.controller.native.asset;
const helperController = controllers.helper;
// const transformController = resources.app.controller.extension.reactapp.controller.transform;
// const contentdataController = resources.app.controller.extension.reactapp.controller.contentdata;

// contentdataRouter.use(helperController.approveOptionsRequest, ensureApiAuthenticated, helperController.fixCodeMirrorSubmit, helperController.fixFlattenedSubmit);

contentdataRouter.use(helperController.approveOptionsRequest, ensureApiAuthenticated);
contentdataRouter.get('/secure-asset/:id/:filename', controllers.helper.decryptAsset);
contentdataRouter.put('*',
  controllers.helper.handleFileUpload,
  controllers.helper.fixCodeMirrorSubmit,
  controllers.helper.fixFlattenedSubmit);
contentdataRouter.post('*',
  controllers.helper.handleFileUpload,
  controllers.helper.fixCodeMirrorSubmit,
  controllers.helper.fixFlattenedSubmit);
// console.log({ encryptionKey });
Array.from(dataRouters.values()).forEach(drouter => {
  contentdataRouter.use(drouter.router);
});

module.exports = contentdataRouter;