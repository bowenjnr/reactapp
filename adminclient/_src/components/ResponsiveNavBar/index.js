'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _assign = require('babel-runtime/core-js/object/assign');

var _assign2 = _interopRequireDefault(_assign);

var _toConsumableArray2 = require('babel-runtime/helpers/toConsumableArray');

var _toConsumableArray3 = _interopRequireDefault(_toConsumableArray2);

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

var _reactRouter = require('react-router');

var _AppLayoutMap = require('../AppLayoutMap');

var _semanticUiReact = require('semantic-ui-react');

var _ResponsiveButton = require('../ResponsiveButton');

var _ResponsiveButton2 = _interopRequireDefault(_ResponsiveButton);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var propTypes = {
  activeLinkStyle: _react.PropTypes.object,
  linkProps: _react.PropTypes.object,
  navData: _react.PropTypes.array,
  navSections: _react.PropTypes.array,
  params: _react.PropTypes.array,
  active: _react.PropTypes.boolean,
  navType: _react.PropTypes.string,
  customComponents: _react.PropTypes.array,
  allActive: _react.PropTypes.boolean
};

var defaultProps = {
  activeLinkStyle: {},
  navData: [],
  navSections: [],
  params: [],
  linkProps: {},
  toggleData: {},
  customComponents: [],
  allActive: false
};

var ResponsiveNavBar = function (_Component) {
  (0, _inherits3.default)(ResponsiveNavBar, _Component);

  function ResponsiveNavBar(props) {
    (0, _classCallCheck3.default)(this, ResponsiveNavBar);

    var _this = (0, _possibleConstructorReturn3.default)(this, (ResponsiveNavBar.__proto__ || (0, _getPrototypeOf2.default)(ResponsiveNavBar)).call(this, props));

    var navData = props.navData || [];
    var navSections = props.navSections || [];
    var params = props.params || [];
    var linkProps = props.linkProps || {};
    var toggleData = props.toggleData || {};
    var navType = props.navType || '';
    var allActive = props.allActive;
    _this.state = {
      activeIndex: [0],
      activeSinglePageIndex: [0, 0]
    };
    _this.getSinglePageNav = _this.getSinglePageNav.bind(_this);
    _this.updateSinglePageIndex = _this.updateSinglePageIndex.bind(_this);
    _this.getMultipageNav = _this.getMultipageNav.bind(_this);
    _this.handleClick = _this.handleClick.bind(_this);
    _this.getPropsForOnClick = _this.getPropsForOnClick.bind(_this);
    _this.getButtonLink = _this.getButtonLink.bind(_this);
    _this.getBaseUrl = _this.getBaseUrl.bind(_this);
    _this.getRenderedComponent = _AppLayoutMap.getRenderedComponent.bind(_this);
    return _this;
  }

  (0, _createClass3.default)(ResponsiveNavBar, [{
    key: 'componentWillMount',
    value: function componentWillMount() {
      var _this2 = this;

      var newActiveIndex = this.props.navSections.map(function (section, idx) {
        if (_this2.props.navData && _this2.props.navData[idx]) {
          _this2.props.navData[idx].map(function (link, linkIdx) {
            var linkURL = _this2.getBaseUrl(section.baseURL, _this2.props.params, _this2.props, linkIdx);
            link.linkURL = linkURL;
          });
        }
        return idx;
      });
      this.setState({
        activeIndex: newActiveIndex
      });
    }
  }, {
    key: 'getBaseUrl',
    value: function getBaseUrl(baseurl, params, prop, index) {
      var returnLink = baseurl;
      if (params && params.length > 0) {
        params.forEach(function (param) {
          if (param.key === ":index") {
            returnLink = returnLink.replace(":index", index);
          } else {
            returnLink = returnLink.replace(param.key, prop[param.val]);
          }
        });
      }
      return returnLink;
    }
  }, {
    key: 'handleClick',
    value: function handleClick(e, titleProps) {
      var index = titleProps.index;
      var activeIndex = this.state.activeIndex;

      if (activeIndex.indexOf(index) === -1) {
        this.setState({
          activeIndex: [].concat((0, _toConsumableArray3.default)(activeIndex), [index])
        });
      } else {
        var newIndexArray = activeIndex;
        newIndexArray.splice(newIndexArray.indexOf(index), 1);
        this.setState({
          activeIndex: newIndexArray
        });
      }
    }
  }, {
    key: 'updateSinglePageIndex',
    value: function updateSinglePageIndex(indexArr) {
      this.setState({
        activeSinglePageIndex: indexArr
      });
    }
  }, {
    key: 'getPropsForOnClick',
    value: function getPropsForOnClick(component) {
      return {
        clickprop: component.props.onClick,
        clickThisProp: component.props.onclickThisProp,
        clickAddPropObject: component.props.onclickAddProp,
        clickPropObject: component.props.onclickPropObject,
        clickBaseUrl: component.props.onclickBaseUrl,
        clickLinkParams: component.props.onclickLinkParams,
        clickPassProps: component.props.onclickProps,
        clickFetchProps: component.props.fetchProps,
        clickSuccessProps: component.props.successProps,
        thisDotProp: component.props
      };
    }
  }, {
    key: 'getButtonLink',
    value: function getButtonLink(baseurl, params, prop) {
      var returnLink = baseurl;
      try {
        if (params && params.length > 0) {
          params.forEach(function (param) {
            returnLink = returnLink.replace(param.key, prop[param.val]);
          });
        }
      } catch (e) {
        console.debug(e, { baseurl: baseurl, params: params, prop: prop });
      }
      return returnLink;
    }
  }, {
    key: 'getSinglePageNav',
    value: function getSinglePageNav(section, sectionIdx) {
      var _this3 = this;

      var onclickFunction = function onclickFunction(data) {
        console.debug('ResponsiveButton', { data: data });
      };

      var itemProps = this.props.linkProps && this.props.linkProps.className ? this.props.linkProps.className : '';
      var subMenu = this.props.navData[sectionIdx].map(function (link, linkIdx) {
        var itemProps = _this3.props.linkProps && _this3.props.linkProps.className ? _this3.props.linkProps.className : '';
        var activeClass = _this3.state.activeSinglePageIndex[0] === sectionIdx && _this3.state.activeSinglePageIndex[1] === linkIdx ? 'active-nav-link nav-link' + itemProps : 'nav-link' + itemProps;
        var navLink = void 0;
        var customComponents = void 0;

        if (link.navButton && link.navButton.component === 'ResponsiveButton') {
          var _getPropsForOnClick = _this3.getPropsForOnClick(link.navButton),
              thisDotProp = _getPropsForOnClick.thisDotProp,
              clickThisProp = _getPropsForOnClick.clickThisProp,
              clickPropObject = _getPropsForOnClick.clickPropObject,
              clickBaseUrl = _getPropsForOnClick.clickBaseUrl,
              clickLinkParams = _getPropsForOnClick.clickLinkParams,
              clickPassProps = _getPropsForOnClick.clickPassProps,
              clickprop = _getPropsForOnClick.clickprop,
              clickFetchProps = _getPropsForOnClick.clickFetchProps,
              clickSuccessProps = _getPropsForOnClick.clickSuccessProps,
              clickAddPropObject = _getPropsForOnClick.clickAddPropObject;

          var linkSelectionProp = clickThisProp ? thisDotProp[clickThisProp] : clickPropObject || _this3.props;
          var onclickProp = clickBaseUrl ? _this3.getButtonLink(clickBaseUrl, clickLinkParams, linkSelectionProp) : clickPassProps || clickPropObject;

          if (clickAddPropObject && linkSelectionProp) {
            linkSelectionProp[clickAddPropObject] = _this3.props[clickAddPropObject];
          }
          if (clickAddPropObject && onclickProp) {
            onclickProp[clickAddPropObject] = _this3.props[clickAddPropObject];
          }

          if (typeof clickprop === 'string' && clickprop.indexOf('func:this.props.reduxRouter') !== -1) {
            onclickFunction = _this3.props.reduxRouter[clickprop.replace('func:this.props.reduxRouter.', '')];
          } else if (typeof clickprop === 'string' && clickprop.indexOf('func:this.funcs') !== -1) {
            onclickFunction = _this3.funcs[clickprop.replace('func:this.funcs.', '')];
          } else if (typeof clickprop === 'string' && clickprop.indexOf('func:window') !== -1) {
            onclickFunction = window[clickprop.replace('func:window.', '')].bind(_this3);
          } else if (typeof clickprop === 'string' && clickprop.indexOf('func:this.props') !== -1) {

            onclickFunction = _this3.props[clickprop.replace('func:this.props.', '')];
          } else if (typeof clickprop === 'function') {
            onclickFunction = clickprop;
          }

          navLink = _this3.getRenderedComponent({
            component: 'ResponsiveButton',
            children: link.navButton.children,
            props: (0, _assign2.default)({}, {
              onClick: function onClick() {
                _this3.updateSinglePageIndex([sectionIdx, linkIdx]);
                onclickFunction.call(_this3, onclickProp, clickFetchProps, clickSuccessProps);
              },
              buttonProps: link.navButton.props && link.navButton.props.buttonProps ? link.navButton.props.buttonProps : undefined,
              style: link.navButton.style,
              className: link.navButton.className
            })
          });
        } else if (link.navButton && link.navButton.component !== 'ResponsiveButton') {
          navLink = _this3.getRenderedComponent(link.navButton);
        }
        if (link.customComponents && Array.isArray(link.customComponents)) {
          customComponents = _react2.default.createElement(
            'div',
            null,
            link.customComponents.map(function (component) {
              return _this3.getRenderedComponent(component);
            })
          );
        }

        return _react2.default.createElement(
          'div',
          (0, _extends3.default)({}, _this3.props.itemProps, {
            key: sectionIdx + '-' + linkIdx,
            className: activeClass }),
          navLink,
          customComponents
        );
      });
      return subMenu;
    }
  }, {
    key: 'getMultipageNav',
    value: function getMultipageNav(section, sectionIdx) {
      var _this4 = this;

      var subMenu = this.props.navData[sectionIdx].map(function (link, linkIdx) {
        var itemProps = _this4.props.linkProps && _this4.props.linkProps.className ? _this4.props.linkProps.className : '';
        var activeClass = link.linkURL === _this4.props.location.pathname ? 'active-nav-link nav-link' + itemProps : 'nav-link' + itemProps;
        return _react2.default.createElement(
          'div',
          (0, _extends3.default)({}, _this4.props.itemProps, {
            key: sectionIdx + '-' + linkIdx,
            className: activeClass }),
          _react2.default.createElement(
            _reactRouter.Link,
            (0, _extends3.default)({
              to: link.linkURL
            }, _this4.props.linkProps),
            link.name
          ),
          section.buttons ? section.buttons.map(function (button) {
            return _this4.getRenderedComponent((0, _assign2.default)({
              component: 'ResponsiveButton',
              props: (0, _assign2.default)({
                buttonProps: {}
              }, button.passProps, {
                onclickProps: _this4.getBaseUrl(button.passProps.onclickBaseUrl, button.passProps.onclickLinkParams, _this4.props, linkIdx),
                onclickBaseUrl: null,
                onclickLinkParams: null
              })
            }));
          }) : null
        );
      });
      return subMenu;
    }
  }, {
    key: 'render',
    value: function render() {
      var _this5 = this;

      var _state = this.state,
          activeIndex = _state.activeIndex,
          activeSinglePageIndex = _state.activeSinglePageIndex;

      var navMenu = this.props.navSections.map(function (section, sectionIdx) {
        if (section.toggle && !_this5.props.toggleData[section.toggle]) {
          return;
        }
        var subMenu = _this5.props.navType === 'singlePage' ? _this5.getSinglePageNav(section, sectionIdx) : _this5.getMultipageNav(section, sectionIdx);
        var activeStatus = _this5.props.allActive ? true : activeIndex.indexOf(sectionIdx) !== -1;
        return _react2.default.createElement(
          _semanticUiReact.Menu.Item,
          _this5.props.sectionProps,
          _react2.default.createElement(_semanticUiReact.Accordion.Title, (0, _extends3.default)({
            active: activeStatus,
            index: sectionIdx, onClick: _this5.handleClick,
            content: section.title
          }, _this5.props.titleProps)),
          _react2.default.createElement(
            _semanticUiReact.Accordion.Content,
            (0, _extends3.default)({
              active: activeStatus
            }, _this5.props.contentProps),
            subMenu
          )
        );
      });
      return _react2.default.createElement(
        _semanticUiReact.Accordion,
        (0, _extends3.default)({
          as: _semanticUiReact.Menu,
          vertical: true
        }, this.props.accordionProps),
        navMenu
      );
    }
  }]);
  return ResponsiveNavBar;
}(_react.Component);

ResponsiveNavBar.propType = propTypes;
ResponsiveNavBar.defaultProps = defaultProps;

exports.default = ResponsiveNavBar;