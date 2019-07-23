'use strict';
const path = require('path');
const fs = require('fs-extra');
const Promisie = require('promisie');
const periodic = require('periodicjs');
const mongoose = require('mongoose');
const capitalize = require('capitalize');
const parameterize = require('./find_matching_route');
const reloader = require('./reloader');
const settingsUtil = require('./settings');
const manifestUtils = require('./manifest');
const generateDetailManifests = settingsUtil.generateDetailManifests;
const findMatchingRoute = parameterize.findMatchingRoutePath;
// const getParameterized = parameterize.getParameterizedPath;
const logger = periodic.logger;
const ERROR404 = require('../adminclient/src/content/config/manifests/dynamic404');
const DEFAULT_COMPONENTS = {
  login: {
    status: 'uninitialized',
  },
  main: {
    footer: { status: 'uninitialized', },
    header: { status: 'uninitialized', },
  },
  error: {
    '404': {
      status: 'initialized',
      settings: ERROR404,
    },
  },
};
const CORE_DATA_CONFIGURATIONS = {
  manifest: null,
  navigation: null,
};
const extsettings = settingsUtil.reactapp().settings;
const versions = (extsettings.application.use_offline_cache) ? {
  theme: fs.readJsonSync(path.join(__dirname, '../../../', `content/container/${ appSettings.theme || appSettings.themename }/package.json`)).version,
  reactapp: fs.readJsonSync(path.join(__dirname, '../package.json')).version,
} : false;

const appSettings = periodic.settings;
// console.log('periodic', periodic);
let components = {};
let manifestSettings = {};
let navigationSettings = {};
let unauthenticatedManifestSettings = {};
appSettings.theme = periodic.settings.container.name;
appSettings.themename = periodic.settings.container.name;
const util = require('util');

/**
 * Used for reading the periodicjs.reactapp.json configuration as it can be either a json or js file
 * @param  {string} filepath Path toe the reactapp configuration file
 * @return {Object}          Resolved configuration object
 */
function handleAmbiguousExtensionType(filepath) {
  try {
    let dirname = path.dirname(filepath);
    let extname = path.extname(filepath);
    let basename = path.basename(filepath, extname);
    let configuration = require(`${ dirname }/${ basename }.js`);
    return Promisie.resolve(configuration);
  } catch (e) {
    return fs.readJson(filepath);
  }
}

/**
 * Merges the "containers" property of an array of manifest configuration objects
 * @param  {Object[]} manifests An array of manifest configuration objects
 * @return {Object}           Fully merged manifest object
 */
function handleManifestCompilation(manifests) {
  return manifests.reduce((result, manifest) => {
    result.containers = Object.assign(result.containers || {}, manifest.containers);
    return result;
  }, {});
}

/**
 * Gets manifest configuration file/directory paths from the periodic extensions list
 * @param  {Object} configuration The periodic extensions configuration object
 * @param {Object[]} configuration.extensions An array of extension configuration objects for periodic
 * @param {Boolean} [isUnauthenticated=false] Denotes if "unauthenticated_manifests" property should be read in place of "manifests" property
 * @return {Object}               Aggregated manifest configurations specified by periodic extensions configuration
 */
function pullManifestSettings(configuration, isUnauthenticated = false) {
  let extensions = (Array.isArray(configuration))? configuration: configuration.extensions || [];
  let filePaths = extensions.reduce((result, config) => {
    if (config.enabled && config.periodic_config && config.periodic_config['periodicjs_ext_reactapp'] && config.periodic_config['periodicjs_ext_reactapp'][(isUnauthenticated) ? 'unauthenticated_manifests' : 'manifests']) {
      if (Array.isArray(config.periodic_config['periodicjs_ext_reactapp'][(isUnauthenticated) ? 'unauthenticated_manifests' : 'manifests'])) return result.concat(config.periodic_config['periodicjs_ext_reactapp'][(isUnauthenticated) ? 'unauthenticated_manifests' : 'manifests']);
      result.push(config.periodic_config['periodicjs_ext_reactapp'][(isUnauthenticated) ? 'unauthenticated_manifests' : 'manifests']);
    }
    return result;
  }, []);
  return readAndStoreConfigurations(filePaths || [], (isUnauthenticated) ? 'unauthenticated' : 'manifest')
    .then(handleManifestCompilation)
    .catch(e => Promisie.reject(e));
}

/**
 * Reads component configuration file paths from react admin and theme configurations and resolves actual configurations from specified paths
 * @return {Object} Component configuration objects indexed by component type
 */
function pullComponentSettings(refresh) {
  if (Object.keys(components).length && !refresh) return Promisie.resolve(components);
  // console.log({components})
  return readAndStoreConfigurations([
    handleAmbiguousExtensionType.bind(null, path.join(__dirname, '../periodicjs.reactapp.json')),
    handleAmbiguousExtensionType.bind(null, path.join(__dirname, `../../../../content/container/${appSettings.theme || appSettings.themename}/periodicjs.reactapp.json`)),
  ])
    .then(results => {
      // console.log('util.inspect(results,{depth:20})', util.inspect(results, { depth: 20 }));
      switch (Object.keys(results).length.toString()) {
      case '1':
        return Object.assign({}, (results[0]['periodicjs_ext_reactapp']) ? results[0]['periodicjs_ext_reactapp'].components : {});
      case '2':
        return Object.assign({}, (results[0]['periodicjs_ext_reactapp']) ? results[0]['periodicjs_ext_reactapp'].components : {}, (results[1]['periodicjs_ext_reactapp']) ? results[1]['periodicjs_ext_reactapp'].components : {});
      default:
        return {};
      }
    })
    .then(results => {
      if (!components || typeof refresh !== 'string') return results;
      else if (typeof refresh === 'string') return {
        [refresh]: results[refresh],
      };
    })
    .then(results => Promisie.parallel(generateComponentOperations(results, (!components) ? DEFAULT_COMPONENTS : components)))
    .then(results => {
      components = Object.assign(components, (!components) ? DEFAULT_COMPONENTS : components, results);
      return assignComponentStatus(components);
    })
    .catch(e => Promisie.reject(e));
}

/**
 * Returns a bound copy of pull component settings with a pre-defined refresh argument so that it can be correctly called by the reloader function
 * @param  {string} type The type of configuration that is being reloaded  
 * @return {Function}      Bound copy of pullConfigurationSettings function
 */
function handleConfigurationReload(type) {
  if (type.toLowerCase() === 'components') {
    return pullComponentSettings.bind(null, true);
  } else {
    return pullConfigurationSettings.bind(null, type.toLowerCase());
  }
}

/**
 * Gets manifest/navigation configurations from all possible sources and aggregates data with top priority to theme configurations followed by extensions and finally the default values provided by react admin. Also defines the in-scope manifestSettings and navigationSettings variables
 * @return {Object} Returns the fully aggregated configurations for manifests and and navigation
 */
function pullConfigurationSettings(reload) {
  if (Object.keys(manifestSettings).length && Object.keys(navigationSettings).length && Object.keys(unauthenticatedManifestSettings).length && !reload) return Promisie.resolve({ manifest: manifestSettings, navigation: navigationSettings, unauthenticated: unauthenticatedManifestSettings, });
  return Promisie.all(
    [
      Promise.resolve({ extensions:Array.from(periodic.extensions.values()).filter(ext => ext.periodic_config && ext.periodic_config.periodicjs_ext_reactapp), }), // fs.readJson(path.join(__dirname, '../../../content/config/extensions.json')),
      handleAmbiguousExtensionType(path.join(__dirname, '../periodicjs.reactapp.json')),
    ]
    )
    .then(configurationData => {
      let [configuration, adminExtSettings,] = configurationData;
      adminExtSettings = adminExtSettings['periodicjs_ext_reactapp'];
      let operations = {};
      if (reload === 'manifest' || reload === true || !Object.keys(manifestSettings).length) {
        operations = Object.assign(operations, {
          manifests: pullManifestSettings.bind(null, configuration),
          default_manifests: readAndStoreConfigurations.bind(null, adminExtSettings.manifests || [], 'manifest'),
        });
      }
      if (reload === 'unauthenticated' || reload === true || !Object.keys(unauthenticatedManifestSettings).length) {
        operations = Object.assign(operations, {
          unauthenticated_manifests: pullManifestSettings.bind(null, configuration, true),
          default_unauthenticated_manifests: readAndStoreConfigurations.bind(null, adminExtSettings.unauthenticated_manifests || [], 'unauthenticated'),
        });
      }
      if (reload === 'navigation' || reload === true || !Object.keys(navigationSettings).length) {
        operations = Object.assign(operations, {
          navigation: pullNavigationSettings.bind(null, configuration),
          default_navigation: readAndStoreConfigurations.bind(null, adminExtSettings.navigation || [], 'navigation'),
        });
      }
      return Promisie.parallel(operations);
    })
    .then(sanitizeConfigurations)
    .then(finalizeSettingsWithTheme)
    .then(result => {
      let { manifest, navigation, unauthenticated_manifest, } = result;
      // const util = require('util');
      // console.log(util.inspect(navigation,{depth:20 }));
      manifestSettings = Object.assign(manifestSettings,
        (reload === 'manifest' || reload === true || !Object.keys(manifestSettings).length) ?
        manifest :
        manifestSettings);
      navigationSettings = Object.assign(navigationSettings,
        (reload === 'navigation' || reload === true || !Object.keys(navigationSettings).length) ?
        navigation :
        navigationSettings);
      unauthenticatedManifestSettings = Object.assign(unauthenticatedManifestSettings,
        (reload === 'unauthenticated' || reload === true || !Object.keys(unauthenticatedManifestSettings).length) ?
        unauthenticated_manifest :
        unauthenticatedManifestSettings);
      return result;
    })
    .catch(e => Promisie.reject(e));
}

/**
 * Reads a react admin configuration from a specified file path or from files that exist in a directory path (although this can read .js modules it is recommended you use json files as js files are cached and can not be reloaded)
 * @param  {string} originalFilePath A file or directory path
 * @return {Object|Object[]}          Either a single react admin configuration or an array of configurations
 */
function readConfigurations(originalFilePath, configurationType) {
  const filePath = path.join(periodic.config.app_root, originalFilePath);
  let _import = function(_path) {
    if (path.extname(_path) !== '.js' && path.extname(_path) !== '.json') {
      return undefined;
    }
    if (extsettings.hot_reload) {
      if (path.extname(_path) === '.js') return reloader(_path, handleConfigurationReload(configurationType), periodic);
      else return reloader(_path, handleConfigurationReload(configurationType));
    }
    if (path.extname(_path) !== '.js') {
      return fs.readJson(_path);
    } else {
      let requiredFile = require(_path);
      requiredFile = (typeof requiredFile === 'function') ?
        requiredFile(periodic) :
        requiredFile;
      return Promisie.resolve(requiredFile);
    }
  };
  return fs.stat(filePath)
    .then(stats => {
      if (stats.isFile()) return _import(filePath);
      else if (stats.isDirectory()) {
        return fs.readdir(filePath)
          .then(files => {
            if (files.length) {
              return Promisie.map(files, file => {
                let fullPath = path.join(filePath, file);
                return _import(fullPath);
              });
            }
            return [];
          })
          .catch(e => Promisie.reject(e));
      } else return Promisie.reject(new TypeError('Configuration path is not a file or directory'));
    })
    .catch(e => Promisie.reject(e));
}

/**
 * Accepts a single file/directory path or any array of file/directory paths and returns an array of configuration data for all configurations that are successfully read from these paths
 * @param  {string|string[]} paths A single file/directory path or an array of file/directory paths
 * @return {Object[]}       An array of configuration objects for any successfully resolved file reads
 */
function readAndStoreConfigurations(paths, type) {
  paths = (Array.isArray(paths)) ? paths : [paths,];
  // console.log({ paths });
  let reads = paths.map(_path => {
    if (typeof _path === 'string') return readConfigurations.bind(null, _path, type);
    if (typeof _path === 'function') return _path;
    return () => Promisie.reject(new Error('No path specified'));
  });
  return Promisie.settle(reads)
    .then(result => {
      if (result.rejected.length) logger.error('Invalid Manifest', result.rejected, result.rejected);
      let { fulfilled, } = result;
      fulfilled = fulfilled.map(data => data.value);
      let flatten = function(result, data) {
        if (Array.isArray(data)) return result.concat(data.reduce(flatten, []));
        if (data) result.push(data);
        return result;
      };
      return fulfilled.reduce(flatten, []);
    })
    .catch(e => Promisie.reject(e));
}

/**
 * Recursively assigns an async function to all component configuration file paths that will read configuration data and assign value to original key or assigns default value
 * @param  {Object} data     Component configuration object with key value pairs that represent an eventual key value and a file path that should resolve with configuration data
 * @param  {Object} defaults Default component configurations provided by react admin
 * @return {Object}          Returns an object that has async read operations assigned to keys for configuration resolution
 */
function generateComponentOperations(data, defaults) {
  return Object.keys(data).reduce((result, key) => {
    if (typeof data[key] === 'string') {
      result[key] = function() {
        return readAndStoreConfigurations([data[key],], 'components')
          .then(result => {
            if (result.length) return result[0];
            return Promisie.reject('unable to read property resetting to default value');
          })
          .catch(() => (defaults && defaults[key]) ? defaults[key] : undefined);
      };
    } else if (typeof data[key] === 'object') result[key] = Promisie.parallel.bind(Promisie, generateComponentOperations(data[key], (defaults) ? defaults[key] : undefined));
    else result[key] = () => Promisie.resolve(data[key]);
    return result;
  }, {});
}

/**
 * Assigns an active status flag to nested component configuration objects
 * @param  {Object} component Component configuration object
 * @return {Object}           Original object with active status flag assigned where applicable
 */
function assignComponentStatus(component) {
  if (component && component.layout) {
    if (typeof component.status === 'undefined' || (component.status !== 'undefined' && component.status !== 'uninitialized')) component.status = 'active';
  } else if (component && typeof component === 'object') {
    component = Object.keys(component).reduce((result, key) => {
      result[key] = assignComponentStatus(component[key]);
      return result;
    }, {});
  }
  return component;
}

/**
 * Merges navigation wrapper, container, layout and concats navigation links specified by periodic extensions configuration
 * @param  {Object[]} navigation An array of navigation configuration objects
 * @param {Boolean} isExtension If true denotes that navigation configuration should be added to Extension navigation sub-element
 * @return {Object}            Fully merged navigation object
 */
function handleNavigationCompilation(navigation, isExtension) {
  //  const util = require('util');
  //     console.log(util.inspect(navigation,{depth:20 }));
  // console.log({ isExtension})
  let extensionsNav = [{
    component: 'MenuLabel',
    children: 'Extensions',
  }, {
    component: 'MenuList',
    children: [],
  },];
  let subLinks = extensionsNav[1];
  let compiled = navigation.reduce((result, nav) => {
    result.wrapper = Object.assign(result.wrapper || {}, nav.wrapper);
    result.container = Object.assign(result.container || {}, nav.container);
    result.layout = result.layout || { children: [], };
    if (!isExtension) result.layout = Object.assign(result.layout, nav.layout, { children: result.layout.children.concat(nav.layout.children), });
    else subLinks.children = subLinks.children.concat(nav.layout.children);
    return result;
  }, {});
  if (subLinks.children.length) compiled.layout.children = compiled.layout.children.concat(extensionsNav);
  return compiled;
}

/**
 * Gets navigation configuration from file/directory paths from the periodic extensions list
 * @param  {Object} configuration The periodic extensions configuration object
 * @param {Object[]} configuration.extensions An array of extension configuration objects for periodic
 * @return {Object}               Aggregated navigation configurations specified by periodic extensions configuration
 */
function pullNavigationSettings(configuration) {
  let extensions = configuration.extensions || [];
  let filePaths = extensions.reduce((result, config) => {
    if (config.enabled && config.periodic_config && config.periodic_config['periodicjs_ext_reactapp'] && config.periodic_config['periodicjs_ext_reactapp'].navigation) result.push(config.periodic_config['periodicjs_ext_reactapp'].navigation);
    return result;
  }, []);
  return readAndStoreConfigurations(filePaths || [], 'navigation')
    .then(result => handleNavigationCompilation(result, true))
    .catch(e => Promisie.reject(e));
}

/**
 * Finalizes view/navigation configurations by aggregating theme configurations, extension configurations and react admin default configurations
 * @param  {Object} data Loaded view/navigation configurations from periodic extensions and the default react admin configuration
 * @param {Object} data.default_manifests Default manifest configurations derived from files specified by react admin extension
 * @param {Object} data.manifests Manifest configurations derived from files/directories specified in periodic extensions list
 * @param {Object} data.default_navigation Default navigation configuration derived from file specified by react admin extension
 * @param {Object} data.navigation Navigation configuration derived from files/directories specified in periodic extensions list
 * @return {Object}      Aggregated manifest and navigation configuration
 */
function finalizeSettingsWithTheme(data) {
  let filePath = path.join(__dirname, '../../../../content/container', appSettings.theme || appSettings.themename, 'periodicjs.reactapp.json');
  // console.log({ filePath, });
  return handleAmbiguousExtensionType(filePath)
    .then(result => {
      result = result['periodicjs_ext_reactapp'];
      return Promisie.parallel({
        manifests: readAndStoreConfigurations.bind(null, result.manifests || [], 'manifest'),
        unauthenticated_manifests: readAndStoreConfigurations.bind(null, result.unauthenticated_manifests || [], 'unauthenticated'),
        navigation: readAndStoreConfigurations.bind(null, result.navigation || [], 'navigation'),
      });
    })
    .then(result => {
      let { manifests, navigation, unauthenticated_manifests, } = result;
      manifests = handleManifestCompilation(manifests);
      manifests.containers = Object.assign({}, (data.default_manifests) ? data.default_manifests.containers : {}, (data.manifests) ? data.manifests.containers : {}, manifests.containers);
      unauthenticated_manifests = handleManifestCompilation(unauthenticated_manifests);
      unauthenticated_manifests.containers = Object.assign({}, (data.default_unauthenticated_manifests) ? data.default_unauthenticated_manifests.containers : {}, (data.unauthenticated_manifests) ? data.unauthenticated_manifests.containers : {}, unauthenticated_manifests.containers);
      navigation = handleNavigationCompilation(navigation);
      let navigationChildren = (data.default_navigation && data.default_navigation.layout && Array.isArray(data.default_navigation.layout.children)) ? data.default_navigation.layout.children : [];
      navigation.wrapper = Object.assign({}, (data.default_navigation) ? data.default_navigation.wrapper : {}, (data.navigation) ? data.navigation.wrapper : {}, navigation.wrapper);
      navigation.container = Object.assign({}, (data.default_navigation) ? data.default_navigation.container : {}, (data.navigation) ? data.navigation.container : {}, navigation.container);
      if (navigation && navigation.layout && navigation.layout.children && navigation.layout.children.length) {
        navigationChildren = Object.assign([], navigation.layout.children);
      } else {
        navigationChildren = navigationChildren.concat((data.navigation && data.navigation.layout && Array.isArray(data.navigation.layout.children)) ? data.navigation.layout.children : []);
      }
      navigation.layout = navigation.layout || Object.assign({ children: [], }, (data.default_navigation) ? data.default_navigation.layout : {}, (data.navigation) ? data.navigation.layout : {});
      navigation.layout.children = navigationChildren;
      return { manifest: manifests, navigation, unauthenticated_manifest: unauthenticated_manifests, };
    })
    .catch(e => {
      logger.error(`There is not a reactapp config for ${appSettings.theme || appSettings.themename}`, e);
      fs.outputJson(path.join(periodic.config.app_root, 'content/container', appSettings.theme || appSettings.themename, 'periodicjs.reactapp.json'), {
        'periodicjs_ext_reactapp': {
          manifests: [],
          'unauthenticated_manifests': [],
          'navigation': false,
          'components': {
            'login': false,
            'main': {},
            'error': {
              '404': false,
              '400': false,
            },
          },
        },
      }, { spaces: 2, });
      let manifest = { containers: Object.assign({}, (data.default_manifests) ? data.default_manifests.containers : {}, (data.manifests) ? data.manifests.containers : {}), };
      let unauthenticated_manifest = { containers: Object.assign({}, (data.default_unauthenticated_manifests) ? data.default_unauthenticated_manifests.containers : {}, (data.unauthenticated_manifests) ? data.unauthenticated_manifests.containers : {}), };
      let navigationChildren = (data.default_navigation && data.default_navigation.layout && Array.isArray(data.default_navigation.layout.children)) ? data.default_navigation.layout.children : [];
      let navigation = {
        wrapper: Object.assign({}, (data.default_navigation) ? data.default_navigation.wrapper : {}, (data.navigation) ? data.navigation.wrapper : {}),
        container: Object.assign({}, (data.default_navigation) ? data.default_navigation.container : {}, (data.navigation) ? data.navigation.container : {}),
        layout: Object.assign({}, (data.default_navigation) ? data.default_navigation.layout : {}, (data.navigation) ? data.navigation.layout : {}, {
          children: navigationChildren.concat((data.navigation && data.navigation.layout && Array.isArray(data.navigation.layout.children)) ? data.navigation.layout.children : []),
        }),
      };
      return { manifest, navigation, unauthenticated_manifest, };
    });
}

/**
 * Sanitizes the default manifest and navigation configurations provided by default configuration paths. Conforms format to format outputed by extensions list
 * @param {Object} data.default_manifests Default manifest configurations derived from files specified by react admin extension
 * @param {Object} data.manifests Manifest configurations derived from files/directories specified in periodic extensions list
 * @param {Object} data.default_navigation Default navigation configuration derived from file specified by react admin extension
 * @param {Object} data.navigation Navigation configuration derived from files/directories specified in periodic extensions list
 * @return {Object}      Returns sanitized default navigation/manifest configurations
 */
function sanitizeConfigurations(data) {
  return Object.keys(data).reduce((result, key) => {
    if (key === 'default_manifests' || key === 'default_unauthenticated_manifests') result[key] = handleManifestCompilation(data[key]);
    else if (key === 'default_navigation') result[key] = handleNavigationCompilation(data[key]);
    else result[key] = data[key];
    return result;
  }, {});
}

function filterInitialManifest(containers, location) {
  let initialManifests = Object.keys(containers).reduce((result, key) => {
    if (location === key || key === '/login' || key === '/mfa') result[key] = containers[key];
    return result;
  }, {});
  let matchedRoute = findMatchingRoute(containers, location);
  if (matchedRoute) {
    initialManifests[matchedRoute] = containers[matchedRoute];
  }
  // console.log({ initialManifests, matchedRoute, });
  return initialManifests;
}

/**
 * Loads core data model detail views as manifest and navigation configurations
 */
function setCoreDataConfigurations() {
  // console.log({ extsettings });
  if (!CORE_DATA_CONFIGURATIONS.manifest || !CORE_DATA_CONFIGURATIONS.navigation) {
    if (CORE_DATA_CONFIGURATIONS.manifest === null) {
      // let generated = generateDetailManifests(mongoose, {
      //   dbname: 'standard',
      //   extsettings,
      //   prefix: (typeof periodic.app.locals.adminPath === 'string' && periodic.app.locals.adminPath !== '/' && periodic.app.locals.adminPath) ?
      //     `${(periodic.app.locals.adminPath.charAt(0) === '/')
      //       ? periodic.app.locals.adminPath.slice(1)
      //       : periodic.app.locals.adminPath}/content` : '/content',
      // });
      CORE_DATA_CONFIGURATIONS.manifest = manifestUtils.coreData.generateCoreDataManifests({}); //generated;
      // console.log('CORE_DATA_CONFIGURATIONS.manifest', CORE_DATA_CONFIGURATIONS.manifest);
    }
    // if (CORE_DATA_CONFIGURATIONS.navigation === null && CORE_DATA_CONFIGURATIONS.manifest) {
    //   CORE_DATA_CONFIGURATIONS.navigation = Object.keys(CORE_DATA_CONFIGURATIONS.manifest).reduce((result, key) => {
    //     // console.log({result,key});
    //     result.layout = result.layout || {};
    //     result.layout.children = result.layout.children || [{
    //       component: 'MenuLabel',
    //       children: 'Data',
    //     }, {
    //       component: 'MenuList',
    //       children: [],
    //     }, ];
    //     if (key.indexOf('/:id') === -1 && key.indexOf('/new') === -1) {
    //       // console.log({key})
    //       result.layout.children[1].children.push({
    //         component: 'MenuAppLink',
    //         props: {
    //           href: key,
    //           label: capitalize(path.basename(key)),
    //           id: path.basename(key),
    //         },
    //       });
    //     }
    //     return result;
    //   }, {});
    // }
  }
}

/**
 * Determines if user privileges array contains privilege code(s) that exist in defined privileges for a view
 * @param  {string[]} privileges An array of privilege codes for a user
 * @param  {Object} layout     The layout configuration object for a view or navigation link
 * @param {string[]} layout.privileges The necessary privileges for a given view or navigation link
 * @return {boolean} Returns true if user privileges exist in view privilege array. Additionally returns true if view privileges is not defined           
 */
function determineAccess(privileges, layout) {
  if (!privileges.length && (!layout.privileges || !layout.privileges.length)) return true;
  let hasAccess = false;
  if (!layout.privileges) hasAccess = true;
  else {
    if (privileges.length) {
      for (let i = 0; i < privileges.length; i++) {
        hasAccess = (layout.privileges.indexOf(privileges[i]) !== -1);
        if (hasAccess) break;
      }
    }
  }
  return hasAccess;
}

/**
 * Removes null values from an Array
 * @param  {Object[]} data An array of child components that may contain null values
 * @return {Object[]}      Returns the original array with null values removed
 */
function removeNullIndexes(data) {
  let index = data.indexOf(null);
  while (index > -1) {
    data.splice(index, 1);
    index = data.indexOf(null);
  }
  return data;
}

/**
 * Recursively iterates through a view/navigation configuration object and and removes non-permissioned values
 * @param  {string[]}  privileges An array of user privileges
 * @param  {Object}  [config={}]  The configuration object that should be filtered
 * @param  {boolean} [isRoot=false]   If true assumes that the configuration object is contained within the "layout" property of the provided object
 * @return {Object|Object[]}             Filtered configuration object
 */
function recursivePrivilegesFilter(privileges = {}, config = {}, isRoot = false) {
  privileges = (Array.isArray(privileges)) ? privileges : [];
  return Object.keys(config).reduce((result, key) => {
    let layout = (isRoot) ? config[key].layout : config[key];
    let hasAccess = determineAccess(privileges, layout);
    if (hasAccess) {
      result[key] = config[key];
      if (Array.isArray(layout.children) && layout.children.length) result[key].children = recursivePrivilegesFilter(privileges, result[key].children);
    }
    return (Array.isArray(result)) ? removeNullIndexes(result) : result;
  }, (Array.isArray(config)) ? [] : {});
}

module.exports = {
  ERROR404,
  DEFAULT_COMPONENTS,
  CORE_DATA_CONFIGURATIONS,
  versions,
  components,
  manifestSettings,
  navigationSettings,
  unauthenticatedManifestSettings,
  handleAmbiguousExtensionType,
  handleManifestCompilation,
  pullManifestSettings,
  pullComponentSettings,
  pullConfigurationSettings,
  handleConfigurationReload,
  readConfigurations,
  readAndStoreConfigurations,
  generateComponentOperations,
  assignComponentStatus,
  handleNavigationCompilation,
  pullNavigationSettings,
  finalizeSettingsWithTheme,
  sanitizeConfigurations,
  filterInitialManifest,
  setCoreDataConfigurations,
  determineAccess,
  removeNullIndexes,
  recursivePrivilegesFilter,
};