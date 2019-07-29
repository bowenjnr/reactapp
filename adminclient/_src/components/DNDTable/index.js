'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof2 = require('babel-runtime/helpers/typeof');

var _typeof3 = _interopRequireDefault(_typeof2);

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _assign = require('babel-runtime/core-js/object/assign');

var _assign2 = _interopRequireDefault(_assign);

var _getPrototypeOf = require('babel-runtime/core-js/object/get-prototype-of');

var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _AppLayoutMap = require('../AppLayoutMap');

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

var _reactSortableHoc = require('@digifi/react-sortable-hoc');

var _reactVirtualized = require('react-virtualized');

var _tableHelpers = require('./tableHelpers');

var _tableHelpers2 = _interopRequireDefault(_tableHelpers);

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _range = require('lodash/range');

var _range2 = _interopRequireDefault(_range);

var _random = require('lodash/random');

var _random2 = _interopRequireDefault(_random);

var _reBulma = require('re-bulma');

var rb = _interopRequireWildcard(_reBulma);

var _moment = require('moment');

var _moment2 = _interopRequireDefault(_moment);

var _numeral = require('numeral');

var _numeral2 = _interopRequireDefault(_numeral);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/*
 * Important note:
 * To access the ref of a component that has been wrapped with the SortableContainer HOC,
 * you *must* pass in {withRef: true} as the second param. Refs are opt-in.
 */

var LWpropTypes = {
  rows: _react.PropTypes.array,
  className: _react.PropTypes.string,
  itemClass: _react.PropTypes.string,
  width: _react.PropTypes.number,
  height: _react.PropTypes.number,
  onSortStart: _react.PropTypes.func,
  onSortEnd: _react.PropTypes.func,
  shouldCancelStart: _react.PropTypes.func,
  component: _react.PropTypes.func,
  shouldUseDragHandle: _react.PropTypes.bool,
  headers: _react.PropTypes.array,
  handleRowUpdate: _react.PropTypes.func,
  toggleRowKeys: _react.PropTypes.array,
  toggleRowClass: _react.PropTypes.object
};
var LWdefaultProps = {
  className: 'list',
  itemClass: 'item',
  width: 400,
  headers: [],
  toggleRowClass: {},
  toggleRowKeys: []
};

var ListWrapper = function (_Component) {
  (0, _inherits3.default)(ListWrapper, _Component);

  function ListWrapper(props) {
    (0, _classCallCheck3.default)(this, ListWrapper);

    var _this = (0, _possibleConstructorReturn3.default)(this, (ListWrapper.__proto__ || (0, _getPrototypeOf2.default)(ListWrapper)).call(this, props));

    _this.onSortEnd = _this.onSortEnd.bind(_this);
    _this.shouldCancelStart = _this.shouldCancelStart.bind(_this);
    _this.state = {
      rows: props.rows,
      className: props.className,
      itemClass: props.itemClass,
      width: props.width,
      height: props.itemHeight * (props.rows.length + 1),
      onSortStart: props.onSortStart,
      onSortEnd: props.onSortEnd,
      shouldCancelStart: props.shouldCancelStart,
      component: props.component,
      shouldUseDragHandle: props.shouldUseDragHandle,
      headers: props.headers,
      handleRowUpdate: props.handleRowUpdate,
      isSorting: false,
      toggleRowClass: props.toggleRowClass || '',
      toggleRowKeys: props.toggleRowKeys || []
    };
    return _this;
  }

  (0, _createClass3.default)(ListWrapper, [{
    key: 'onSortStart',
    value: function onSortStart() {
      var onSortStart = this.props.onSortStart;

      this.setState({ isSorting: true });

      if (onSortStart) {
        onSortStart(this.refs.component);
      }
    }
  }, {
    key: 'onSortEnd',
    value: function onSortEnd(_ref) {
      var _this2 = this;

      var oldIndex = _ref.oldIndex,
          newIndex = _ref.newIndex;
      var onSortEnd = this.props.onSortEnd;
      var rows = this.state.rows;

      var newRows = (0, _reactSortableHoc.arrayMove)(rows, oldIndex, newIndex);
      this.setState((0, _assign2.default)({}, { rows: newRows }, { isSorting: false }), function () {
        _this2.props.handleRowUpdate(newRows);
      });
      if (onSortEnd) {
        onSortEnd(this.refs.component);
      }
    }
  }, {
    key: 'shouldCancelStart',
    value: function shouldCancelStart(e) {
      var disabledElements = ['input', 'textarea', 'select', 'option', 'button', 'a'];
      var disabledClass = '__ra_rb';
      if (disabledElements.indexOf(e.target.tagName.toLowerCase()) !== -1 || disabledElements.indexOf(e.target.parentNode.tagName.toLowerCase()) !== -1 || e.target.classList.contains(disabledClass)) {
        return true; // Return true to cancel sorting
      }
    }
  }, {
    key: 'render',
    value: function render() {
      var Component = this.props.component;
      var _state = this.state,
          rows = _state.rows,
          isSorting = _state.isSorting,
          height = _state.height;

      var props = {
        isSorting: isSorting,
        rows: rows,
        height: height,
        onSortEnd: this.onSortEnd,
        shouldCancelStart: this.shouldCancelStart,
        onSortStart: this.onSortStart,
        ref: 'component',
        useDragHandle: this.props.shouldUseDragHandle
      };

      return _react2.default.createElement(Component, (0, _extends3.default)({}, this.props, props));
    }
  }]);
  return ListWrapper;
}(_react.Component);

ListWrapper.propTypes = LWpropTypes;
ListWrapper.defaultProps = LWdefaultProps;

var TWpropTypes = {
  rows: _react.PropTypes.array,
  className: _react.PropTypes.string,
  helperClass: _react.PropTypes.string,
  itemClass: _react.PropTypes.string,
  width: _react.PropTypes.number,
  height: _react.PropTypes.number,
  itemHeight: _react.PropTypes.number,
  onSortEnd: _react.PropTypes.func,
  shouldCancelStart: _react.PropTypes.func,
  headers: _react.PropTypes.array,
  toggleRowKeys: _react.PropTypes.array,
  toggleRowClass: _react.PropTypes.object
};

var TableWrapper = function (_Component2) {
  (0, _inherits3.default)(TableWrapper, _Component2);

  function TableWrapper(props) {
    (0, _classCallCheck3.default)(this, TableWrapper);

    var _this3 = (0, _possibleConstructorReturn3.default)(this, (TableWrapper.__proto__ || (0, _getPrototypeOf2.default)(TableWrapper)).call(this, props));

    _this3.getRenderedComponent = _AppLayoutMap.getRenderedComponent.bind(_this3);
    _this3.cellRenderer = _this3.cellRenderer.bind(_this3);
    _this3.state = {
      rows: props.rows,
      className: props.className,
      helperClass: props.helperClass,
      itemClass: props.itemClass,
      width: props.width,
      height: props.height,
      itemHeight: props.itemHeight,
      onSortEnd: props.onSortEnd,
      shouldCancelStart: props.shouldCancelStart,
      headers: props.headers,
      toggleRowClass: props.toggleRowClass || {},
      toggleRowKeys: props.toggleRowKeys || []
    };
    return _this3;
  }

  (0, _createClass3.default)(TableWrapper, [{
    key: 'cellRenderer',
    value: function cellRenderer(_ref2) {
      var _this4 = this;

      var cellData = _ref2.cellData,
          index = _ref2.index;

      if (typeof cellData === 'string') return String(cellData);
      if (Array.isArray(cellData)) {
        return cellData.map(function (celldata) {
          return _this4.cellRenderer({ cellData: celldata });
        });
      }
      if ((typeof cellData === 'undefined' ? 'undefined' : (0, _typeof3.default)(cellData)) === 'object') return this.getRenderedComponent(cellData);
    }
  }, {
    key: 'render',
    value: function render() {
      var _this5 = this;

      var _props = this.props,
          className = _props.className,
          height = _props.height,
          helperClass = _props.helperClass,
          itemClass = _props.itemClass,
          itemHeight = _props.itemHeight,
          rows = _props.rows,
          headers = _props.headers,
          onSortEnd = _props.onSortEnd,
          shouldCancelStart = _props.shouldCancelStart,
          width = _props.width,
          toggleRowKeys = _props.toggleRowKeys,
          toggleRowClass = _props.toggleRowClass;

      var SortableTable = (0, _reactSortableHoc.SortableContainer)(_reactVirtualized.Table, { withRef: true });
      var SortableRowRenderer = (0, _reactSortableHoc.SortableElement)(_tableHelpers2.default);
      var tableheaders = headers.map(function (header, idx) {
        return _react2.default.createElement(_reactVirtualized.Column, { content: idx,
          cellRenderer: _this5.cellRenderer,
          label: !Array.isArray(header.label) && (0, _typeof3.default)(header.label) === 'object' ? _this5.getRenderedComponent(header.label) : header.label,
          key: idx,
          dataKey: header.sortid,
          width: width,
          headerStyle: header.columnProps && header.columnProps.style ? header.columnProps.style : null });
      });
      return _react2.default.createElement(
        SortableTable,
        {
          getContainer: function getContainer(wrappedInstance) {
            return _reactDom2.default.findDOMNode(wrappedInstance.Grid);
          },
          gridClassName: className,
          headerHeight: itemHeight,
          height: height,
          helperClass: helperClass,
          onSortEnd: onSortEnd,
          shouldCancelStart: shouldCancelStart,
          transitionDuration: 0,
          rowClassName: itemClass,
          rowCount: rows.length,
          rowGetter: function rowGetter(_ref3) {
            var index = _ref3.index;
            return rows[index];
          },
          rowHeight: itemHeight,
          rowRenderer: function rowRenderer(props) {
            return _react2.default.createElement(SortableRowRenderer, (0, _extends3.default)({}, props, {
              toggleRowKeys: toggleRowKeys,
              toggleRowClass: toggleRowClass,
              indexCopy: props.index,
              headers: _this5.props.headers }));
          },
          width: width
        },
        tableheaders
      );
    }
  }]);
  return TableWrapper;
}(_react.Component);

TableWrapper.propTypes = TWpropTypes;

var DNDTabledefaultProps = {
  itemHeight: 50
};

var DNDTable = function (_Component3) {
  (0, _inherits3.default)(DNDTable, _Component3);

  function DNDTable(props) {
    (0, _classCallCheck3.default)(this, DNDTable);
    return (0, _possibleConstructorReturn3.default)(this, (DNDTable.__proto__ || (0, _getPrototypeOf2.default)(DNDTable)).call(this, props));
  }

  (0, _createClass3.default)(DNDTable, [{
    key: 'render',
    value: function render() {
      return _react2.default.createElement(
        'div',
        { className: 'root' },
        _react2.default.createElement(ListWrapper, (0, _extends3.default)({
          component: TableWrapper,
          rows: this.props.rows,
          handleRowUpdate: this.props.handleRowUpdate
          // updateDNDRows={updateRows}
          , itemHeight: this.props.itemHeight,
          helperClass: 'helper',
          headers: this.props.headers
        }, this.props))
      );
    }
  }]);
  return DNDTable;
}(_react.Component);

DNDTable.defaultProps = DNDTabledefaultProps;

exports.default = DNDTable;