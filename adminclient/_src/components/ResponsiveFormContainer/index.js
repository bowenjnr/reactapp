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

var _AppLayoutMap = require('../AppLayoutMap');

var _ResponsiveForm = require('../ResponsiveForm');

var _ResponsiveForm2 = _interopRequireDefault(_ResponsiveForm);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// import console = require('console');

var propTypes = {
  form: _react.PropTypes.object,
  renderFormElements: _react.PropTypes.object,
  validations: _react.PropTypes.object
};

var defaultProps = {
  form: {},
  validations: {},
  renderFormElements: {}
};

var ResponsiveFormContainer = function (_Component) {
  (0, _inherits3.default)(ResponsiveFormContainer, _Component);

  function ResponsiveFormContainer(props) {
    (0, _classCallCheck3.default)(this, ResponsiveFormContainer);

    var _this = (0, _possibleConstructorReturn3.default)(this, (ResponsiveFormContainer.__proto__ || (0, _getPrototypeOf2.default)(ResponsiveFormContainer)).call(this, props));

    _this.state = {};
    _this.updateFormLayout = _this.updateFormLayout.bind(_this);
    _this.updateFormGroup = _this.updateFormGroup.bind(_this);
    _this.updateValidations = _this.updateValidations.bind(_this);
    _this.updateDoubleCardFormGroup = _this.updateDoubleCardFormGroup.bind(_this);
    return _this;
  }

  (0, _createClass3.default)(ResponsiveFormContainer, [{
    key: 'componentWillMount',
    value: function componentWillMount() {
      this.formgroups = this.props.formgroups.slice();
      this.props.form.formgroups = this.props.formgroups.slice();
      this.props.form.validations = this.updateValidations();
    }
  }, {
    key: 'updateFormGroup',
    value: function updateFormGroup(options) {
      var formgroup = options.formgroup,
          prevState = options.prevState,
          currState = options.currState,
          order = options.order;

      var formElementsQueue = [];
      formElementsQueue.push.apply(formElementsQueue, (0, _toConsumableArray3.default)(formgroup.formElements.slice()));
      formgroup.formElements = order && order.length ? order.map(function (el) {
        return false;
      }) : [];
      while (formElementsQueue.length > 0) {
        var currentElement = formElementsQueue.shift();
        if (currentElement.name && this.props.renderFormElements[currentElement.name]) {
          currentElement = window[this.props.renderFormElements[currentElement.name].replace('func:window.', '')].call(this, currState, formElementsQueue, currentElement, prevState);
          if (currentElement) {
            if (order && order.length) formgroup.formElements[order.indexOf(currentElement.name)] = currentElement;else formgroup.formElements.push(currentElement);
          }
        } else {
          if (order && order.length) formgroup.formElements[order.indexOf(currentElement.name)] = currentElement;else formgroup.formElements.push(currentElement);
        }
      }
      formgroup.formElements = formgroup.formElements.filter(function (el) {
        return el !== false;
      });
      return formgroup;
    }
  }, {
    key: 'updateDoubleCardFormGroup',
    value: function updateDoubleCardFormGroup(options) {
      var formgroup = options.formgroup,
          prevState = options.prevState,
          currState = options.currState,
          prop = options.prop,
          order = options.order;

      var formElementsQueue = [];
      formElementsQueue.push.apply(formElementsQueue, (0, _toConsumableArray3.default)(formgroup.formElements[0][prop].slice()));

      formgroup.formElements[0][prop] = order && order.length ? order.map(function (el) {
        return false;
      }) : [];
      while (formElementsQueue.length > 0) {
        var currentElement = formElementsQueue.shift();
        if (currentElement.name && this.props.renderFormElements[currentElement.name]) {
          currentElement = window[this.props.renderFormElements[currentElement.name].replace('func:window.', '')].call(this, currState, formElementsQueue, currentElement, prevState);
          if (currentElement) {
            if (order && order.length) formgroup.formElements[0][prop][order.indexOf(currentElement.name)] = currentElement;else formgroup.formElements[0][prop].push(currentElement);
          }
        } else {
          if (order && order.length) formgroup.formElements[0][prop][order.indexOf(currentElement.name)] = currentElement;else formgroup.formElements[0][prop].push(currentElement);
        }
      }
      formgroup.formElements[0][prop] = formgroup.formElements[0][prop].filter(function (el) {
        return el !== false;
      });
      return formgroup;
    }
  }, {
    key: 'updateValidations',
    value: function updateValidations(options) {
      var _this2 = this;

      var formElements = [];
      this.props.form.formgroups.forEach(function (formgroup) {
        if (formgroup.gridElements) {
          formgroup.gridElements.map(function (grid) {
            if (grid.formElements) formElements.push.apply(formElements, (0, _toConsumableArray3.default)(grid.formElements));
          });
        } else if (formgroup.formElements[0].formGroupCardLeft && formgroup.formElements[0].formGroupCardRight) {
          formElements.push.apply(formElements, (0, _toConsumableArray3.default)(formgroup.formElements[0].formGroupCardLeft));
          formElements.push.apply(formElements, (0, _toConsumableArray3.default)(formgroup.formElements[0].formGroupCardRight));
        } else if (formgroup.formElements[0].formGroupElementsLeft && formgroup.formElements[0].formGroupElementsRight) {
          formElements.push.apply(formElements, (0, _toConsumableArray3.default)(formgroup.formElements[0].formGroupElementsLeft));
          formElements.push.apply(formElements, (0, _toConsumableArray3.default)(formgroup.formElements[0].formGroupElementsRight));
        } else if (formgroup.formElements) {
          formElements.push.apply(formElements, (0, _toConsumableArray3.default)(formgroup.formElements));
        }
      });
      var validations = formElements.reduce(function (valArr, formElement) {
        if (formElement.type === 'group') {
          formElement.groupElements.map(function (element) {
            if (element.name && _this2.props.validations[element.name]) valArr.push(_this2.props.validations[element.name]);
          });
        } else if (formElement.name && _this2.props.validations[formElement.name]) valArr.push(_this2.props.validations[formElement.name]);
        return valArr;
      }, []);
      return validations;
    }
  }, {
    key: 'updateFormLayout',
    value: function updateFormLayout(prevState, currState) {
      var _this3 = this;

      this.props.form.formgroups = this.props.form.formgroups.map(function (formgroup) {
        if (formgroup.gridElements) {
          formgroup.gridElements.map(function (grid) {
            if (grid.formElements) return _this3.updateFormGroup({ formgroup: grid, prevState: prevState, currState: currState, order: grid.order });
          });
          return formgroup;
        } else if (formgroup.formElements[0].formGroupCardLeft && formgroup.formElements[0].formGroupCardRight) {
          formgroup = _this3.updateDoubleCardFormGroup({ formgroup: formgroup, prevState: prevState, currState: currState, prop: 'formGroupCardLeft', order: formgroup.formElements[0].leftOrder });
          formgroup = _this3.updateDoubleCardFormGroup({ formgroup: formgroup, prevState: prevState, currState: currState, prop: 'formGroupCardRight', order: formgroup.formElements[0].rightOrder });
          return formgroup;
        } else if (formgroup.formElements[0].formGroupElementsLeft && formgroup.formElements[0].formGroupElementsRight) {
          formgroup = _this3.updateDoubleCardFormGroup({ formgroup: formgroup, prevState: prevState, currState: currState, prop: 'formGroupElementsLeft', order: formgroup.formElements[0].leftOrder });
          formgroup = _this3.updateDoubleCardFormGroup({ formgroup: formgroup, prevState: prevState, currState: currState, prop: 'formGroupElementsRight', order: formgroup.formElements[0].rightOrder });
          return formgroup;
        } else if (formgroup.formElements) {
          return _this3.updateFormGroup({ formgroup: formgroup, prevState: prevState, currState: currState, order: formgroup.order });
        } else {
          return formgroup;
        }
      });
      var validations = this.updateValidations();
      return { validations: validations };
    }
  }, {
    key: 'render',
    value: function render() {
      var validations = this.updateValidations();
      var passedProps = (0, _assign2.default)({}, this.props, this.props.form, { validations: validations });
      return _react2.default.createElement(
        'div',
        null,
        _react2.default.createElement(_ResponsiveForm2.default, (0, _extends3.default)({ updateFormLayout: this.updateFormLayout
        }, passedProps, { hasContainer: true })),
        this.props.children
      );
    }
  }]);
  return ResponsiveFormContainer;
}(_react.Component);

ResponsiveFormContainer.propTypes = propTypes;
ResponsiveFormContainer.defaultProps = defaultProps;

exports.default = ResponsiveFormContainer;