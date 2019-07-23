'use strict';

// const DICTIONARY = require('../dictionary');
const capitalize = require('capitalize');
const pluralize = require('pluralize');
const contenttabs = require('./components/contenttabs');
const indextable = require('./components/indextable');
const buildDetail = require('./components/build_detail');
const buildAdvancedDetail = require('./components/build_advanced_detail');
const helpers = require('./helpers');
// pluralize.addIrregularRule('data', 'datas');

/**
 * This constructs a mongo schema detail page
 *
 * @param {*} schema 
 * @param {*} label 
 * @param {*} options 
 */
const constructDetail = function(options) {
  const { newEntity, schemaName, } = options;
  let dataRoutePrefix = helpers.getDataRoute(options);
  let manifestPrefix = helpers.getManifestPathPrefix(options.adminRoute);
  let customPageData = helpers.getCustomSchemaOverrideProperty(Object.assign({ field: 'customDetailPageData', }, options)) || helpers.getCustomOverrideProperty(Object.assign({ field: 'customDetailPageData', }, options));
  let customTabs = helpers.getCustomSchemaOverrideProperty(Object.assign({ field: 'customDetailTabs', }, options)) || helpers.getCustomOverrideProperty(Object.assign({ field: 'customDetailTabs', }, options));
  let customHeader = helpers.getCustomSchemaOverrideProperty(Object.assign({ field: 'customDetailHeader', }, options)) || helpers.getCustomOverrideProperty(Object.assign({ field: 'customDetailHeader', }, options));
  let customDetailEditor = helpers.getCustomSchemaOverrideProperty(Object.assign({ field: 'customDetailEditor', }, options)) || helpers.getCustomOverrideProperty(Object.assign({ field: 'customDetailEditor', }, options));
  let customDetailPageComponents =  helpers.getCustomSchemaOverrideProperty(Object.assign({ field: 'customDetailPageComponents', }, options)) || helpers.getCustomOverrideProperty(Object.assign({ field: 'customDetailPageComponents', }, options)) || []; 
  if (!customDetailPageComponents.component) {
    customDetailPageComponents = [];
  }
  let detailPageBasicEditor = {
    name: 'Basic Editor',
    layout: {
      component: 'div',
      children: buildDetail(options),
    },
  };
  let detailPageAdvancedEditor = {
    name: 'Advanced Editor',
    layout: {
      component: 'div',
      children: buildAdvancedDetail(options),
    },
  };
  let detailPageTabs = [];
  if (customDetailEditor && (customDetailEditor.base || customDetailEditor.advanced || customDetailEditor.advanced || customDetailEditor.customTabs)) {
    if (customDetailEditor.base) {
      detailPageTabs.push(detailPageBasicEditor);
    }
    if (customDetailEditor.advanced) {
      detailPageTabs.push(detailPageAdvancedEditor);
    }
    if (customDetailEditor.customTabs && Array.isArray(customDetailEditor.customTabs)) {
      detailPageTabs.push(...customDetailEditor.customTabs);
    } else if (customDetailEditor.customTab) {
      detailPageTabs.push(customDetailEditor.customTabs);
    }
  } else {
    detailPageTabs.push(detailPageBasicEditor, detailPageAdvancedEditor);
  }

  return {
    resources: (newEntity) ? {} : {
      [helpers.getDetailLabel(schemaName)]: `${dataRoutePrefix}/:id?format=json`,

    },
    onFinish: 'render',
    pageData: (customPageData) ?
      customPageData : {
        title: `Content › ${pluralize(capitalize(schemaName))}`,
        navLabel: `Content › ${pluralize(capitalize(schemaName))}`,
      },
    layout: {
      component: 'div',
      props: {
        style: {
          marginTop: 80,
          marginBottom: 80,
          paddingBottom: 80,
        },
      },
      children: [
        customHeader,
        (customTabs) ? customTabs : contenttabs(options),
        {
          component: 'Container',
          props: {},
          children: [{
            component: 'ResponsiveTabs',
            asyncprops: {
              formdata: [helpers.getDetailLabel(schemaName), 'data',],
            },
            props: {
              style: {
                paddingBottom:'1.5rem',
              },
              tabsType: 'navBar',
              tabsProps: {
                style: {
                  border: 'none',
                  fontSize: 14,
                },
              },
              tabgroupProps: {
                style: {
                  border: 'none',
                  fontSize: 14,
                },
                className: '__ra_no_border',
              },
              tabs: detailPageTabs,
            },
            // children:'',
          }, ]
            .concat(customDetailPageComponents),
          // .concat(buildDetail(schema, label, options)),
        },
        // {
        //   component: 'RawStateOutput',
        //   // component: 'RawStateOutput',
        //   props: {
        //     select: 'SOMEFORMDATA',
        //     style: {
        //       padding: '10px',
        //       margin: '10px',
        //       border: '1px solid black',
        //     },
        //   },
        //   asyncprops: {
        //     'SOMEFORMDATA': [
        //       helpers.getDetailLabel(schemaName), 'data'
        //     ],
        //   },
        // },
      ],
    },
  };
};

/**
 * constructs index page
 *
 * @param {*} schema 
 * @param {*} label 
 * @param {*} options 
 */
const constructIndex = function(options = {}) {
  const { schema, schemaName, indexOptions, } = options;

  let dataRoutePrefix = helpers.getDataRoute(options);
  let manifestPrefix = helpers.getManifestPathPrefix(options.adminRoute);
  let customPageData = helpers.getCustomSchemaOverrideProperty(Object.assign({ field: 'customIndexPageData', }, options)) || helpers.getCustomOverrideProperty(Object.assign({ field: 'customIndexPageData', }, options));
  let customTabs =  helpers.getCustomSchemaOverrideProperty(Object.assign({ field: 'customIndexTabs', }, options)) || helpers.getCustomOverrideProperty(Object.assign({ field: 'customIndexTabs', }, options));
  let customHeader =  helpers.getCustomSchemaOverrideProperty(Object.assign({ field: 'customIndexHeader', }, options)) || helpers.getCustomOverrideProperty(Object.assign({ field: 'customIndexHeader', }, options));
  let customIndexButton =  helpers.getCustomSchemaOverrideProperty(Object.assign({ field: 'customIndexButton', }, options)) || helpers.getCustomOverrideProperty(Object.assign({ field: 'customIndexButton', }, options)); 
  let customIndexPageComponents = helpers.getCustomSchemaOverrideProperty(Object.assign({ field: 'customIndexPageComponents', }, options)) || helpers.getCustomOverrideProperty(Object.assign({ field: 'customIndexPageComponents', }, options)) || []; 
  if (!customIndexPageComponents.component) {
    customIndexPageComponents = [];
  }
  // console.log({schemaName,customIndexPageComponents})
  return {
    resources: {
      [helpers.getIndexLabel(schemaName)]: `${dataRoutePrefix}?format=json`,
    },
    onFinish: 'render',
    pageData: (customPageData) ?
      customPageData : {
        title: `Content › ${pluralize(capitalize(schemaName))}`,
        navLabel: `Content › ${pluralize(capitalize(schemaName))}`,
      },
    layout: {
      component: 'div',
      props: {
        style: {
          marginTop: 80,
          marginBottom: 80,
          paddingBottom: 80,
        },
      },
      children: [
        customHeader,
        (customTabs) ? customTabs : contenttabs(options),
        {
          component: 'Container',
          props: {},
          children: [{
            component: 'div',
            props: {
                style: {
                  display: 'flex',
                  flex: 1,
                },
              },
            children: [{
                component: 'Title',
                props: {
                    style: {
                      marginTop: 30,
                      display: 'flex',
                      flex: 1,
                    },
                  },
                children: capitalize(schemaName),
              },
              {
                component: 'ResponsiveButton',
                children: `Create ${capitalize(schemaName)}`,
                props: {
                    onClick: (customIndexButton && customIndexButton.onClick) ?
                      customIndexButton.onClick : 'func:this.props.reduxRouter.push',
                    onclickProps: (customIndexButton && customIndexButton.onclickProps) ?
                      customIndexButton.onclickProps : `${helpers.getContainerPath(options)}/new`,//`${manifestPrefix}/${pluralize(schemaName)}/new`,
                    buttonProps: {
                      size: 'isMedium',
                      color: 'isPrimary',
                    },
                    style: {
                      alignSelf: 'center',
                      textAlign: 'right',
                      // padding: 0,
                    },
                  },
              },
              ],
          },]
            .concat(indextable.indextable(options))
            .concat(customIndexPageComponents),
          
        },
      ],
    },
  };
};

module.exports = {
  constructDetail,
  constructIndex,
};