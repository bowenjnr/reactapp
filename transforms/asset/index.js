'use strict';
const prettysize = require('prettysize');
const periodic = require('periodicjs');
const helper = require('../helper');
const https = require('https');
const http = require('http');
const fs = require('fs-extra');
const path = require('path');
const dms2dec = require('dms2dec');
const ExifImage = require('exif').ExifImage;

function formatAssetIndex(req) {
  return new Promise((resolve, reject) => {
    try {
      // console.log('formatAssetIndex', req.controllerData)
      req.controllerData.standard_assets.standard_assets = req.controllerData.standard_assets.standard_assets.map(asset => {
        asset = helper.getControllerDataEntity(asset);
        asset.transform = Object.assign({}, asset.transform);
        asset.transform.attributes = [];
        if (asset.assettype.match('image')) {
          asset.transform.exif = (asset.attributes && asset.attributes.exif_data) ?
            (asset.attributes.exif_data && asset.attributes.exif_data.gps && Object.keys(asset.attributes.exif_data.gps).length) ?
            'fa fa-map' :
            false :
            'fa fa-map-o';
        }
        asset.transform.encrypted = (asset.attributes && asset.attributes.encrypted_client_side) ? 'fa fa-lock' : false;
        asset.transform.fileurl = helper.getFileURL({ asset, periodic, req, skip_decryption: true, });
        let assetpreviewImg = helper.getAssetPreview(asset);
        asset.transform.preview = `${
            (req.headers.origin === 'http://localhost:3000' && assetpreviewImg.indexOf('http') === -1)
              ? 'http://localhost:8786'
              : ''}${assetpreviewImg}`;
        asset.transform.size = prettysize(asset.size);
        if (asset.transform.exif) {
          asset.transform.attributes.push(asset.transform.exif);
        }
        if (asset.transform.encrypted) {
          asset.transform.attributes.push(asset.transform.encrypted);
        }
        // console.log({ asset });
        return asset;
      });
      resolve(req);
    } catch (e) {
      reject(e);
    }
  });
}

function formatAssetItem(req) {
  return new Promise((resolve, reject) => {
    try {
      let asset = helper.getControllerDataEntity(req.controllerData.standard_asset);
      asset.transform = Object.assign({}, asset.transform);
      // console.log({ asset },' prettysize(asset.size)', prettysize(asset.size));
      asset.transform.encrypted = (asset.attributes.encrypted_client_side) ? 'true' : 'false';
      asset.transform.fileurl = helper.getFileURL({ asset, periodic, req, });

      let assetpreviewImg = helper.getAssetPreview(asset);
      asset.transform.previewimage = `${
        (req.headers.origin === 'http://localhost:3000' && assetpreviewImg.indexOf('http') === -1)
          ? 'http://localhost:8786'
          : ''}${assetpreviewImg}`;
      asset.transform.size = prettysize(asset.size);
      // console.log('format asset', { asset });
      req.controllerData.standard_asset = asset;
      resolve(req);
    } catch (e) {
      reject(e);
    }
  });
}

function getFileMetaInfo(req) {
  var exifDataJSON;
  return new Promise((resolve, reject) => {
    try {
      // let asset = helper.getControllerDataEntity(req.controllerData.asset);
      // // console.log('get_file_meta_info',{ asset });
      // asset.transform = Object.assign({}, asset.transform);
      // if (asset.assettype !== 'image/jpeg' || (asset.attributes && asset.attributes.exif_data && Object.keys(asset.attributes.exif_data).length)) {
      //   resolve(req);
      // } else {
      //   let temp_dir = path.resolve(__dirname, '../../../../content/files/temp');
      //   fs.ensureDirSync(temp_dir);
      //   let temp_file_path = path.join(temp_dir, asset.attributes.periodicFilename);
      //   let temp_file_write_stream = fs.createWriteStream(temp_file_path);
      //   let fetchMethod = (asset.transform.fileurl.indexOf('https://') !== -1) ?
      //     https :
      //     http;
      //   let removeTempFile = () => {
      //     fs.removeSync(temp_file_path);
      //   };
      //   let get_exif_data = () => {
      //     try {
      //       let exifDataImage = new ExifImage({
      //         image: temp_file_path,
      //       }, function(error, exifData) {
      //         if (error) {
      //           exifDataJSON = { image: {}, exif: {}, gps: {}, error: error.toString(), };
      //           update_file_attributes();
      //           removeTempFile();
      //         } else {
      //           if (exifData.gps && exifData.gps.GPSLatitude && exifData.gps.GPSLatitudeRef && exifData.gps.GPSLongitude && exifData.gps.GPSLongitudeRef) {
      //             exifData.gps.GPSLatLongDecimal = dms2dec(exifData.gps.GPSLatitude, exifData.gps.GPSLatitudeRef, exifData.gps.GPSLongitude, exifData.gps.GPSLongitudeRef);
      //           }
      //           if (exifData.exif) {
      //             exifData.exif.MakerNote = undefined;
      //             exifData.exif.ComponentsConfiguration = undefined;
      //             exifData.exif.ExifVersion = undefined;
      //             exifData.exif.FlashpixVersion = undefined;
      //             exifData.exif.SceneType = undefined;
      //           }
      //           exifDataJSON = exifData;
      //           update_file_attributes();
      //           removeTempFile();
      //         }
      //       });
      //     } catch (error) {
      //       removeTempFile();
      //       reject(error);
      //     }
      //   };
      //   let update_file_attributes = () => {
      //     asset.attributes.exif_data = exifDataJSON;
      //     // console.log({ exifDataJSON, });
      //     periodic.app.controller.native.asset.updateModel({ //theres no promisified verison
      //       id: asset._id,
      //       updatedoc: asset,
      //       req,
      //       callback: function(err, data) {
      //         if (err) {
      //           reject(err);
      //         } else {
      //           req.controllerData.asset = asset;
      //           resolve(req);
      //         }
      //       },
      //     });

      //   };
      //   // console.log('asset.transform.fileurl', asset.transform.fileurl,{temp_file_write_stream});
      //   fetchMethod.get(asset.transform.fileurl, (https_download_response) => {
      //     // console.log('in download funciton',{fetchMethod})
      //     https_download_response.pipe(temp_file_write_stream);

      //     https_download_response.on('error', reject);
      //     temp_file_write_stream.on('finish', () => {
      //       get_exif_data();
      //     });
      //   });

      // }
    } catch (e) {
      reject(e);
    }
  });
}

module.exports = {
  formatAssetIndex,
  formatAssetItem,
  getFileMetaInfo,
};