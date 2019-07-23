'use strict';

const path = require('path');
const capitalize = require('capitalize');
const helpers = require('../helpers');
const data_tables = require('../table/data_tables');
const pluralize = require('pluralize');
// pluralize.addIrregularRule('data', 'datas');

function getAllHeaders(schemas, label, options) {
  // let usablePrefix = helpers.getDataPrefix(options.prefix);
  let manifestPrefix = helpers.getManifestPathPrefix(options.prefix);
  return [{
    label: 'ID',
    sortid: '_id',
    sortable: true,
    'link': {
      'baseUrl': `${manifestPrefix}/${pluralize(schemaName)}/:id`,
      'params': [{ 'key': ':id', 'val': '_id', },],
    },
    'linkProps': {
      'style': {
        'textDecoration': 'none',
        cursor: 'pointer',
      },
    },
  },
  {
    label: 'Create Date',
    sortid: 'createdat',
    sortable: true,
    momentFormat: 'llll',
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
  },
  {
    label: 'Name',
    sortid: 'name',
    sortable: true,
  },
  ].concat(Object.keys(schemas)
    .filter(prop => prop !== 'id' && prop !== 'createdat' && prop !== 'name' && prop !== 'updatedat' && prop !== 'entitytype' && prop !== 'contenttypes' && prop !== 'changes' && prop !== 'attributes' && prop !== 'contenttypeattributes' && prop !== 'content' && prop !== 'extensionattributes')
    .map(key => {
      return {
        label: capitalize(key),
        sortid: key,
      };
    })
  );
}

function getDefaultHeaders(options) {
  const { adminRoute, schema, schemaName, indexOptions, allSchemas, } = options;
  // let usablePrefix = helpers.getDataPrefix(options.prefix);
  // let manifestPrefix = helpers.getManifestPathPrefix(options.prefix);

  return [
    data_tables.tableTitle(options),
    data_tables.tableCreatedDate(options),
    data_tables.tableTaxonomy(options),
    data_tables.tableOptions(options),
  ];
}

function getTableHeader(options) {
  const { adminRoute, schema, schemaName, indexOptions, allSchemas, } = options;
  // let customIndexHeader = helpers.getCustomIndexTableHeaders(schemas, label, options);
  // if (customIndexHeader) {
  //   let customheaders = customIndexHeader.map(header => header.call(null, schemas, label, options));
  //   // console.log({ customheaders });
  //   return customheaders;
  // } else 
  if (options.extsettings && options.extsettings.data_tables && options.extsettings.data_tables[schemaName]) {
    return options.extsettings.data_tables[schemaName];
  } else {
    return getDefaultHeaders(options);
  }
}

function getTableProps(options) {
  return helpers.getCustomSchemaOverrideProperty(Object.assign({ field: 'customIndexTableProps', }, options)) || helpers.getCustomOverrideProperty(Object.assign({ field: 'customIndexTableProps', }, options));
}


function indextable(options) {
  const { adminRoute, schema, schemaName, indexOptions, allSchemas, } = options;
  const dataRoutePrefix = helpers.getDataPrefix(options);
  let customCardProps = helpers.getCustomSchemaOverrideProperty(Object.assign({ field: 'customCardProps', }, options)) || helpers.getCustomOverrideProperty(Object.assign({ field: 'customCardProps', }, options));
  return [
    // {
    //   component: 'pre',
    //   children:JSON.stringify(schemas, null, 2),
    // },
    {
      component: 'ResponsiveCard',
      props: Object.assign({}, customCardProps, {
        cardTitle: `All ${capitalize(pluralize(schemaName))}`,
      }),
      children: [
        /*
          // {
          // component: 'RawStateOutput',
          // // component: 'RawStateOutput',
          // props: {
          //   select: 'rows',
          //   style: {
          //     padding: '10px',
          //     margin: '10px',
          //     border: '1px solid black',
          //   },
          // },
          // asyncprops: {
          //   'rows': [
          //     helpers.getIndexLabel(schemaName), 'data'
          //   ],
          // },
          // },
        */
        {
          component: 'ResponsiveTable',
          props: Object.assign({
            style: {
              wordWrap: 'break-word',
            },
            limit: 20,
            'filterSearch': true,
            'tableSearch': true,
            flattenRowData: true,
            flattenRowDataOptions: { maxDepth: 3, },
            baseUrl: dataRoutePrefix,
            dataMap: [{
              'key': 'rows',
              'value': helpers.getCustomSchemaOverrideProperty(Object.assign({ field: 'customIndexTableDatamapRows', }, options)) || `${pluralize(schemaName)}`,
            }, {
              'key': 'numItems',
              'value': helpers.getCustomSchemaOverrideProperty(Object.assign({ field: 'customIndexTableDatamapNumItems', }, options)) || `${pluralize(schemaName)}count`,
            }, {
              'key': 'numPages',
              'value': helpers.getCustomSchemaOverrideProperty(Object.assign({ field: 'customIndexTableDatamapNumPages', }, options)) || `${schemaName}pages`,
            },],
            'headerLinkProps': {
              'style': {
                'textDecoration': 'none',
                // color: styles.application.blackText,
                // fontWeight: 'normal',
              },
            },
            headers: getTableHeader(options),
          }, getTableProps(options)),
          asyncprops: {
            'rows': helpers.getCustomSchemaOverrideProperty(Object.assign({ field: 'customIndexTableAsyncpropsRows', }, options)) || [
              helpers.getIndexLabel(schemaName), 'data', `${pluralize(schemaName)}`,
            ],
            'numItems': helpers.getCustomSchemaOverrideProperty(Object.assign({ field: 'customIndexTableAsyncpropsNumItems', }, options)) || [
              helpers.getIndexLabel(schemaName), 'data', `${pluralize(schemaName)}count`,
            ],
            'numPages': helpers.getCustomSchemaOverrideProperty(Object.assign({ field: 'customIndexTableAsyncpropsNumPages', }, options)) || [
              helpers.getIndexLabel(schemaName), 'data', `${schemaName}pages`,
            ],
          },
        },
      ],
    },
  ];
}

module.exports = {
  getAllHeaders,
  getDefaultHeaders,
  getTableHeader,
  getTableProps,
  indextable,
};