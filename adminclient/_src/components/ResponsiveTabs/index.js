'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _assign = require('babel-runtime/core-js/object/assign');

var _assign2 = _interopRequireDefault(_assign);

var _keys = require('babel-runtime/core-js/object/keys');

var _keys2 = _interopRequireDefault(_keys);

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

var _reBulma = require('re-bulma');

var _styles = require('../../styles');

var _styles2 = _interopRequireDefault(_styles);

var _AppLayoutMap = require('../AppLayoutMap');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var propTypes = {
  tabsType: _react.PropTypes.string,
  isFullwidth: _react.PropTypes.bool.isRequired,
  isButton: _react.PropTypes.bool,
  isForm: _react.PropTypes.bool,
  vertical: _react.PropTypes.bool,
  tabgroupProps: _react.PropTypes.object,
  tabsProps: _react.PropTypes.shape({
    tabStyle: _react.PropTypes.oneOf(['isToggle', 'isBoxed']),
    alignment: _react.PropTypes.oneOf(['isLeft', 'isCenter', 'isRight']),
    size: _react.PropTypes.oneOf(['isSmall', 'isMedium', 'isLarge'])
  })
};

var defaultProps = {
  tabsType: 'pageToggle',
  isFullwidth: true,
  isButton: true,
  isForm: false,
  vertical: false,
  tabgroupProps: {},
  tabsProps: {
    alignment: 'isCentered',
    size: 'isMedium'
  },
  tabContainer: {
    isGapless: true,
    style: {
      height: '100%'
    }
  },
  verticalTabTabsContainer: {
    size: 'is2',
    style: {
      // height:'100%',
      flexDirection: 'row'
    }
  },
  verticalTabContentContainer: {
    size: 'is10',
    style: {
      height: '100%'
    }
  }
};

var ResponsiveTabs = function (_Component) {
  (0, _inherits3.default)(ResponsiveTabs, _Component);

  function ResponsiveTabs(props) {
    (0, _classCallCheck3.default)(this, ResponsiveTabs);

    // console.debug('responsiveTab',{props})
    var _this = (0, _possibleConstructorReturn3.default)(this, (ResponsiveTabs.__proto__ || (0, _getPrototypeOf2.default)(ResponsiveTabs)).call(this, props));

    _this.state = {
      tabsType: props.tabsType,
      tabs: props.tabs,
      isButton: props.isButton,
      currentTab: '' || props.tabs[0],
      currentLayout: '',
      tabgroupProps: props.tabgroupProps,
      tabsProps: props.tabsProps
    };

    _this.getRenderedComponent = _AppLayoutMap.getRenderedComponent.bind(_this);
    _this.fetchRenderedComponent = _this.fetchRenderedComponent.bind(_this);
    return _this;
  }

  (0, _createClass3.default)(ResponsiveTabs, [{
    key: 'fetchRenderedComponent',
    value: function fetchRenderedComponent() {
      var _props;

      return this.props.isForm && this.props.getFormElements ? (_props = this.props).getFormElements.apply(_props, arguments) : this.getRenderedComponent.apply(this, arguments);
    }
  }, {
    key: 'changeTab',
    value: function changeTab(tab) {
      if (this.state.tabsType === 'select') {
        tab = this.state.tabs[Number(tab)];
      }
      var currentLayout = tab.layout && (0, _keys2.default)(tab.layout).length >= 1 ? this.fetchRenderedComponent(tab.layout) : '';
      // window.location.hash = tab.name;
      // console.log({tab})
      this.setState({
        currentTab: tab,
        currentLayout: currentLayout
      });
      var onChangeFunc = function onChangeFunc() {};
      if (typeof this.props.onChange === 'string' && this.props.onChange.indexOf('func:this.props') !== -1) {
        onChangeFunc = this.props[this.props.onChange.replace('func:this.props.', '')];
      } else if (typeof this.props.onChange === 'string' && this.props.onChange.indexOf('func:window') !== -1 && typeof window[this.props.onChange.replace('func:window.', '')] === 'function') {
        onChangeFunc = window[this.props.onChange.replace('func:window.', '')].bind(this);
      } else if (typeof this.props.onChange === "function") {
        onChangeFunc = this.props.onChange;
      }
      // console.log('this.props.onChange',this.props.onChange)
      // console.log('onChangeFunc',onChangeFunc)
      onChangeFunc(tab);
    }
  }, {
    key: 'componentWillMount',
    value: function componentWillMount() {
      var defaultLayout = this.state.currentTab.layout && (0, _keys2.default)(this.state.currentTab.layout).length >= 1 ? this.fetchRenderedComponent(this.state.currentTab.layout) : '';
      this.setState({
        currentLayout: defaultLayout
      });
      if (this.props.isForm && this.props.onChange) {
        this.props.onChange(this.state.currentTab);
      }
    }
  }, {
    key: 'render',
    value: function render() {
      var _this2 = this;

      var TabSelector = null;
      if (this.props.customTabLayout) {
        TabSelector = this.state.tabs.map(function (tab, i) {
          var active = tab.name === _this2.state.currentTab.name ? true : false;
          var buttonStyle = tab.name === _this2.state.currentTab.name ? _styles2.default.activeButton : {};
          var customTab = (0, _assign2.default)({}, _this2.props.customTabLayout);
          customTab.props = (0, _assign2.default)({
            style: buttonStyle
          }, customTab.props, {
            onClick: function onClick() {
              return _this2.changeTab(tab);
            },
            isActive: { active: active },
            key: tab.name + '-' + i,
            tab: tab
          });
          return _this2.fetchRenderedComponent(customTab);
        });
      } else if (this.state.tabsType === 'pageToggle') {
        TabSelector = this.state.tabs.map(function (tab, i) {
          var active = tab.name === _this2.state.currentTab.name ? true : false;
          var buttonStyle = tab.name === _this2.state.currentTab.name ? _styles2.default.activeButton : {};
          if (_this2.state.isButton) return _react2.default.createElement(
            _reBulma.Tab,
            (0, _extends3.default)({}, tab.tabProps, { key: tab.name + '-' + i, isActive: active, onClick: function onClick() {
                return _this2.changeTab(tab);
              } }),
            _react2.default.createElement(
              _reBulma.Button,
              { style: buttonStyle },
              tab.name
            )
          );
          return _react2.default.createElement(
            _reBulma.Tab,
            (0, _extends3.default)({}, tab.tabProps, { key: tab.name + '-' + i, isActive: active, onClick: function onClick() {
                return _this2.changeTab(tab);
              } }),
            tab.name
          );
        });
      } else if (this.state.tabsType === 'select') {
        TabSelector = _react2.default.createElement(
          _reBulma.Select,
          (0, _extends3.default)({}, this.state.tabgroupProps, {
            onChange: function onChange(e) {
              _this2.changeTab(e.target.value);
            } }),
          this.props.tabs.map(function (tab, idx) {
            return _react2.default.createElement(
              'option',
              (0, _extends3.default)({ key: idx, value: idx }, tab.tabProps),
              tab.name
            );
          })
        );
      } else if (this.state.tabsType === 'navBar') {
        TabSelector = this.state.tabs.map(function (tab, idx) {
          var active = tab.name === _this2.state.currentTab.name ? true : false;
          return _react2.default.createElement(
            _reBulma.Tab,
            (0, _extends3.default)({}, tab.tabProps, { key: idx, isActive: active, onClick: function onClick() {
                return _this2.changeTab(tab);
              } }),
            tab.name
          );
        });
      }

      return this.props.vertical ? _react2.default.createElement(
        _reBulma.Columns,
        this.props.tabContainer,
        _react2.default.createElement(
          _reBulma.Column,
          this.props.verticalTabTabsContainer,
          _react2.default.createElement(
            _reBulma.Tabs,
            (0, _extends3.default)({}, this.state.tabsProps, { style: {
                height: '100%',
                flexWrap: 'wrap'
              } }),
            this.props.customTabLayout ? _react2.default.createElement(
              'div',
              (0, _extends3.default)({}, this.state.tabgroupProps, { style: {
                  flexWrap: 'wrap',
                  flexDirection: 'row',
                  flex: 1
                } }),
              this.props.tabLabel ? _react2.default.createElement(
                _reBulma.Label,
                this.props.tabLabelProps,
                this.props.tabLabel
              ) : null,
              TabSelector
            ) : _react2.default.createElement(
              'ul',
              (0, _extends3.default)({}, this.state.tabgroupProps, { style: {
                  flexWrap: 'wrap',
                  flexDirection: 'row',
                  flex: 1
                } }),
              this.props.tabLabel ? _react2.default.createElement(
                _reBulma.Label,
                this.props.tabLabelProps,
                this.props.tabLabel
              ) : null,
              TabSelector
            )
          )
        ),
        _react2.default.createElement(
          _reBulma.Column,
          this.props.verticalTabContentContainer,
          this.state.currentLayout
        )
      ) : _react2.default.createElement(
        'div',
        this.props.tabContainer,
        _react2.default.createElement(
          _reBulma.Tabs,
          this.state.tabsProps,
          _react2.default.createElement(
            _reBulma.TabGroup,
            this.state.tabgroupProps,
            this.props.tabLabel ? _react2.default.createElement(
              _reBulma.Label,
              this.props.tabLabelProps,
              this.props.tabLabel
            ) : null,
            TabSelector
          )
        ),
        this.state.currentLayout
      );
    }
  }]);
  return ResponsiveTabs;
}(_react.Component);

ResponsiveTabs.propType = propTypes;
ResponsiveTabs.defaultProps = defaultProps;

exports.default = ResponsiveTabs;