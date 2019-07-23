'use strict';
const periodic = require('periodicjs');
const Promisie = require('promisie');
// const utility = require('../utilities/index');
const utilities = require('../utilities');
const UAParser = require('ua-parser-js');
// console.log({ getParameterized });
// let components = utilities.controllerhelper.components;
const appSettings = periodic.settings;
// console.log('periodic', periodic);
appSettings.theme = periodic.settings.container.name;
appSettings.themename = periodic.settings.container.name;
const extsettings = utilities.reactapp().settings;
const versions = utilities.controllerhelper.versions;
// const themeSettings = periodic.settings.themeSettings;
// const appenvironment = appSettings.application.environment;
// const CoreController = periodic.core.controller;
// const CoreUtilities = periodic.core.utilities;
const logger = periodic.logger;

/**
 * index page for react admin, that serves admin app
 * @param  {object}   req  express request
 * @param  {object}   res  express reponse
 * @return {null}        does not return a value
 */
function admin_index(req, res, next) {
  if (req.query.format !== 'json' && req.query.format !== 'json&') {
    let viewname = 'admin/index';
    if (req.headers && req.headers['user-agent']) {
      const UserAgentParser = new UAParser();
      UserAgentParser.setUA(req.headers['user-agent']);
      const parseUserAgent = UserAgentParser.getResult();

      if (parseUserAgent.browser.name === 'Chrome' && parseInt(parseUserAgent.browser.version, 10) < 40) {
        viewname = 'admin/support';
      } else if (parseUserAgent.browser.name === 'IE' && parseInt(parseUserAgent.browser.version, 10) < 11) {
        viewname = 'admin/support';
      } else if (parseUserAgent.browser.name === 'Firefox' && parseInt(parseUserAgent.browser.version, 10) < 41) {
        viewname = 'admin/support';
      } else if (parseUserAgent.browser.name === 'Android Browser' && parseInt(parseUserAgent.browser.version, 10) < 5) {
        viewname = 'admin/support';
      }
      if (parseUserAgent.browser.name === 'IE') {
        res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
      }
    }
    // UserAgentParser.setUA(uastring);
    // logger.silly('render reactapp, ssr', extsettings.server_side_react);
    // logger.silly('render reactapp, req.query.format',req.query.format);
    let viewtemplate = {
      viewname,
      extname: '@digifi-los/reactapp',
    };
    let viewdata = {
      pagedata: {
        // title: 'React Admin',
        // toplink: '&raquo; Multi-Factor Authenticator',
      },
      user: req.user,
      reactapp: utilities.reactapp(),
      theme_name: appSettings.themename,
      // adminPostRoute: adminPostRoute
    };

    if (extsettings.server_side_react) {
      return utilities.controllerhelper.pullConfigurationSettings(false)
        .then(() => {
          // logger.silly('req._parsedOriginalUrl.pathname', req._parsedOriginalUrl.pathname);
          // logger.silly({ unauthenticatedManifestSettings });
          if (utilities.controllerhelper.unauthenticatedManifestSettings &&
            utilities.controllerhelper.unauthenticatedManifestSettings.containers &&
            Object.keys(utilities.controllerhelper.unauthenticatedManifestSettings.containers).length) {
            let layoutPath = utilities.settings.findMatchingRoute(utilities.controllerhelper.unauthenticatedManifestSettings.containers, req._parsedOriginalUrl.pathname);
            let manifest = (layoutPath) ? utilities.controllerhelper.unauthenticatedManifestSettings.containers[layoutPath] : false;
            // console.log({ layoutPath, manifest });
            return utilities.ssr_manifest({ layoutPath, manifest, req_url: req._parsedOriginalUrl.pathname, basename: extsettings.basename, });
          } else {
            return Promise.resolve({}, {});
          }
        })
        .then((results) => {
          let { body, pagedata, } = results;
          // console.log({ body, pagedata });
          viewdata = Object.assign({}, viewdata, { body, }, { pagedata, });
          periodic.core.controller.render(req, res, viewtemplate, viewdata);
        })
        .catch(next);
    } else {
      periodic.core.controller.render(req, res, viewtemplate, viewdata);
    }
  } else {
    // console.log('SKIPPING reactapp req._parsedOriginalUrl.pathname', req._parsedOriginalUrl.pathname);
    // console.log('SKIPPING reactapp: req._parsedOriginalUrl.pathname.indexOf(/extensiondata/) === -1', req._parsedOriginalUrl.pathname.indexOf('/extensiondata/') === -1);
    // console.log('SKIPPING reactapp req.query.format !== json',req.query.format !== 'json');
    // console.log('SKIPPING reactapp req.query.format !== json&',req.query.format !== 'json&');
    next();
  }
}

/**
 * Loads manifest configuration data and sends response with settings
 * @param  {Object}   req  express request
 * @param  {Object}   res  express reponse
 * @param {Function} next express next function
 */
function loadManifest(req, res, next) {
  return utilities.controllerhelper.pullConfigurationSettings((req.query && req.query.refresh) ? 'manifest' : false)
    .then(() => {
      let manifest = Object.assign({}, utilities.controllerhelper.manifestSettings);
      if (req.query && req.query.refresh_log && req.query.refresh_log !== 'false') {
        logger.silly('reloaded manifest', { manifest, });
      }
      if (extsettings && extsettings.includeCoreData && extsettings.includeCoreData.manifest) {
        utilities.controllerhelper.setCoreDataConfigurations();
        if (utilities.controllerhelper.CORE_DATA_CONFIGURATIONS.manifest) manifest.containers = Object.assign({}, utilities.controllerhelper.CORE_DATA_CONFIGURATIONS.manifest, manifest.containers);
      }
      if (req.query && req.query.initial) manifest.containers = utilities.controllerhelper.filterInitialManifest(manifest.containers, req.query.location);
      manifest.containers = utilities.controllerhelper.recursivePrivilegesFilter(Object.assign(
        (req.session && req.session.userprivilegesdata)? req.session.userprivilegesdata : {}  
      ), manifest.containers, true);
      if (res && typeof res.send === 'function') {
        res.status(200).send({
          result: 'success',
          status: 200,
          data: {
            versions: (req.query && req.query.initial) ? undefined : utilities.controllerhelper.versions,
            settings: manifest,
          },
        });
      } else return manifest;
    })
    .catch(e => (typeof next === 'function') ? next(e) : Promisie.reject(e));
}

/**
 * Loads unauthenticated manifest configuration data and sends response with settings
 * @param  {Object}   req  express request
 * @param  {Object}   res  express reponse
 * @param {Function} next express next function
 */
function loadUnauthenticatedManifest(req, res, next) {
  return utilities.controllerhelper.pullConfigurationSettings((req.query && req.query.refresh) ? 'unauthenticated' : false)
    .then(() => {
      let unauthenticated_manifest = Object.assign({}, utilities.controllerhelper.unauthenticatedManifestSettings);
      // console.log({ unauthenticated_manifest });
      if (req.query && req.query.refresh_log && req.query.refresh_log !== 'false') {
        logger.silly('reloaded unauthenticated manifest', { unauthenticated_manifest, });
      }
      if (extsettings && extsettings.includeCoreData && extsettings.includeCoreData.unauthenticated_manifest) {
        utilities.controllerhelper.setCoreDataConfigurations();
        if (utilities.controllerhelper.CORE_DATA_CONFIGURATIONS.unauthenticated_manifest) unauthenticated_manifest.containers = Object.assign({}, utilities.controllerhelper.CORE_DATA_CONFIGURATIONS.unauthenticated_manifest, unauthenticated_manifest.containers);
      }
      if (req.query && req.query.initial) unauthenticated_manifest.containers = utilities.controllerhelper.filterInitialManifest(unauthenticated_manifest.containers, req.query.location);
      if (res && typeof res.send === 'function') {
        res.status(200).send({
          result: 'success',
          status: 200,
          data: {
            versions: (req.query && req.query.initial) ? undefined : utilities.controllerhelper.versions,
            settings: unauthenticated_manifest,
          },
        });
      } else return unauthenticated_manifest;
    })
    .catch(e => (typeof next === 'function') ? next(e) : Promisie.reject(e));
}

/**
 * Loads component configuration data and sends response with settings
 * @param  {object}   req  express request
 * @param  {object}   res  express reponse
 * @param {Function} next express next function
 */
function loadComponent(req, res, next) {
  utilities.controllerhelper.pullComponentSettings((req.query && req.query.refresh) ? req.params.component : false)
    .then(() => {
      let component = utilities.controllerhelper.components[req.params.component] || { status: 'undefined', };
      if (req.query && req.query.refresh_log && req.query.refresh_log !== 'false') logger.silly(`reloaded component ${ req.params.component }`, { component, });
      res.status(200).send({
        result: 'success',
        status: 200,
        data: {
          versions,
          settings: utilities.controllerhelper.assignComponentStatus(component),
        },
      });
    })
    .catch(next);
}

/**
 * Loads user preference data and sends response with settings
 * @param  {object}   req  express request
 * @param  {object}   res  express reponse
 */
function loadUserPreferences(req, res) {
  if (res && typeof res.send === 'function') {
    res.status(200).send({
      result: 'success',
      status: 200,
      data: {
        versions,
        settings: (req.user && req.user.extensionattributes && req.user.extensionattributes.preferences) ? req.user.extensionattributes.preferences : {},
      },
    });
  } else return (req.user && req.user.extensionattributes && req.user.extensionattributes.preferences) ? req.user.extensionattributes.preferences : {};
}

/**
 * Loads navigation configuration data and sends response with settings
 * @param  {object}   req  express request
 * @param  {object}   res  express reponse
 * @param {Function} next express next function
 */
function loadNavigation(req, res, next) {
  return utilities.controllerhelper.pullConfigurationSettings((req.query && req.query.refresh) ? 'navigation' : false)
    .then(() => {
      let navigation = Object.assign({}, utilities.controllerhelper.navigationSettings);
      if (req.query && req.query.refresh_log && req.query.refresh_log !== 'false') {
        logger.silly('reloaded navigation', { navigation, });
      }
      if (extsettings && extsettings.includeCoreData && extsettings.includeCoreData.navigation) {
        utilities.controllerhelper.setCoreDataConfigurations();
        if (utilities.controllerhelper.CORE_DATA_CONFIGURATIONS.navigation && utilities.controllerhelper.CORE_DATA_CONFIGURATIONS.navigation.layout) {
          navigation.layout = Object.assign({}, navigation.layout);
          navigation.layout.children = Object.assign([], navigation.layout.children);
          navigation.layout.children = navigation.layout.children.concat(utilities.controllerhelper.CORE_DATA_CONFIGURATIONS.navigation.layout.children || []);
        }
      }
      navigation.wrapper = extsettings.navigationLayout.wrapper;
      navigation.container = extsettings.navigationLayout.container;
      // console.log({ navigation }, 'req.session.userprivilegesdata', req.session.userprivilegesdata);
      navigation.layout = utilities.controllerhelper.recursivePrivilegesFilter(Object.assign((req.session && req.session.userprivilegesdata)? req.session.userprivilegesdata : {}), [navigation.layout, ])[0];
      if (res && typeof res.send === 'function') {
        res.status(200).send({
          result: 'success',
          status: 200,
          data: {
            versions,
            settings: navigation,
          },
        });
      } else return navigation;
    })
    .catch(e => (typeof next === 'function') ? next(e) : Promisie.reject(e));
}

function loadConfigurations(req, res) {
  // console.log('loading configs');
  return utilities.controllerhelper.pullConfigurationSettings((req.query && req.query.refresh) ? true : false)
    .then(() => {
      if (req.query) delete req.query.refresh;
      return Promisie.parallel({
        navigation: loadNavigation.bind(null, req),
        manifest: loadManifest.bind(null, req),
        unauthenticated_manifest: loadUnauthenticatedManifest.bind(null, req),
        preferences: loadUserPreferences.bind(null, req),
      });
    })
    .then(settings => {
      res.status(200).send({
        result: 'success',
        status: 200,
        data: { settings, versions, },
      });
    })
    .catch(e => {
      logger.error(e);
      res.status(500).send({
        result: 'error',
        status: 500,
        data: {
          error: e.message,
        },
      });
    });
}

module.exports = {
  index: admin_index,
  loadManifest,
  loadComponent,
  loadUserPreferences,
  loadNavigation,
  loadConfigurations,
  loadUnauthenticatedManifest,
};