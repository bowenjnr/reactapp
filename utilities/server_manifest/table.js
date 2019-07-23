'use strict';
const pluralize = require('pluralize');
const capitalize = require('capitalize');

function getTableHeader(options = {}) { 
  const { headers, headerProps, htmlTH, customRowProps = {}, } = options;
  return {
    component: 'Thead',
    props: headerProps || {},
    children: [
      {
        component: 'Tr',
        children: headers.map(header => ({
          component: htmlTH ? 'th' : 'Th',
          props: Object.assign({
            className: '__re-bulma_th',
          }, customRowProps[ 0 ]),
          children: (options.capitalizeHeaders) ? capitalize(header) : header,
        })),
      },
    ],
  };
}

function getTableBody(options = {}) {
  const { data, bodyProps, tableRowProps, tableColProps, customRowProps = {}, htmlTD, } = options;
  return {
    component: 'Tbody',
    props: bodyProps || {},
    children: data.map((row, i) => ({
      component: 'Tr',
      props: Object.assign({
      }, tableRowProps, customRowProps[i]),
      children: Object.keys(row).map(col => ({
        component: htmlTD ? 'td' : 'Td',
        props: Object.assign(
          {
            className: '__re-bulma_td',                  
          },
          tableColProps,
          (typeof row[ col ] === 'object' && typeof row[ col ].columnProps)
            ? row[ col ].columnProps
            : {}),
        children: (typeof row[ col ] === 'object' && typeof row[ col ].displayValue !=='undefined')
          ? row[ col ].displayValue || ' '
          : row[ col ],
      })),  
    })),
  };
}

function getTableFooter(options = {}) {
  const { footers, footerProps, htmlTF, tableRowProps, customRowProps, } = options;
  return {
    component: 'Tfoot',
    props: footerProps || {},
    children: [
      {
        component: 'Tr',
        props: Object.assign({
        }, tableRowProps ),
        children: footers.map(footer => ({
          component: htmlTF ? 'th' : 'Th',
          props: {
            className: '__re-bulma_th',            
          },
          children: footer,  
        })),
      },
    ],
  };
}

function getBasicTable(options = {}) {
  const {
    hasHeader = true,
    hasBody = true,
    hasFooter = true,
    data = [],
    bodyProps,
    header,
    headerProps,
    footer,
    footerProps,
    props,
    tableRowProps,
    tableColProps,
    capitalizeHeaders,
    htmlTH,
    htmlTD,
    htmlTF,
    ignoreReduxProps = true,
    customRowProps = {},
  } = options;
  const headers = header || Object.keys(data[ 0 ]);
  const footers = footer || headers;
  const tableProps = props || {};
  return {
    component: 'Table',
    ignoreReduxProps,
    props: tableProps,
    children: [
      hasHeader
        ? getTableHeader({ data, headers, headerProps, capitalizeHeaders, htmlTH, customRowProps, })
        : null,
      hasBody
        ? getTableBody({ data, bodyProps, tableRowProps, tableColProps, htmlTD, customRowProps, })
        : null,
      hasFooter
        ? getTableFooter({ data, footers, footerProps, htmlTF, customRowProps, })
        : null,
    ],
  };
}

function getTable(options) {
  const { schemaName, baseUrl, headers, tableProps, asyncdataprops, customLayout, customLayoutStyle, asyncprops, thisprops, dataMap, limit=100, useThisProps, bindprops,  } = options;
  return {
    component: 'ResponsiveTable',
    props: Object.assign({}, {
      style: {
        wordWrap: 'break-word',
      },
      limit,
      'filterSearch': true,
      'tableSearch': true,
      flattenRowData: true,
      flattenRowDataOptions: { maxDepth: 3, },
      baseUrl,
      dataMap: (dataMap) ? dataMap : [{
        'key': 'rows',
        'value': `${pluralize(schemaName)}`,
      }, {
        'key': 'numItems',
        'value': `${pluralize(schemaName)}count`,
      }, {
        'key': 'numPages',
        'value': `${schemaName}pages`,
      }, ],
      'headerLinkProps': {
        'style': {
          'textDecoration': 'none',
        },
      },
      headers,
      customLayout,
      customLayoutStyle,
    }, tableProps),
    thisprops: Object.assign({}, thisprops, useThisProps
      ? {
        'rows': [
          asyncdataprops, 'data', `${pluralize(schemaName)}`,
        ],
        'numItems': [
          asyncdataprops, 'data', `${pluralize(schemaName)}count`,
        ],
        'numPages': [
          asyncdataprops, 'data', `${schemaName}pages`,
        ],
      }
      : {}),
    bindprops,
    asyncprops: (asyncprops)
      ? asyncprops
      : useThisProps
        ? {}
        : {
          'rows': [
            asyncdataprops, 'data', `${pluralize(schemaName)}`,
          ],
          'numItems': [
            asyncdataprops, 'data', `${pluralize(schemaName)}count`,
          ],
          'numPages': [
            asyncdataprops, 'data', `${schemaName}pages`,
          ],
        },
  };
}

function getSheet(options) {
  const { data = [], } = options;
  const headers = Object.keys(data[ 0 ]);
  const columns = headers.map((column, i) => ({
    title: column,
    dataIndex: column,
    key: column,
    width:'auto',
    // fixed: (i === 0)
    //   ? 'left'
    //   : (i === (headers.length - 1))
    //     ? 'right'
    //     : undefined,
  }));
  return {
    component: 'RCTable',
    props: {
      columns,
      data,
      // useFixedHeader:true,
      scroll: {
        // x: 1500,
        // x: true,
        // x: '150%',
        // y: 350,
        // y:true,
      },
    },
  };
}

module.exports = {
  getTableHeader,
  getTableFooter,
  getTable,
  getBasicTable,
  getSheet,
};