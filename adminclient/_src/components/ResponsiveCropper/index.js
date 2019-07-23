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

var _AppLayoutMap = require('../AppLayoutMap');

var _styles = require('../../styles');

var _styles2 = _interopRequireDefault(_styles);

var _reactCropper = require('react-cropper');

var _reactCropper2 = _interopRequireDefault(_reactCropper);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var propTypes = {
  getFileData: _react.PropTypes.func,
  getCropperBoxData: _react.PropTypes.func
};

var defaultProps = {
  cropbox: {
    left: 0,
    top: 0,
    width: 100,
    height: 100
  }

};

var ResponsiveCropper = function (_Component) {
  (0, _inherits3.default)(ResponsiveCropper, _Component);

  function ResponsiveCropper(props) {
    (0, _classCallCheck3.default)(this, ResponsiveCropper);

    var _this = (0, _possibleConstructorReturn3.default)(this, (ResponsiveCropper.__proto__ || (0, _getPrototypeOf2.default)(ResponsiveCropper)).call(this, props));

    _this.getRenderedComponent = _AppLayoutMap.getRenderedComponent.bind(_this);
    _this.state = {
      src: props.src || null,
      cropbox: { "height": 0, "width": 0, "x": 0, "y": 0 },
      scaledcropbox: props.cropperProps.data || { "height": 0, "width": 0, "x": 0, "y": 0 }
    };
    return _this;
  }

  (0, _createClass3.default)(ResponsiveCropper, [{
    key: 'onSelectFile',
    value: function onSelectFile(e) {
      var self = this;
      if (e.target.files && e.target.files.length > 0) {
        var reader = new FileReader();
        var files = e.target;
        reader.addEventListener('load', function () {
          return self.setState({
            src: reader.result
          }, function () {
            if (self.props.getFileData) {
              self.props.getFileData(files);
            }
          });
        }, false);
        reader.readAsDataURL(e.target.files[0]);
      }
    }
  }, {
    key: 'onCropComplete',
    value: function onCropComplete(e) {
      var self = this;
      var boxData = self.refs.cropper.getCropBoxData();
      var imageData = self.refs.cropper.getImageData();
      var canvasData = self.refs.cropper.getCanvasData();
      var ratio = imageData.naturalHeight / imageData.height;
      var scaledBoxData = (0, _assign2.default)({}, boxData, {
        height: boxData.height * ratio,
        width: boxData.width * ratio,
        x: (boxData.left - canvasData.left) * ratio,
        y: (boxData.top - canvasData.top) * ratio
      });
      if (self.props.getCropperBoxData) {
        self.props.getCropperBoxData(scaledBoxData);
      }
      this.setState({
        cropbox: {
          x: boxData.left,
          y: boxData.top,
          width: boxData.width,
          height: boxData.height
        },
        scaledcropbox: scaledBoxData
      }, function () {
        self.refs.cropper.setCropBoxData(boxData);
      });
    }
  }, {
    key: 'render',
    value: function render() {
      var self = this;
      var onCropEnd = self.onCropComplete.bind(self);
      var onFileSelect = self.onSelectFile.bind(self);
      var fileInput = self.props.includeFileInput ? _react2.default.createElement(
        'div',
        null,
        _react2.default.createElement('input', (0, _extends3.default)({ type: 'file', onChange: onFileSelect }, self.props.fileInputProps))
      ) : null;
      var cropperProps = self.props.cropperProps || {};
      var formatted_data = { x: this.state.scaledcropbox.x, y: this.state.scaledcropbox.y, width: this.state.scaledcropbox.width, height: this.state.scaledcropbox.height };
      return _react2.default.createElement(
        'div',
        { style: { height: 'auto', width: 'auto' } },
        fileInput,
        this.state.src && _react2.default.createElement(_reactCropper2.default, (0, _extends3.default)({}, cropperProps, {
          data: formatted_data,
          src: this.state.src,
          ref: 'cropper',
          aspectRatio: cropperProps.aspectRatio || NaN,
          cropend: onCropEnd
        }))
      );
    }
  }]);
  return ResponsiveCropper;
}(_react.Component);

ResponsiveCropper.propTypes = propTypes;
ResponsiveCropper.defaultProps = defaultProps;

exports.default = ResponsiveCropper;