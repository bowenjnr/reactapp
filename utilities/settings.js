'use strict';
const periodic = require('periodicjs');
const PathRegExp = require('path-to-regexp');
const fs = require('fs-extra');
const path = require('path');
const route_prefixes = require('./route_prefixes');
const generateDetailManifests = require('./detail_views/index').generateManifest;
const ROUTE_MAP = new Map();
const reactapp_file_paths = {};

function getSettings() {
  return periodic.settings.extensions['@digifi-los/reactapp'];
}

function getParameterized(route) {
  if (ROUTE_MAP.has(route)) return ROUTE_MAP.get(route);
  else {
    let keys = [];
    let result = new PathRegExp(route, keys);
    ROUTE_MAP.set(route, {
      re: result,
      keys,
    });
    return { keys, re: result, };
  }
}

function findMatchingRoute(routes, location) {
  let matching;
  location = (/\?[^\s]+$/.test(location)) ? location.replace(/^([^\s\?]+)\?[^\s]+$/, '$1') : location;
  Object.keys(routes).forEach(key => {
    let result = getParameterized(key);
    if (result.re.test(location) && !matching) matching = key;
  });
  return matching;
}

function reactapp() {
  const extensionConfig = getSettings();
  const reactappConfig = {
    settings: extensionConfig,
    route_prefix: route_prefixes.route_prefix(extensionConfig.adminPath),
    admin_prefix: route_prefixes.admin_prefix(extensionConfig.adminPath),
    manifest_prefix: route_prefixes.manifest_prefix(extensionConfig.adminPath),
  };

  if (!reactapp_file_paths.js_file_path) {
    reactapp_file_paths.js_file_path = fs.readdirSync(path.resolve(__dirname, '../public/static/js')).filter(file => file.indexOf('js.map') === -1)[ 0 ];
  }

  if (!reactapp_file_paths.css_file_path) {
    reactapp_file_paths.css_file_path = fs.readdirSync(path.resolve(__dirname, '../public/static/css')).filter(file => file.indexOf('css.map') === -1)[ 0 ];
  }
  reactappConfig.reactapp_file_paths = reactapp_file_paths;
  periodic.app.locals.theme_name = periodic.settings.container.name;
  periodic.app.locals.adminPath = extensionConfig.adminPath;
  periodic.app.locals.reactapp_file_paths = reactapp_file_paths;
  // periodic.app.locals.extension = Object.assign({}, periodic.app.locals.extension, {
  //   reactapp: reactappConfig,
  // });
  return reactappConfig;
}

module.exports = {
  getSettings,
  getParameterized,
  findMatchingRoute,
  reactapp,
  generateDetailManifests,
  reactapp_file_paths,
};