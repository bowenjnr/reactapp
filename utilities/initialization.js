'use strict';
const periodic = require('periodicjs');
const flatten = require('flat');
const controllerhelper = require('./controllerhelper');
const helpers = require('./manifest/helpers');
const data_tables = require('./manifest/table/data_tables');
const oauth2ServerUtils = periodic.locals.extensions.get('periodicjs.ext.oauth2server');
const logger = periodic.logger;
let initialReactAppConfig = {};
let intialReactAppClient;
let reactAppConfig = {};
const styles = require('./styles');

const configurationHelperText = {
  component: 'code',
  props: {
    style:styles.codeSample.code,
  },
  children: [
    {
      component: 'em',
      props: {
        style:styles.codeSample.codeEm,
      },
      children:'//creating configurations',
    },
    {
      component:'br',
    },
    {
      component: 'div',
      children:'$ periodicjs cco [type] [name] [environment] [path/to/output/config/json]',
    },
    {
      component: 'div',
      children:'$ periodicjs createConfig [type] [name] [environment] [path/to/output/config/json]',
    },
    {
      component:'br',
    },
    {
      component: 'em',
      props: {
        style:styles.codeSample.codeEm,
      },
      children:'//types: app|application|ext|extension|ext-local|extension-local|con|container|con-local|container-local',
    },
    {
      component:'br',
    },
    {
      component: 'em',
      props: {
        style:styles.codeSample.codeEm,
      },
      children:'//example creating configuration',
    },
    {
      component:'br',
    },
    {
      component: 'div',
      children:'$ periodicjs createConfig ext periodicjs.ext.dbseed development ~/Desktop/dev.dbseed-config.json',
    },
    {
      component:'br',
    },
    {
      component: 'em',
      props: {
        style:styles.codeSample.codeEm,
      },
      children:'//add configuration',
    },
    {
      component:'br',
    },
    {
      component: 'div',
      children:'$ periodicjs aco [path/to/configuration/json]',
    },
    {
      component: 'div',
      children:'$ periodicjs addConfig [path/to/configuration/json]',
    },
    {
      component: 'div',
      children:'$ node index.js --cli --crud=ext --crud_op=create --crud_arg=[path/to/configuration/json]',
    },
    {
      component:'br',
    },
    {
      component: 'em',
      props: {
        style:styles.codeSample.codeEm,
      },
      children:'//example manually adding configuration',
    },
    {
      component:'br',
    },
    {
      component: 'div',
      children:'$ periodicjs addConfig /home/myuser/documents/projects/appconfig-dev.json',
    },
    {
      component:'br',
    },
    {
      component: 'em',
      props: {
        style:styles.codeSample.codeEm,
      },
      children:'//remove configuration',      
    },
    {
      component:'br',
    },
    {
      component: 'div',
      children:'$ periodicjs rco [id-of-configuration-doc]',
    },
    {
      component: 'div',
      children:'$ periodicjs removeConfig [id-of-configuration-doc]',
    },
    {
      component: 'div',
      children:'$ node index.js --cli --crud=ext --crud_op=remove --crud_arg=[id-of-configuration-doc]',
    },
    {
      component:'br',
    },
    {
      component: 'em',
      props: {
        style:styles.codeSample.codeEm,
      },
      children:'//example manually removing bdb7aa6485aebe8ac81992def07c6f96',      
    },
    {
      component:'br',
    },
    {
      component: 'div',
      children:'$ periodicjs removeConfig bdb7aa6485aebe8ac81992def07c6f96',
    },
  ],
};
const extensionHelperText = {
  component: 'code',
  props: {
    style:styles.codeSample.code,
  },
  children: [
    {
      component: 'em',
      props: {
        style:styles.codeSample.codeEm,
      },
      children:'//add extension',
    },
    {
      component:'br',
    },
    {
      component: 'div',
      children:'$ periodicjs aex [name-of-extension]',
    },
    {
      component: 'div',
      children:'$ periodicjs addExtension [name-of-extension]',
    },
    {
      component: 'div',
      children:'$ node index.js --cli --crud=ext --crud_op=create --crud_arg=[name-of-extension]',
    },
    {
      component:'br',
    },
    {
      component: 'em',
      props: {
        style:styles.codeSample.codeEm,
      },
      children:'//example manually adding periodicjs.ext.passport',
    },
    {
      component:'br',
    },
    {
      component: 'div',
      children:'$ npm i periodicjs.ext.passport',
    },
    {
      component: 'div',
      children:'$ periodicjs addExtension periodicjs.ext.passport',
    },
    {
      component:'br',
    },
    {
      component: 'em',
      props: {
        style:styles.codeSample.codeEm,
      },
      children:'//remove extension',
    },
    {
      component:'br',
    },
    {
      component: 'div',
      children:'$ periodicjs rex [name-of-extension]',
    },
    {
      component: 'div',
      children:'$ periodicjs removeExtension [name-of-extension]',
    },
    {
      component: 'div',
      children:'$ node index.js --cli --crud=ext --crud_op=remove --crud_arg=[name-of-extension]',
    },
    {
      component:'br',
    },
    {
      component: 'em',
      props: {
        style:styles.codeSample.codeEm,
      },
      children:'//example manually removing periodicjs.ext.passport',
    },
    {
      component:'br',
    },
    {
      component: 'div',
      children:'$ periodicjs removeExtension periodicjs.ext.passport',
    },
    {
      component: 'div',
      children:'$ npm rm periodicjs.ext.passport',
    },
  ],
};

function getDefaultIndexTableFields() {
  const reactAppConfig = periodic.settings.extensions['@digifi-los/reactapp'];
  const adminRoute = helpers.getManifestPathPrefix(reactAppConfig.adminPath);

  function getUserTableHeader(schemaName) {
    return [
      data_tables.tableField({
        field: 'email',
        link: true,
        headerStyle: {
          maxWidth: 200,
          overflow: 'hidden',
          textOverflow: 'ellipsis',
        },
        columnStyle: {
          maxWidth: 200,
          overflow: 'hidden',
          textOverflow: 'ellipsis',
        },
      })({ adminRoute, schemaName, }),
      data_tables.tableCreatedDate(),
      data_tables.tableField({
        title: 'First Name',
        field: 'firstname',
      })({ adminRoute, schemaName, }),
      data_tables.tableField({
        title: 'Last Name',
        field: 'lastname',
      })({ adminRoute, schemaName, }),
      data_tables.tableField({
        // title: 'Last Name',
        field: 'activated',
      })({ adminRoute, schemaName, }),
      data_tables.tableField({
        title: 'User Roles',
        field: 'userroles',
      })({ adminRoute, schemaName, }),
      data_tables.tableField({
        title: 'Account Type',
        field: 'accounttype',
      })({ adminRoute, schemaName, }),
      data_tables.tableOptions({ adminRoute, schemaName, }),
    ];
  }
  return {
    standard_user: getUserTableHeader('standard_user'),
    standard_account: getUserTableHeader('standard_account'),
    standard_userrole: [
      data_tables.tableField({
        field: 'name',
        link: true,
        headerStyle: {
          maxWidth: 150,
          // overflow: 'hidden',
          // textOverflow: 'ellipsis',
        },
        columnStyle: {
          maxWidth: 150,
          // overflow: 'hidden',
          // textOverflow: 'ellipsis',
        },
      })({ adminRoute, schemaName: 'standard_userrole', }),
      data_tables.tableField({
        title: 'Role ID',
        field: 'userroleid',
      })({ adminRoute, schemaName: 'standard_userrole', }),
      data_tables.tableField({
        title: 'Privileges',
        field: 'privileges',
      })({ adminRoute, schemaName: 'standard_userrole', }),
      data_tables.tableField({
        title: 'Description',
        field: 'description',
      })({ adminRoute, schemaName: 'standard_userrole', }),
      data_tables.tableOptions({ adminRoute, schemaName: 'standard_userrole', }),
    ],
    standard_userprivilege: [
      data_tables.tableField({
        field: 'name',
        link: true,
        headerStyle: {
          maxWidth: 150,
          // overflow: 'hidden',
          // textOverflow: 'ellipsis',
        },
        columnStyle: {
          maxWidth: 150,
          // overflow: 'hidden',
          // textOverflow: 'ellipsis',
        },
      })({ adminRoute, schemaName: 'standard_userprivilege', }),
      data_tables.tableField({
        title: 'Privilege ID',
        field: 'userprivilegeid',
      })({ adminRoute, schemaName: 'standard_userprivilege', }),
      data_tables.tableField({
        title: 'Label',
        field: 'label',
      })({ adminRoute, schemaName: 'standard_userprivilege', }),
      data_tables.tableField({
        title: 'Description',
        field: 'description',
      })({ adminRoute, schemaName: 'standard_userprivilege', }),
      data_tables.tableOptions({ adminRoute, schemaName: 'standard_userprivilege', }),
    ],
    standard_asset: [
      data_tables.tableField({
        field: 'name',
        link: true,
        headerStyle: {
          maxWidth: 150,
          // overflow: 'hidden',
          // textOverflow: 'ellipsis',
        },
        columnStyle: {
          maxWidth: 150,
          // overflow: 'hidden',
          // textOverflow: 'ellipsis',
        },
      })({ adminRoute, schemaName: 'standard_asset', }),
      data_tables.tableCreatedDate({}),
      data_tables.tableField({
        title: 'Size',
        field: 'transform.size',
      })({ adminRoute, schemaName: 'standard_asset', }),
      data_tables.tableField({
        title: 'Attributes',
        icon: true,
        field: 'transform.attributes',
      })({ adminRoute, schemaName: 'standard_asset', }),
      // data_tables.tableField({
      //   title: 'Encrypted',
      //   icon: true,
      //   field: 'transform.encrypted',
      // }),
      // data_tables.tableField({
      //   title: 'Exif',
      //   icon: true,
      //   field: 'transform.exif',
      // }),
      data_tables.tableField({
        title: 'Preview',
        image: true,
        field: 'transform.preview',
      })({ adminRoute, schemaName: 'standard_asset', }),
      data_tables.tableOptions({ adminRoute, schemaName: 'standard_asset', }),
    ],
    configuration: [
      data_tables.tableField({
        field: 'filepath',
        link: true,
        headerStyle: {
          maxWidth: 350,
          overflow: 'hidden',
          textOverflow: 'ellipsis',
        },
        columnStyle: {
          maxWidth: 350,
          overflow: 'hidden',
          textOverflow: 'ellipsis',
        },
      })({ adminRoute, schemaName: 'configuration', }),
      data_tables.tableField({
        // title: 'Size',
        field: 'environment',
      })({ adminRoute, schemaName: 'configuration', }),
      data_tables.tableField({
        field: 'container',
      })({ adminRoute, schemaName: 'configuration', }),
      data_tables.tableCreatedDate({}),
      data_tables.tableOptions({ adminRoute, schemaName: 'configuration', }),
    ],
    extension: [
      data_tables.tableField({
        field: 'name',
        link: true,
        headerStyle: {
          maxWidth: 250,
          // overflow: 'hidden',
          // textOverflow: 'ellipsis',
        },
        columnStyle: {
          maxWidth: 250,
          // overflow: 'hidden',
          // textOverflow: 'ellipsis',
        },
      })({ adminRoute, schemaName: 'extension', }),
      data_tables.tableField({
        field: 'source',
      })({ adminRoute, schemaName: 'extension', }),
      data_tables.tableField({
        field: 'version',
      })({ adminRoute, schemaName: 'extension', }),
      data_tables.tableField({
        title: 'Type',
        field: 'periodic_type',
      })({ adminRoute, schemaName: 'extension', }),
      data_tables.tableField({
        title: 'Priority',
        field: 'periodic_priority',
      })({ adminRoute, schemaName: 'extension', }),
      data_tables.tableField({
        title: 'Compatibility',
        field: 'periodic_compatibility',
      })({ adminRoute, schemaName: 'extension', }),
      data_tables.tableCreatedDate({}),
      data_tables.tableOptions({ adminRoute, schemaName: 'extension', }),
    ],
  };
}

function getAdditionalJSFiles() {
  const extensions = Array.from(periodic.extensions.values());
  const additional_files = extensions.reduce((result, ext) => { 
    if (ext.periodic_config && ext.periodic_config.additional_footer_js && Array.isArray(ext.periodic_config.additional_footer_js)) {
      result.footer.push(...ext.periodic_config.additional_footer_js);
    }
    if (ext.periodic_config && ext.periodic_config.additional_header_js && Array.isArray(ext.periodic_config.additional_header_js)) {
      result.header.push(...ext.periodic_config.additional_header_js);
    }
    return result;
  },
    {
      header: [],
      footer: [],
    });
  return additional_files;
}

function setInitialIndexTable() {
  const reactAppConfig = periodic.settings.extensions['@digifi-los/reactapp'];
  periodic.settings.extensions[ '@digifi-los/reactapp' ].data_tables = Object.assign({}, getDefaultIndexTableFields(), periodic.settings.extensions[ '@digifi-los/reactapp' ].data_tables);
  periodic.settings.extensions[ '@digifi-los/reactapp' ].extension_overrides.customIndexPageComponents = Object.assign({},
    periodic.settings.extensions[ '@digifi-los/reactapp' ].extension_overrides.customIndexPageComponents, {
      configuration: configurationHelperText,
      extension: extensionHelperText,
    });
  periodic.settings.extensions[ '@digifi-los/reactapp' ].extension_overrides.customDetailPageComponents = Object.assign({},
    periodic.settings.extensions[ '@digifi-los/reactapp' ].extension_overrides.customDetailPageComponents, {
      configuration: configurationHelperText,
      extension: extensionHelperText,
    });
  
    // settings.auth.enforce_mfa
  // console.log("periodic.settings.extensions[ 'periodicjs.ext.reactapp' ].auth", periodic.settings.extensions[ 'periodicjs.ext.reactapp' ].auth);
  // console.log('getDefaultIndexTableFields()', getDefaultIndexTableFields())
  periodic.settings.extensions[ '@digifi-los/reactapp' ].additional_js_files = Object.assign({}, periodic.settings.extensions[ '@digifi-los/reactapp' ].additional_js_files, getAdditionalJSFiles());
  if (reactAppConfig && reactAppConfig.includeCoreData && reactAppConfig.includeCoreData.manifest) {
    let task = setImmediate(() => {
      controllerhelper.setCoreDataConfigurations();
      clearImmediate(task);
    });
  }
}

function init() {
  const configurationDB = periodic.datas.get('configuration');
  const appEnvironment = periodic.settings.application.environment;
  const reactAppConfigFilepath = `content/config/extensions/periodicjs.ext.reactapp/${appEnvironment}.json`;
  Promise.all([
    configurationDB.load({
      query: {
        filepath: reactAppConfigFilepath,
      },
    }),
    periodic.datas.get('standard_client').load({
      query: {
        name: 'reactapp',
      },
    }),
  ])
    .then(results => {
      const [dbReactAppConfig, dbReactAppClient,] = results;
      // console.log({ dbReactAppConfig, dbReactAppClient })
      initialReactAppConfig = dbReactAppConfig;
      intialReactAppClient = dbReactAppClient;
      if (!dbReactAppClient) {
        return oauth2ServerUtils.client.create({ name: 'reactapp', });
      } else {
        return true;
      }
    })
    .then(createdClient => {
      if (!intialReactAppClient) {
        intialReactAppClient = (typeof createdClient.toJSON === 'function') ? createdClient.toJSON() : createdClient;
      }
      if (initialReactAppConfig && initialReactAppConfig.config && initialReactAppConfig.config.settings && initialReactAppConfig.config.settings.login && initialReactAppConfig.config.settings.login.url && initialReactAppConfig.config.settings && initialReactAppConfig.config.settings.login && initialReactAppConfig.config.settings.login.options && initialReactAppConfig.config.settings.login.options.headers && initialReactAppConfig.config.settings.login.options.headers.clientid) {
        logger.silly('Already configured ReactApp');
        return true;
      } else {
        if (initialReactAppConfig && initialReactAppConfig.config && initialReactAppConfig.config.settings && initialReactAppConfig.config.settings.login && initialReactAppConfig.config.settings.login.url) {
          reactAppConfig.login = {
            url: initialReactAppConfig.config.settings.login.url,
          };
        } else {
          reactAppConfig.login = {
            url: periodic.settings.application.protocol + periodic.settings.application.url + '/api/jwt/token',
            options: {
              headers: {
                clientid: intialReactAppClient.client_id,
              },
            },
          };
          reactAppConfig.userprofile = Object.assign({}, reactAppConfig.login);
          reactAppConfig.userprofile.url = periodic.settings.application.protocol + periodic.settings.application.url + '/api/jwt/profile';
        }
        reactAppConfig.basename = periodic.settings.application.protocol + periodic.settings.application.url;
        reactAppConfig.name = periodic.settings.name;
        reactAppConfig.title = periodic.settings.name;
        reactAppConfig.application = {
          environment: periodic.settings.application.environment,
        };
        configurationDB.create({
          newdoc: {
            filepath: reactAppConfigFilepath,
            environment: appEnvironment,
            config: {
              settings: reactAppConfig,
            },
            container: periodic.settings.container.name,
          },
        }).then(createdReactAppConfig => {
          logger.silly('created initial react app config');
          periodic.settings.extensions[ '@digifi-los/reactapp' ] = flatten.unflatten(
            Object.assign({},
              flatten(periodic.settings.extensions[ '@digifi-los/reactapp' ] || {}),
              flatten(reactAppConfig || {})
            )
          );
          return true;
        })
        .catch(logger.error);
      }
    })
    .then(configStatus => {
      setInitialIndexTable();
      logger.silly({ configStatus, });
    })
    .catch(logger.error);
}

module.exports = {
  configurationHelperText,
  extensionHelperText,
  getDefaultIndexTableFields,
  setInitialIndexTable,
  getAdditionalJSFiles,
  init,
};