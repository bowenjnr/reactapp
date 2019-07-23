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

var _reactcss = require('reactcss');

var _reactcss2 = _interopRequireDefault(_reactcss);

var _reactColor = require('react-color');

var _reBulma = require('re-bulma');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var ColorPicker = function (_React$Component) {
  (0, _inherits3.default)(ColorPicker, _React$Component);

  function ColorPicker(props) {
    (0, _classCallCheck3.default)(this, ColorPicker);

    var _this = (0, _possibleConstructorReturn3.default)(this, (ColorPicker.__proto__ || (0, _getPrototypeOf2.default)(ColorPicker)).call(this, props));

    _this.state = {
      displayColorPicker: false,
      color: _this.props.color || '#ccc'
    };
    _this.handleClick = _this.handleClick.bind(_this);
    _this.handleClose = _this.handleClose.bind(_this);
    _this.handleChange = _this.handleChange.bind(_this);
    return _this;
  }

  (0, _createClass3.default)(ColorPicker, [{
    key: 'handleClick',
    value: function handleClick() {
      this.setState({ displayColorPicker: !this.state.displayColorPicker });
    }
  }, {
    key: 'handleClose',
    value: function handleClose() {
      this.setState({ displayColorPicker: false });
    }
  }, {
    key: 'handleChange',
    value: function handleChange(color) {
      this.setState({ color: color.hex });
    }
  }, {
    key: 'componentWillUpdate',
    value: function componentWillUpdate(nextProps, nextState) {
      if (nextProps.color !== nextState.color) {
        this.setState({ color: nextProps.color });
      }
    }
  }, {
    key: 'render',
    value: function render() {
      var colorStyle = this.props.colorStyle || {};
      var swatchStyle = this.props.swatchStyle || {};
      var popoverStyle = this.props.popoverStyle || {};
      var coverStyle = this.props.coverStyle || {};
      var sketchPickerProps = this.props.sketchPickerProps || {};
      var styles = (0, _reactcss2.default)({
        'default': {
          color: (0, _assign2.default)({
            width: '36px',
            height: '14px',
            borderRadius: '2px',
            background: this.state.color
          }, colorStyle),
          swatch: (0, _assign2.default)({
            padding: '5px',
            background: this.state.color,
            borderRadius: '1px',
            boxShadow: '0 0 0 1px rgba(0,0,0,.1)',
            display: 'inline-block',
            cursor: 'pointer'
          }, swatchStyle),
          popover: (0, _assign2.default)({
            // position: 'absolute',
            // zIndex: '2',
          }, popoverStyle),
          cover: (0, _assign2.default)({
            position: 'fixed',
            top: '0px',
            right: '0px',
            bottom: '0px',
            left: '0px'
          }, coverStyle)
        }
      });

      return _react2.default.createElement(
        'div',
        null,
        _react2.default.createElement(
          'div',
          { style: styles.swatch, onClick: this.handleClick },
          _react2.default.createElement('div', { style: styles.color })
        ),
        this.state.displayColorPicker ? _react2.default.createElement(
          'div',
          { style: styles.popover },
          _react2.default.createElement('div', { style: styles.cover, onClick: this.handleClose }),
          _react2.default.createElement(_reactColor.SketchPicker, (0, _extends3.default)({ color: this.state.color, disableAlpha: true, onChange: this.props.onChange || this.handleChange }, sketchPickerProps))
        ) : null
      );
    }
  }]);
  return ColorPicker;
}(_react2.default.Component);

var propTypes = {};

ColorPicker.propTypes = propTypes;
ColorPicker.defaultProps = {};

exports.default = ColorPicker;