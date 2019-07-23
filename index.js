'use strict';
const periodic = require('periodicjs');
const Promisie = require('promisie');
// const flatten = require('flat');
const utilities = require('./utilities');
const logger = periodic.logger;
// const extsettings = utilities.reactapp().settings;
// const oauth2ServerUtils = periodic.locals.extensions.get('periodicjs.ext.oauth2server');
// let initialReactAppConfig = {};
// let intialReactAppClient;
// let reactAppConfig = {};

module.exports = () => {
  return new Promise((resolve, reject) => {
    try {
      periodic.status.on('configuration-complete', (status) => {
        // const appEnvironment = periodic.settings.application.environment;
        // const reactAppConfigFilepath = `content/config/extensions/periodicjs.ext.reactapp/${appEnvironment}.json`;
        // const configurationDB = periodic.datas.get('configuration');
        Promisie.all(utilities.controllerhelper.pullConfigurationSettings(), utilities.controllerhelper.pullComponentSettings())
          .then(() => {
            logger.silly('MANIFEST SETTINGS LOADED');
          })
          .catch(logger.silly.bind(logger, 'settings error'));

        utilities.initialization.init();
      });

      return resolve(true);
    } catch (e) {
      return reject(e);
    }
  });
};