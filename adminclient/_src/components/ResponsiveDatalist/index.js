'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

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

var _keys = require('babel-runtime/core-js/object/keys');

var _keys2 = _interopRequireDefault(_keys);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactRouter = require('react-router');

var _querystring = require('querystring');

var _querystring2 = _interopRequireDefault(_querystring);

var _reBulma = require('re-bulma');

var rb = _interopRequireWildcard(_reBulma);

var _debounce = require('debounce');

var _debounce2 = _interopRequireDefault(_debounce);

var _util = require('../../util');

var _util2 = _interopRequireDefault(_util);

var _pluralize = require('pluralize');

var _pluralize2 = _interopRequireDefault(_pluralize);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var propTypes = {
  returnProperty: _react.PropTypes.any, //false or string property value
  disabled: _react.PropTypes.bool,
  returnFormOptionsValue: _react.PropTypes.bool,
  selector: _react.PropTypes.string,
  displayfield: _react.PropTypes.string,
  displayProps: _react.PropTypes.object,
  dbname: _react.PropTypes.string,
  multi: _react.PropTypes.bool,
  createable: _react.PropTypes.bool,
  flattenDataList: _react.PropTypes.bool,
  flattenDataListOptions: _react.PropTypes.any,
  selectedData: _react.PropTypes.any,
  resourceUrl: _react.PropTypes.string,
  createResourceUrl: _react.PropTypes.string,
  data: _react.PropTypes.array,
  value: _react.PropTypes.any,
  onChange: _react.PropTypes.func,
  onFocus: _react.PropTypes.func,
  onBlur: _react.PropTypes.func,
  limit: _react.PropTypes.number,
  datalistdata: _react.PropTypes.array
};
// import flatten from 'flat';


var defaultProps = {
  disabled: false,
  returnProperty: false,
  returnFormOptionsValue: false,
  data: false,
  createable: false,
  value: undefined,
  displayProps: {},
  selectData: [],
  flattenDataList: true,
  flattenDataListOptions: {},
  selector: '_id',
  displayField: 'title',
  dbname: 'periodic',
  limit: 10,
  datalistdata: [],
  onChange: function onChange(data) {
    console.debug('ResponsiveDatalist onChange', { data: data });
  },
  onFocus: function onFocus(data) {
    console.debug('ResponsiveDatalist onFocus', { data: data });
  },
  onBlur: function onBlur(data) {
    console.debug('ResponsiveDatalist onBlur', { data: data });
  }
};

function getDatumValue(datum) {
  var returnProperty = this.props.returnFormOptionsValue || (0, _keys2.default)(datum).length === 2 && typeof datum.label !== 'undefined' && typeof datum.value !== 'undefined' ? 'value' : this.props.returnProperty;

  return returnProperty ? datum[returnProperty] : datum;
}

var ResponsiveDatalist = function (_Component) {
  (0, _inherits3.default)(ResponsiveDatalist, _Component);

  function ResponsiveDatalist(props) {
    (0, _classCallCheck3.default)(this, ResponsiveDatalist);

    var _this = (0, _possibleConstructorReturn3.default)(this, (ResponsiveDatalist.__proto__ || (0, _getPrototypeOf2.default)(ResponsiveDatalist)).call(this, props));

    _this.state = {
      disabled: props.disabled,
      data: props.data,
      value: props.value,
      selectedData: props.selectedData,
      isSearching: false
    };
    _this.inputProps = (0, _assign2.default)({}, _this.props.passableProps);
    _this.searchFunction = (0, _debounce2.default)(_this.updateDataList, 200);
    _this.filterStaticData = _this.filterStaticData.bind(_this);
    _this.getDatum = getDatumValue.bind(_this);
    return _this;
  }

  (0, _createClass3.default)(ResponsiveDatalist, [{
    key: 'componentWillReceiveProps',
    value: function componentWillReceiveProps(nextProps) {
      // console.debug({ nextProps });
      // this.setState(Object.assign({}, nextProps, this.props.getState()));
      // // console.log('this.state', this.state);
    }
  }, {
    key: 'filterStaticData',
    value: function filterStaticData(options) {
      var _this2 = this;

      if (this.props.returnFormOptionsValue) {
        return this.props.datalistdata.filter(function (item) {
          return item.label.indexOf(options.search) > -1;
        });
      } else if (options.search) {
        return this.props.datalistdata.filter(function (item) {
          return item[_this2.props.field].indexOf(options.search) > -1;
        });
      } else {
        return this.props.datalistdata;
      }
    }
  }, {
    key: 'updateDataList',
    value: function updateDataList(options) {
      var _this3 = this;

      // console.log('this.props.resourceUrl', this.props.resourceUrl);
      if (this.props.resourceUrl) {
        this.setState({ isSearching: true });
        var stateProps = this.props.getState();
        var fetchURL = this.props.resourceUrl + '&' + _querystring2.default.stringify({
          limit: this.props.limit,
          // sort: (newSortOptions.sortProp)
          //   ? `${newSortOptions.sortOrder}${newSortOptions.sortProp}`
          //   : undefined,
          query: options.search,
          allowSpecialCharacters: true
          // pagenum: options.pagenum || 1,
        });
        var headers = (0, _assign2.default)({
          'x-access-token': stateProps.user.jwt_token
        }, stateProps.settings.userprofile.options.headers);
        _util2.default.fetchComponent(fetchURL, { headers: headers })().then(function (response) {
          if (response.data && response.result && response.status) {
            response = response.data;
          }
          // console.debug('this.state.value',this.state.value);

          var updatedState = {};
          updatedState.selectedData = response[(0, _pluralize2.default)(_this3.props.entity)];
          updatedState.isSearching = false;
          _this3.setState(updatedState);
        }, function (e) {
          _this3.props.errorNotification(e);
        });
      } else if (this.props.staticSearch) {
        this.setState({ isSearching: true });
        //options.search is the actual content
        var updatedState = {};
        updatedState.selectedData = this.filterStaticData(options);
        updatedState.isSearching = false;
        // console.debug({updatedState,response});
        this.setState(updatedState);
        //value is the array of selected values
        //selectedData is the filtered list that changes everytime user types
      } else {
        console.debug({ options: options });
      }
    }
  }, {
    key: 'onChangeHandler',
    value: function onChangeHandler(event) {
      var search = event && event.target && event.target.value ? event.target.value : '';
      this.searchFunction({ search: search });
    }
  }, {
    key: 'onBlurHandler',
    value: function onBlurHandler() {
      var _this4 = this;

      setTimeout(function () {
        _this4.setState({ selectedData: [] });
      }, 400);
    }
  }, {
    key: 'getDatalistDisplay',
    value: function getDatalistDisplay(options) {
      var displayField = options.displayField,
          selector = options.selector,
          datum = options.datum;
      // console.debug('getDatalistDisplay', { options });

      var displayText = datum[displayField] || datum.title || datum.name || datum.username || datum.email || datum[selector] || (datum && typeof datum === 'string' ? datum : '');
      return _react2.default.createElement(
        'span',
        { style: {
            wordBreak: 'break-all',
            textOverflow: 'ellipsis',
            overflow: 'hidden',
            whiteSpace: 'pre-wrap',
            wordWrap: 'break-word'
          } },
        datum && datum.fileurl && datum.transform && datum.transform.preview ? _react2.default.createElement(rb.Image, { src: datum.transform.preview, size: 'is24X24', style: { float: 'left', marginRight: '5px' } }) : null,
        this.props.resourcePreview ? _react2.default.createElement(
          _reactRouter.Link,
          { title: datum.title || displayText, to: this.props.resourcePreview + '/' + (datum[selector] || datum) },
          displayText
        ) : displayText,
        this.props.resourceDescription ? _react2.default.createElement(
          rb.Content,
          null,
          _react2.default.createElement(
            'p',
            null,
            datum.description
          )
        ) : null
      );
    }
  }, {
    key: 'removeDatalistItem',
    value: function removeDatalistItem(index) {
      var _this5 = this;

      // console.debug('clicked datalist',{index});
      // console.debug('clicked onclick',this.props);
      // console.debug('this.state.value',this.state.value);
      if (this.props.multi) {
        var newValue = (0, _assign2.default)([], [].concat(this.state.value));
        newValue.splice(index, 1);
        // let oldValue = this.state.value;
        this.setState({
          // value: [],
          value: newValue,
          selectedData: [],
          update: new Date()
        }, function () {
          // this.props.onChange([]);
          _this5.props.onChange(newValue);
        });
      } else {
        var datum = undefined;
        this.setState({
          value: datum,
          selectedData: []
        });
        this.props.onChange(datum);
      }
    }
  }, {
    key: 'render',
    value: function render() {
      var _this6 = this;

      var notificationStyle = {
        marginBottom: '5px',
        padding: '5px',
        border: '1px solid lightgrey'
      };
      var notificationCloseStyle = {
        margin: '0px 0px 0px 20px',
        borderRadius: '19px'
      };
      var selectData = this.props.multi ? this.state.value && this.state.value.length ? this.state.value.map(function (selected, k) {
        return _react2.default.createElement(
          rb.Notification,
          {
            key: k,
            enableCloseButton: true,
            closeButtonProps: {
              onClick: _this6.removeDatalistItem.bind(_this6, k),
              style: notificationCloseStyle
            },
            style: notificationStyle
          },
          _this6.getDatalistDisplay({
            datum: selected,
            displayField: _this6.props.displayField,
            selector: _this6.props.selector
          })
        );
      }) : null : this.state.value ? _react2.default.createElement(
        rb.Notification,
        {
          enableCloseButton: true,
          closeButtonProps: {
            onClick: this.removeDatalistItem.bind(this),
            style: notificationCloseStyle
          },
          style: notificationStyle
        },
        this.getDatalistDisplay({
          datum: this.state.value,
          displayField: this.props.displayField,
          selector: this.props.selector
        })
      ) : null;
      var displayOptions = Array.isArray(this.state.selectedData) && this.state.selectedData && this.state.selectedData.length ? this.state.selectedData.map(function (datum, k) {
        return _react2.default.createElement(
          rb.Notification,
          {
            key: k,
            color: 'isWhite',
            style: notificationStyle
          },
          _react2.default.createElement(rb.Button, {
            icon: 'fa fa-plus',
            size: 'isSmall',
            style: {
              alignSelf: 'flex-end',
              borderRadius: '20px',
              float: 'right',
              paddingRight: '0px'
            },
            onClick: function onClick() {
              // console.debug('clicked onclick',this.props);
              if (_this6.props.multi) {
                var newValue = _this6.state.value && Array.isArray(_this6.state.value) && _this6.state.value.length ? _this6.state.value.concat([datum]) : [datum];
                _this6.setState({
                  value: newValue,
                  selectedData: []
                });
                _this6.props.onChange(newValue);
              } else {
                _this6.setState({
                  value: datum,
                  selectedData: []
                });
                _this6.props.onChange(datum);
              }
            } }),
          _this6.getDatalistDisplay({
            datum: datum,
            displayField: _this6.props.displayField,
            selector: _this6.props.selector
          })
        );
      }) : null;
      return _react2.default.createElement(
        'div',
        this.props.wrapperProps,
        _react2.default.createElement(
          'div',
          { style: { width: '100%' } },
          _react2.default.createElement(rb.Input, (0, _extends3.default)({}, this.inputProps, {
            state: this.state.isSearching || undefined,
            onChange: this.onChangeHandler.bind(this),
            onBlur: this.onBlurHandler.bind(this),
            onFocus: this.onChangeHandler.bind(this),
            ref: function ref(input) {
              _this6.textInput = input;
            }
          }))
        ),
        _react2.default.createElement(
          'div',
          this.props.displayProps,
          ' ',
          displayOptions
        ),
        _react2.default.createElement(
          'div',
          null,
          selectData
        )
      );
    }
  }]);
  return ResponsiveDatalist;
}(_react.Component);

ResponsiveDatalist.propType = propTypes;
ResponsiveDatalist.defaultProps = defaultProps;

exports.default = ResponsiveDatalist;