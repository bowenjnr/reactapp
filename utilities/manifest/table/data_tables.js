'use strict';
const pluralize = require('pluralize');
const capitalize = require('capitalize');
const helpers = require('../helpers');

const tableField = function(headingOptions) {
  let { title, field, link, } = headingOptions;
  return function(options) {
    const { schemaName } = options;
    // let usablePrefix = helpers.getDataPrefix(options.prefix);
    // let manifestPrefix = helpers.getManifestPathPrefix(options.prefix);
    return {
      label: title || capitalize(field || schemaName),
      sortid: field || schemaName,
      sortable: true,
      image: headingOptions.image,
      imageProps: {
        style: {
          maxHeight: '4rem',
          maxWidth: '4rem',
          overflow: 'hidden',
        },
        alt: title || capitalize(field || schemaName),
      },
      icon: headingOptions.icon,
      iconProps: {
        title: title || capitalize(field || schemaName),
      },
      'link': (link) ? {
        'baseUrl': `${helpers.getContainerPath(options)}/:id`,
        'params': [{ 'key': ':id', 'val': '_id', }, ],
      } : undefined,
      'linkProps': (link) ? {
        'style': {
          'textDecoration': 'none',
        },
      } : undefined,
      headerColumnProps: {
        style: headingOptions.headerStyle,
      },
      columnProps: {
        style: headingOptions.columnStyle,
      },
    };
  };
};

const tableTitle = function(options) {
  // let usablePrefix = helpers.getDataPrefix(options.prefix);
  // const manifestPrefix = helpers.getManifestPathPrefix(options.adminRoute);
  return {
    label: 'Title',
    sortid: 'title',
    sortable: true,
    'link': {
      'baseUrl': `${helpers.getContainerPath(options)}/:id`,
      'params': [{ 'key': ':id', 'val': '_id', }, ],
    },
    'linkProps': {
      'style': {
        'textDecoration': 'none',
      },
    },
  };
};

const tableCreatedDate = function(options) {
  // let usablePrefix = helpers.getDataPrefix(options.prefix);
  // let manifestPrefix = helpers.getManifestPathPrefix(options.prefix);
  return {
    label: 'Create Date',
    sortid: 'createdat',
    sortable: true,
    momentFormat: 'MM/DD/YYYY |  hh:mm:ssa',
    headerColumnProps: {
      style: {
        minWidth: 160,
      },
    },
    columnProps: {
      style: {
        minWidth: 160,
      },
    },
  };
};

const tableTaxonomy = function(options) {
  // let usablePrefix = helpers.getDataPrefix(options.prefix);
  // let manifestPrefix = helpers.getManifestPathPrefix(options.prefix);
  return {
    label: 'Taxonomy',
    sortid: 'name',
    sortable: true,
  };
};

const tableOptions = function(options) {
  return {
    label: 'Options',
    headerColumnProps: {
      style: {
        minWidth: 70,
      },
    },
    columnProps: {
      style: {
        minWidth: 70,
      },
    },
    sortable: true,
    'buttons': [{
        'children': '',
        'passProps': {
          'onClick': 'func:this.props.reduxRouter.push',
          'onclickBaseUrl': `${helpers.getContainerPath(options)}/:id`,
          'onclickLinkParams': [{ 'key': ':id', 'val': '_id', }, ],

          buttonProps: {
            icon: 'fa fa-pencil',
            // color:'isDanger', 
            isIconRight: true,
            size: 'isSmall',
            className: '__reactapp_icon_button',
          },
          style: {
            marginRight: 10,
          },
        },
      },
      {
        'children': '',
        'passProps': {
          'onClick': 'func:this.props.fetchAction',
          'onclickBaseUrl': `${helpers.getDataRoute(options)}/:id?format=json`,
          'onclickLinkParams': [{ 'key': ':id', 'val': '_id', }, ],
          'fetchProps': {
            'method': 'DELETE',
          },
          successProps: {
            success: {
              notification: {
                text: 'Deleted',
                timeout: 4000,
                type: 'success',
              },
            },
            successCallback: 'func:this.props.reduxRouter.push',
            successProps: `${helpers.getContainerPath(options)}`,
          },
          'confirmModal': {},
          buttonProps: {
            icon: 'fa fa-times',
            color: 'isDanger',
            isIconRight: true,
            size: 'isSmall',
            className: '__reactapp_icon_button',
          },
        },
      },
    ],
  };
};

module.exports = {
  tableField,
  tableTitle,
  tableCreatedDate,
  tableTaxonomy,
  tableOptions,
};