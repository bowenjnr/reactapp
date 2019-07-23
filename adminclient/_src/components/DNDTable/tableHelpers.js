'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

exports.default = defaultRowRenderer;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function defaultRowRenderer(_ref) {
  var headers = _ref.headers,
      columns = _ref.columns,
      className = _ref.className,
      indexCopy = _ref.indexCopy,
      key = _ref.key,
      onRowClick = _ref.onRowClick,
      onRowDoubleClick = _ref.onRowDoubleClick,
      onRowMouseOut = _ref.onRowMouseOut,
      onRowMouseOver = _ref.onRowMouseOver,
      onRowRightClick = _ref.onRowRightClick,
      rowData = _ref.rowData,
      style = _ref.style,
      toggleRowKeys = _ref.toggleRowKeys,
      toggleRowClass = _ref.toggleRowClass;

  var a11yProps = {};

  if (onRowClick || onRowDoubleClick || onRowMouseOut || onRowMouseOver || onRowRightClick) {
    a11yProps['aria-label'] = 'row';
    a11yProps.tabIndex = 0;

    if (onRowClick) {
      a11yProps.onClick = function (event) {
        return onRowClick({ event: event, indexCopy: indexCopy, rowData: rowData });
      };
    }
    if (onRowDoubleClick) {
      a11yProps.onDoubleClick = function (event) {
        return onRowDoubleClick({ event: event, indexCopy: indexCopy, rowData: rowData });
      };
    }
    if (onRowMouseOut) {
      a11yProps.onMouseOut = function (event) {
        return onRowMouseOut({ event: event, indexCopy: indexCopy, rowData: rowData });
      };
    }
    if (onRowMouseOver) {
      a11yProps.onMouseOver = function (event) {
        return onRowMouseOver({ event: event, indexCopy: indexCopy, rowData: rowData });
      };
    }
    if (onRowRightClick) {
      a11yProps.onContextMenu = function (event) {
        return onRowRightClick({ event: event, indexCopy: indexCopy, rowData: rowData });
      };
    }
  }

  var rowToggleClass = '';

  var columnData = columns.map(function (column, colIdx) {
    return _react2.default.createElement('div', (0, _extends3.default)({}, column.props, { key: 'Row' + indexCopy + '-Col' + colIdx
    }, headers[colIdx] ? headers[colIdx].columnProps : {}));
  });

  toggleRowKeys.map(function (key) {
    if (rowData.hasOwnProperty(key) && toggleRowClass[key] && typeof toggleRowClass[key][rowData[key]] === "string") {
      rowToggleClass = rowToggleClass + ' ' + toggleRowClass[key][rowData[key]];
    }
  });

  return _react2.default.createElement(
    'div',
    (0, _extends3.default)({}, a11yProps, {
      className: className + rowToggleClass,
      key: indexCopy,
      role: 'row',
      style: style
    }),
    columnData
  );
}