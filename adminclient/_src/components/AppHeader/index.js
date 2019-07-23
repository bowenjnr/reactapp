'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof2 = require('babel-runtime/helpers/typeof');

var _typeof3 = _interopRequireDefault(_typeof2);

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

var _reBulma = require('re-bulma');

var _reactRouter = require('react-router');

require('@fortawesome/fontawesome-pro/css/all.css');

require('font-awesome/css/font-awesome.css');

var _styles = require('../../styles');

var _styles2 = _interopRequireDefault(_styles);

var _route_prefixes = require('../../../../utilities/route_prefixes');

var _capitalize = require('capitalize');

var _capitalize2 = _interopRequireDefault(_capitalize);

var _AppLayoutMap = require('../AppLayoutMap');

var _semanticUiReact = require('semantic-ui-react');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// FormHorizontal, NavToggle, ControlLabel, Group,
var AppHeader = function (_Component) {
  (0, _inherits3.default)(AppHeader, _Component);

  function AppHeader(props /*, context*/) {
    (0, _classCallCheck3.default)(this, AppHeader);

    var _this = (0, _possibleConstructorReturn3.default)(this, (AppHeader.__proto__ || (0, _getPrototypeOf2.default)(AppHeader)).call(this, props));

    _this.state = {
      ui: props.ui,
      user: props.user
    };
    _this.all_prefixes = (0, _route_prefixes.all_prefixes)(props.settings.adminPath);
    _this.getRenderedComponent = _AppLayoutMap.getRenderedComponent.bind(_this);
    return _this;
  }

  (0, _createClass3.default)(AppHeader, [{
    key: 'componentWillReceiveProps',
    value: function componentWillReceiveProps(nextProps) {
      this.setState({
        ui: nextProps.ui,
        user: nextProps.user
      });
    }
  }, {
    key: 'render',
    value: function render() {
      var _this2 = this;

      // console.debug('this.all_prefixes.manifest_prefix', this.all_prefixes.manifest_prefix);
      var buttonColor = this.props.settings.ui.header.buttonColor;
      var globalSearch = this.props.settings.ui.header.useGlobalSearch ? _react2.default.createElement(
        _reBulma.NavGroup,
        { align: 'center', style: { flex: 3 } },
        _react2.default.createElement(
          _reBulma.NavItem,
          { style: _styles2.default.fullWidth },
          _react2.default.createElement(_reBulma.Input, { type: 'text', placeholder: 'Search', isExpanded: true, style: _styles2.default.fullWidth })
        )
      ) : null;

      var logoImage = this.getRenderedComponent({
        component: 'ResponsiveLink',
        props: {
          location: '/',
          style: {
            height: '40px',
            display: 'inline-flex'
          }
        },
        children: [{
          component: 'img',
          props: {
            src: this.props.settings.ui.header.customLogo || '/favicon.png',
            alt: '' + this.props.settings.name,
            style: {
              maxHeight: 'none',
              height: '100%',
              width: 'auto'
            }
          }
        }]
      });
      var profileStyle = (0, _assign2.default)({
        width: '42px',
        height: '42px',
        display: 'inline-block',
        backgroundColor: 'white',
        borderRadius: '24px',
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat'
      }, this.props.settings.ui.header.profileImageStyle, {
        backgroundImage: 'url(' + (this.props.user.profile_image_preview || this.props.settings.default_user_image || '/favicon.png') + ')'
      });
      var getRerouteLink = function getRerouteLink(link) {
        return _react2.default.createElement(
          'a',
          { href: link.reroute ? link.reroute : '', target: '_blank' },
          _react2.default.createElement(
            'span',
            null,
            link.text
          ),
          _react2.default.createElement(_reBulma.Icon, { icon: 'fa fa-external-link' })
        );
      };
      var organizationProducts = this.props.user && this.props.user.userdata && this.props.user.userdata.association.organization && this.props.user.userdata.association.organization.products ? this.props.user.userdata.association.organization.products : {};
      var dropdownLinks = this.props.settings.ui.header.productHeader.productLinks.length > 0 ? this.props.settings.ui.header.productHeader.productLinks.map(function (link) {
        var isProduct = link.product;
        var display = link.type && _this2.props.user.userdata && _this2.props.user.userdata.userroles && _this2.props.user.userdata.userroles[0] && _this2.props.user.userdata.userroles[0].name !== link.type ? 'none' : undefined;
        if (isProduct && organizationProducts) {
          display = display !== 'none' && organizationProducts[link.name] && organizationProducts[link.name].active ? undefined : 'none';
        }
        var userrole = _this2.props.user && _this2.props.user.userdata && _this2.props.user.userdata.userroles[0] && _this2.props.user.userdata.userroles[0].name ? _this2.props.user.userdata.userroles[0].name : 'user';
        var location = userrole && link[userrole] ? link[userrole] : link.location;
        return _react2.default.createElement(_semanticUiReact.Dropdown.Item, {
          style: { display: display },
          children: link.reroute ? getRerouteLink(link) : null,
          text: link.reroute ? null : link.text,
          onClick: function onClick() {
            location ? _this2.props.reduxRouter.push(location) : link.logoutUser ? _this2.props.logoutUser() : null;
          },
          className: link.className ? link.className : ''
        });
      }) : null;
      return _react2.default.createElement(
        _reBulma.Hero,
        { color: this.props.settings.ui.header.color, isBold: this.props.settings.ui.header.isBold, style: (0, _assign2.default)(_styles2.default.fixedTop, _styles2.default.navContainer, this.props.settings.ui.header.containerStyle),
          className: this.props.settings.ui.initialization.show_header || this.props.user.isLoggedIn ? 'animated fadeInDown Header-Speed' : 'animated slideOutDown Header-Speed' },
        this.props.ui && this.props.ui.components && this.props.ui.components.header && (0, _typeof3.default)(this.props.ui.components.header) === 'object' && this.props.ui.components.header.layout ? this.getRenderedComponent(this.props.ui.components.header.layout) : _react2.default.createElement(
          _reBulma.HeroHead,
          null,
          _react2.default.createElement(
            _reBulma.Container,
            null,
            _react2.default.createElement(
              _reBulma.Nav,
              { style: { boxShadow: 'none' } },
              _react2.default.createElement(
                _reBulma.NavGroup,
                { align: 'left', style: { overflow: 'visible' } },
                _react2.default.createElement(
                  _reBulma.NavItem,
                  null,
                  this.props.settings.ui.header.customDropdownNav ? logoImage : this.props.settings.ui.header.customButton && (0, _typeof3.default)(this.props.settings.ui.header.customButton) === 'object' && this.props.settings.ui.header.customButton.layout ? this.getRenderedComponent(this.props.settings.ui.header.customButton) : _react2.default.createElement(_reBulma.Button, { onClick: this.props.toggleUISidebar, buttonStyle: 'isOutlined', color: buttonColor, icon: 'fa fa-bars', style: _styles2.default.iconButton })
                ),
                this.props.settings.ui.header.customDropdownNav ? _react2.default.createElement(
                  _reBulma.NavItem,
                  { style: (0, _assign2.default)({ padding: 0, alignItems: 'stretch' }, this.props.settings.ui.header.navLabelStyle) },
                  _react2.default.createElement(
                    _semanticUiReact.Dropdown,
                    { text: this.props.ui.nav_label, style: (0, _assign2.default)({ display: 'flex', alignItems: 'center', padding: '10px' }, this.props.settings.ui.header.navLabelStyle) },
                    _react2.default.createElement(
                      _semanticUiReact.Dropdown.Menu,
                      null,
                      dropdownLinks
                    )
                  )
                ) : _react2.default.createElement(
                  _reBulma.NavItem,
                  { style: (0, _assign2.default)({ justifyContent: 'flex-start' }, _styles2.default.fullWidth) },
                  !this.props.settings.ui.header.useGlobalSearch && this.props.ui.nav_label ? _react2.default.createElement(
                    _reBulma.NavItem,
                    null,
                    _react2.default.createElement(
                      'span',
                      { style: (0, _assign2.default)({ fontSize: '20px' }, this.props.settings.ui.header.navLabelStyle) },
                      this.props.ui.nav_label
                    )
                  ) : null
                )
              ),
              globalSearch,
              _react2.default.createElement(
                _reBulma.NavGroup,
                { align: 'right', isMenu: true },
                _react2.default.createElement(
                  _reBulma.NavItem,
                  null,
                  _react2.default.createElement(
                    _reactRouter.Link,
                    { to: this.all_prefixes.manifest_prefix + 'account/profile', style: (0, _assign2.default)({ fontSize: '20px' }, _styles2.default.noUnderline, this.props.settings.ui.header.userNameStyle) },
                    (0, _capitalize2.default)(this.state.user.userdata.first_name || '') + ' ' + (0, _capitalize2.default)(this.state.user.userdata.last_name || '')
                  )
                ),
                _react2.default.createElement(
                  _reBulma.NavItem,
                  null,
                  this.getRenderedComponent({
                    component: 'ResponsiveLink',
                    props: {
                      location: this.all_prefixes.manifest_prefix + 'account/profile',
                      style: profileStyle
                    }
                  })
                ),
                this.state.user.isLoggedIn && this.props.settings.ui && this.props.settings.ui.header && this.props.settings.ui.header.useHeaderLogout ? _react2.default.createElement(
                  _reBulma.NavItem,
                  null,
                  _react2.default.createElement(_reBulma.Button, { buttonStyle: 'isOutlined', onClick: this.props.logoutUser, color: buttonColor, icon: 'fa fa-sign-out', style: (0, _assign2.default)({ paddingRight: 0 }, _styles2.default.noMarginLeftRight) })
                ) : null
              )
            )
          )
        )
      );
    }
  }]);
  return AppHeader;
}(_react.Component);
// import ResponsiveLink from '../ResponsiveLink';


exports.default = AppHeader;