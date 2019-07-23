'use strict';
// const Promisie = require('promisie');
const fs = require('fs-extra');
// const path = require('path');
// const mongoose = require('mongoose');
const periodic = require('periodicjs');
const pluralize = require('pluralize');
const capitalize = require('capitalize');
const numeral = require('numeral');
const moment = require('moment');
const str2json = require('string-to-json');
const Promisie = require('promisie');
const colors = require('../utilities/detail_views/colors');
const utilities = require('../utilities');
// let assetController;
// assetController = resources.app.controller.native.asset;
const appSettings = periodic.settings;
const CoreUtilities = periodic.core.utilities;
let encryption_key;

const approveOptionsRequest = (req, res, next) => {
  // console.log('req.method', req.method);
  if (req.method && typeof req.method === 'string' && req.method.toUpperCase() === 'OPTIONS') {
    res.send('ok preflight');
    // res.sendStatus(200);
  } else {
    next();
  }
};

const fixCodeMirrorSubmit = (req, res, next) => {
  // console.log('fixCodeMirrorSubmit')
  if (req.body.genericdocjson) {
    req.controllerData = req.controllerData || {};
    req.controllerData.skip_xss = true;
    req.controllerData.encryptFields = true;
    var jsonbody = JSON.parse(req.body.genericdocjson);
    delete req.body.genericdocjson;
    req.body = Object.assign({}, req.body, jsonbody);
    if (!req.body.docid && req.body._id) {
      req.body.docid = req.body._id;
    }
    // delete req.body._id;
    delete req.body.__v;
    // delete req.body.format;
    Object.keys(req.body).forEach(function(key) {
      if (req.body[key] === '!!--EMPTY--single--EMTPY--!!') {
        req.body[key] = null;
      } else if (req.body[key] === '!!--EMPTY--array--EMTPY--!!') {
        req.body[key] = [];
      }
    });
  }
  if (!req.controllerData.denyHTMLxss) {
    req.controllerData = Object.assign({},
      req.controllerData, { html_xss: true, });
  }
  // console.log('fixCodeMirrorSubmit req.body', req.body)
  next();
};

const fixFlattenedSubmit = function(req, res, next) {
  if (req.query.unflatten && req.body) {
    Object.keys(req.body).forEach(formname => {
      if (req.body[ formname ] === 'undefined') {
        req.body[ formname ] = undefined;
      }
    });
    req.body = str2json.convert(req.body);
    if (!req.body.docid && req.body._id) {
      req.body.docid = req.body._id;
    }
    // if (req.body.latest_contact.phone_number_primary) {
    //   req.body.latest_contact.phone_number_primary = req.body.latest_contact.phone_number_primary.replace(/\D/gi, '');
    // }
    // console.log('fixFlattenedSubmit req.body', req.body)
    // delete req.body._id;
    delete req.body._csrf;
    delete req.body.__v;
  }
  next();
};

const decryptAsset = function (req, res, next) {
  if (!encryption_key) {
    const extsettings = utilities.reactapp().settings;
    encryption_key = fs.readFileSync(extsettings.encryption_key_path).toString();
  }
  return periodic.core.files.decryptAssetMiddlewareHandler({
    periodic,
    encryption_key,
  })(req, res, next);
};

const handleFileUpload = function (req, res, next) {
  const extsettings = utilities.reactapp().settings;
  if (!encryption_key) {
    encryption_key = fs.readFileSync(extsettings.encryption_key_path).toString();
  }
  if (req.query.forcequerytobody) { //this is because multer rename function is being called before multipart form body is parsed
    req.query.encryptfiles = (req.query.encryptfiles) ? true : undefined;
    req.body = Object.assign({}, req.body, req.query);
    req.controllerData = Object.assign({}, req.controllerData, req.query);
  }
  // console.log('handleFileUpload req.query', req.query);
  // console.log('handleFileUpload req.headers', req.headers);
  // console.log('handleFileUpload req.body', req.body);
  // console.log("req.headers['content-type'].indexOf('multipart/form-data')", req.headers[ 'content-type' ].indexOf('multipart/form-data'));
  // if ((req.query.handleupload || req.controllerData.handleupload || req.body.handleupload ) && (req.headers && req.headers['content-type']&& req.headers['content-type'].indexOf('multipart/form-data')!==-1)) {
  const { sizeLimit, acceptedMIMETypes, } = extsettings.fileUpload;
  if (req.headers && req.headers[ 'content-type' ] && req.headers[ 'content-type' ].indexOf('multipart/form-data') !== -1) {
    if (req.query.encryptfiles) {
      return periodic.core.files.uploadMiddlewareHandler({
        periodic,
        sizeLimit,
        acceptedMIMETypes,
        encrypted_client_side: true,
        encryption_key,
        save_file_to_asset: (typeof req.save_file_to_asset==='boolean')? req.save_file_to_asset: true,
        send_response: (typeof req.send_response ==='boolean') ? req.send_response : false,
      })(req, res, next);
    } else {
      return periodic.core.files.uploadMiddlewareHandler({
        periodic,
        sizeLimit,
        acceptedMIMETypes,
        save_file_to_asset: (typeof req.save_file_to_asset==='boolean')? req.save_file_to_asset: true,
        send_response: (typeof req.send_response === 'boolean') ? req.send_response : false,
        pre_asset_create_map: ({ req, res, periodic, }) => {
          return asset => {
            asset.attributes.location = asset.attributes.location.replace(/\s/g, '%20');
            return asset;
          };
        },
      })(req, res, next);
    }
    // return assetController.multiupload(req, res, next);
  } else {
    next();
  }
};

const handleFileAssets = function(req, res, next) {
  if (req.query.handleupload || req.controllerData.handleupload || req.body.handleupload) {
    // req.query.format = 'json';
    // return assetController.create_assets_from_files(req, res, next);
  } else {
    next();
  }
};

const handleFileAssetsResponse = function(req, res, next) {
  if (req.query.handleupload || req.controllerData.handleupload || req.body.handleupload) {
    // req.query.format = 'json';
    return handleControllerDataResponse(req, res);
  } else {
    next();
  }
};

const handleControllerDataResponse = function(req, res) {
  //console.log('req.controllerData',req.controllerData);
  delete req.controllerData.authorization_header;
  res.send((req.controllerData.useSuccessWrapper) ? {
    result: 'success',
    data: req.controllerData,
  } : req.controllerData);
};

const getDBStats = (req, res, next) => {
  let databaseCountData = [];
  let databaseFeedData = [];
  req.controllerData = (req.controllerData) ? req.controllerData : {};

  const datas = Array.from(periodic.datas.entries());
  const datasList = datas.map(utilities.data.getDatasFromMap);
  let dataDocs = [];
  const countData = [];
  req.controllerData = Object.assign({}, req.controllerData);

  Promisie.map(datasList, 5, utilities.data.getRecentData)
    .then(result => {
      // result.forEach(addDataToReturnArray.bind(dataDocs));
      result.forEach(recentData => {
        dataDocs.push(...recentData.docs);
        countData.push(recentData.modelData);
      });
      dataDocs = dataDocs.map(dataDocFromDB => {
        const dataDoc = (dataDocFromDB.toJSON) ? dataDocFromDB.toJSON() : dataDocFromDB;
        if (!dataDoc.entitytype && dataDoc.source && dataDoc.periodic_compatibility && dataDoc.periodic_config) {
          dataDoc.entitytype = 'extension';
        }
        if (!dataDoc.entitytype && dataDoc.filepath && dataDoc.config) {
          dataDoc.entitytype = 'configuration';
          dataDoc.name = dataDoc.filepath;
        }

        if (! dataDoc.name && dataDoc.identification && dataDoc.identification.guid ) {
          dataDoc.name = dataDoc.identification.guid;
        }
        if (!dataDoc.name ) {
          dataDoc.name = dataDoc._id;
        }
        if (!dataDoc.title && dataDoc.name ) {
          dataDoc.title = dataDoc.name;
        }
        if (!dataDoc.description ) {
          dataDoc.description = dataDoc.msg || dataDoc.title || dataDoc.name;
        }
        // if (dataDoc.createdat && dataDoc.updatedat) {
        // }

        dataDoc.createdfrom = moment(dataDoc.createdat).fromNow();
        dataDoc.updatedfrom = moment(dataDoc.updatedat).fromNow();
        return dataDoc;
      });
      databaseFeedData = dataDocs.sort(periodic.core.utilities.sortObject('desc', 'updatedat'));
      databaseCountData = countData;
      // req.controllerData.countData = countData;
      //   next();
      // })
      // .then(results => {
      const totalItems = databaseCountData.map(datam => datam.count).reduce((result, key) => result + key, 0);
      const data = databaseCountData.map((datum, i) => {
        return {
          name: capitalize(pluralize(datum.collection)),
          docs: datum.count,
          count: datum.count,
          percent: ((datum.count / totalItems) * 100).toFixed(2),
          fill: colors[i].HEX,
        };
      });
      const numeralFormat = '0.0a';
      databaseFeedData = databaseFeedData.sort(CoreUtilities.sortObject('desc', 'updatedat'));

      const extensions = Array.from(periodic.extensions.values());
      req.controllerData.contentcounts = {
        data,
        databaseFeedData,
        databaseCountData,
        totalItems: numeral(totalItems).format(numeralFormat),
        totalCollections: numeral(databaseCountData.length).format(numeralFormat),
        totalExtensions: numeral(extensions.length).format(numeralFormat),
        extensions: extensions,
        appname: appSettings.name,
      };
      next();
    })
    .catch(next);
};

function getAppSettings(req, res, next) {
  req.controllerData = Object.assign({}, req.controllerData);
  req.controllerData.appSettings = periodic.settings;
  req.controllerData.editorProps = {
    lineNumbers: true,
    value: JSON.stringify(periodic.settings, null, 2),
    options: {
      readOnly: true,
    },
    lineWrapping:true,
  };
  next();
}

function updateUserProfile(req, res, next) {
  try {
    const passportUtil = periodic.locals.extensions.get('periodicjs.ext.passport');
    const entitytype = req.user.entitytype || utilities.auth.getEntityTypeFromReq({
      req, 
    });
    const CoreDataProfile = passportUtil.auth.getAuthCoreDataModel({ entitytype, });
    const assetsToUpdate = req.controllerData.standard_asset; 
    const profileData = (req.user.toJSON) ? req.user.toJSON() : req.user;
    const updatePrimaryAsset = (assetsToUpdate && assetsToUpdate.length) ? {
      primaryasset : assetsToUpdate[0]._id,
    } :{};
    const updatePrimaryAssetRA = (assetsToUpdate && assetsToUpdate.length) ? {
      primaryasset : assetsToUpdate[0],
      profile_image_preview : assetsToUpdate[0].fileurl,
    } :{};
    const updatePrimaryAssets = (assetsToUpdate && assetsToUpdate.length) ? {
      assets: (profileData.assets && profileData.assets.length)
        ? profileData.assets.map(asset=>asset._id).concat(assetsToUpdate.map(asset=>asset._id))
        : assetsToUpdate.map(asset=>asset._id),
    } :{};
    const updatePrimaryAssetsRA = (assetsToUpdate && assetsToUpdate.length) ? {
      assets: (profileData.assets && profileData.assets.length)
        ? profileData.assets.concat(assetsToUpdate)
        : assetsToUpdate,
    } :{};
    const updatedProfile = Object.assign({},
      profileData,
      req.body,
      updatePrimaryAsset,
      updatePrimaryAssets);
    const updatedProfileRA = Object.assign({},
      profileData,
      req.body,
      updatePrimaryAssetRA,
      updatePrimaryAssetsRA);
    CoreDataProfile.update({
      updatedoc: updatedProfile,
      depopulate: false,
    })
      .then(updatedUser => {
        res.send(Object.assign({}, updatedProfileRA, {
          status: 200,
          result: 'success',
          data: {
            updatedresponse: updatedUser,
          },
          userdata: updatedProfileRA,
        }));
      })
      .catch(next);
      
  } catch (e) {
    next(e);  
  }
}

module.exports = {
  approveOptionsRequest,
  fixCodeMirrorSubmit,
  fixFlattenedSubmit,
  handleFileUpload,
  handleFileAssets,
  decryptAsset,
  handleControllerDataResponse,
  handleFileAssetsResponse,
  getDBStats,
  getAppSettings,
  updateUserProfile,
};