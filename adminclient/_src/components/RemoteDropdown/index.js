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

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _semanticUiReact = require('semantic-ui-react');

var _util = require('../../util');

var _util2 = _interopRequireDefault(_util);

var _querystring = require('querystring');

var _querystring2 = _interopRequireDefault(_querystring);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var RemoteDropdown = function (_Component) {
  (0, _inherits3.default)(RemoteDropdown, _Component);

  function RemoteDropdown(props) {
    (0, _classCallCheck3.default)(this, RemoteDropdown);

    var _this = (0, _possibleConstructorReturn3.default)(this, (RemoteDropdown.__proto__ || (0, _getPrototypeOf2.default)(RemoteDropdown)).call(this, props));

    _this.state = {
      isFetching: false,
      multiple: props.multiple || false,
      search: props.search || false,
      searchQuery: props.value || null,
      value: props.value || '',
      options: props.default_options || []
    };
    _this.debounce = _this.debounce.bind(_this);
    _this.handleChange = _this.handleChange.bind(_this);
    _this.searchHandler = _this.searchHandler.bind(_this);
    _this.handleSearchChange = _this.debounce(_this.searchHandler).bind(_this);
    return _this;
  }

  (0, _createClass3.default)(RemoteDropdown, [{
    key: 'componentWillMount',
    value: function componentWillMount() {
      var _this2 = this;

      if (this.props.value || !this.props.value && this.props.emptyQuery) {
        this.setState({ searchQuery: this.props.value, isFetching: true }, function () {
          var stateProps = _this2.props.getState();
          var options = _this2.props.searchProps;
          var fetchURL = '' + stateProps.settings.basename + options.baseUrl + '&' + _querystring2.default.stringify({
            limit: options.limit || 20,
            sort: options.sort,
            query: _this2.props.value || '',
            allowSpecialCharacters: true,
            changed: true,
            init: true
          });
          var headers = (0, _assign2.default)({
            'x-access-token': stateProps.user.jwt_token
          }, stateProps.settings.userprofile.options.headers);
          _util2.default.fetchComponent(fetchURL, { headers: headers })().then(function (response) {
            var dropdown = response[options.response_field].map(function (item, idx) {
              return {
                "key": idx,
                "text": item.label,
                "value": item.value
              };
            });
            _this2.setState({ isFetching: false, options: dropdown });
          }, function (e) {
            _this2.setState({ isFetching: false, options: [] });
          });
        });
      }
    }
  }, {
    key: 'handleChange',
    value: function handleChange(cb) {
      var self = this;
      return function (e, _ref) {
        var value = _ref.value;

        var stateProps = self.props.getState();
        var options = self.props.searchProps;
        var fetchURL = '' + stateProps.settings.basename + options.baseUrl + '&' + _querystring2.default.stringify({
          limit: options.limit || 20,
          sort: options.sort,
          query: value,
          allowSpecialCharacters: true,
          changed: true
        });
        var headers = (0, _assign2.default)({
          'x-access-token': stateProps.user.jwt_token
        }, stateProps.settings.userprofile.options.headers);
        self.setState({ value: value }, function () {
          if (cb) cb(e, { value: value });
          _util2.default.fetchComponent(fetchURL, { headers: headers })().then(function (response) {
            var dropdown = response[options.response_field].map(function (item, idx) {
              return {
                "key": idx,
                "text": item.label,
                "value": item.value
              };
            });
            self.setState({ isFetching: false, options: dropdown });
          }, function (e) {
            self.setState({ isFetching: false, options: [] });
          });
        });
      };
    }
  }, {
    key: 'debounce',
    value: function debounce(func) {
      var timeout;
      var wait = 1000,
          immediate = false;
      if (!this.props.debounce) immediate = true;else wait = this.props.debounce || 1000;
      var self = this;
      return function () {
        var context = self,
            args = arguments;
        var later = function later() {
          timeout = null;
          func.apply(context, args);
        };
        var callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(context, args);
      };
    }
  }, {
    key: 'searchHandler',
    value: function searchHandler(e, _ref2) {
      var searchQuery = _ref2.searchQuery;

      var self = this;
      if (searchQuery && self.state.searchQuery !== searchQuery) {
        self.setState({ searchQuery: searchQuery, isFetching: true }, function () {
          var stateProps = self.props.getState();
          var options = self.props.searchProps;
          var fetchURL = '' + stateProps.settings.basename + options.baseUrl + '&' + _querystring2.default.stringify({
            limit: options.limit || 20,
            sort: options.sort,
            query: searchQuery,
            allowSpecialCharacters: true
          });
          var headers = (0, _assign2.default)({
            'x-access-token': stateProps.user.jwt_token
          }, stateProps.settings.userprofile.options.headers);
          _util2.default.fetchComponent(fetchURL, { headers: headers })().then(function (response) {
            var dropdown = response[options.response_field].map(function (item, idx) {
              return {
                "key": idx,
                "text": item.label,
                "value": item.value
              };
            });
            self.setState({ isFetching: false, options: dropdown });
          }, function (e) {
            self.setState({ isFetching: false, options: [] });
          });
        });
      } else if (!searchQuery && this.props.emptyQuery && self.state.searchQuery !== searchQuery) {
        self.setState({ searchQuery: '', isFetching: true }, function () {
          var stateProps = self.props.getState();
          var options = self.props.searchProps;
          var fetchURL = '' + stateProps.settings.basename + options.baseUrl + '&' + _querystring2.default.stringify({
            limit: options.limit || 20,
            sort: options.sort,
            query: '',
            allowSpecialCharacters: true
          });
          var headers = (0, _assign2.default)({
            'x-access-token': stateProps.user.jwt_token
          }, stateProps.settings.userprofile.options.headers);
          _util2.default.fetchComponent(fetchURL, { headers: headers })().then(function (response) {
            var dropdown = response[options.response_field].map(function (item, idx) {
              return {
                "key": idx,
                "text": item.label,
                "value": item.value
              };
            });
            self.setState({ isFetching: false, options: dropdown });
          }, function (e) {
            self.setState({ isFetching: false, options: [] });
          });
        });
      } else {
        self.setState({ isFetching: false });
      }
    }
  }, {
    key: 'render',
    value: function render() {
      var _state = this.state,
          multiple = _state.multiple,
          options = _state.options,
          isFetching = _state.isFetching,
          search = _state.search,
          value = _state.value;

      var passedProps = (0, _assign2.default)({}, this.props.passProps);
      return _react2.default.createElement(_semanticUiReact.Dropdown, (0, _extends3.default)({}, passedProps, {
        fluid: true,
        selection: true,
        multiple: multiple,
        search: search,
        options: options,
        value: value,
        placeholder: this.props.placeholder || '',
        onChange: this.props.onChange ? this.handleChange(this.props.onChange) : this.handleChange(),
        onSearchChange: this.handleSearchChange,
        disabled: isFetching,
        loading: isFetching
      }));
    }
  }]);
  return RemoteDropdown;
}(_react.Component);

exports.default = RemoteDropdown;