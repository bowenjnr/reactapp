'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _typeof2 = require('babel-runtime/helpers/typeof');

var _typeof3 = _interopRequireDefault(_typeof2);

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

var _keys = require('babel-runtime/core-js/object/keys');

var _keys2 = _interopRequireDefault(_keys);

var _stringify = require('babel-runtime/core-js/json/stringify');

var _stringify2 = _interopRequireDefault(_stringify);

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

var _ResponsiveCard = require('../ResponsiveCard');

var _ResponsiveCard2 = _interopRequireDefault(_ResponsiveCard);

var _AppLayoutMap = require('../AppLayoutMap');

var _util = require('../../util');

var _util2 = _interopRequireDefault(_util);

var _FormElements = require('./FormElements');

var _FormHelpers = require('./FormHelpers');

var _flat = require('flat');

var _flat2 = _interopRequireDefault(_flat);

var _querystring = require('querystring');

var _querystring2 = _interopRequireDefault(_querystring);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// function getCallbackFromString(fetchOptions.successCallback) {

var propTypes = {
  hasContainer: _react.PropTypes.bool,
  updateFormLayout: _react.PropTypes.func,
  notificationForm: _react.PropTypes.any,
  flattenFormData: _react.PropTypes.bool,
  stringyFormData: _react.PropTypes.bool,
  useFormOptions: _react.PropTypes.bool,
  uniqueFormOptions: _react.PropTypes.bool,
  setInitialValues: _react.PropTypes.bool,
  flattenDataOptions: _react.PropTypes.object,
  useErrorNotification: _react.PropTypes.bool,
  useDynamicData: _react.PropTypes.bool,
  cardForm: _react.PropTypes.bool,
  cardFormProps: _react.PropTypes.object,
  passProps: _react.PropTypes.object,
  formdata: _react.PropTypes.object,
  __formOptions: _react.PropTypes.object,
  onSubmit: _react.PropTypes.any,
  validations: _react.PropTypes.array,
  hiddenFields: _react.PropTypes.array,
  footergroups: _react.PropTypes.array,
  onlyUpdateStateOnSubmit: _react.PropTypes.bool,
  formgroups: _react.PropTypes.oneOfType([_react.PropTypes.bool, _react.PropTypes.object])
};

var defaultProps = {
  notificationForm: false,
  flattenFormData: false,
  useFormOptions: false,
  uniqueFormOptions: false,
  useDynamicData: false,
  setInitialValues: true,
  useErrorNotification: true,
  dynamicResponseField: false,
  dynamicField: false,
  blockPageUI: false,
  cardForm: false,
  useLoadingButtons: false,
  includeFormDataOnLayout: false,
  onSubmit: 'func:this.props.debug',
  formgroups: [],
  updateStateOnSubmit: false,
  updateFormLayout: function updateFormLayout() {},
  hasContainer: false,
  validations: []
};

function getFunctionFromProps(options) {
  var propFunc = options.propFunc;


  if (typeof propFunc === 'string' && propFunc.indexOf('func:this.props.reduxRouter') !== -1) {
    return this.props.reduxRouter[this.props.replace('func:this.props.reduxRouter.', '')];
  } else if (typeof propFunc === 'string' && propFunc.indexOf('func:this.props') !== -1) {
    return this.props[this.props.replace('func:this.props.', '')];
  } else if (typeof propFunc === 'string' && propFunc.indexOf('func:window') !== -1 && typeof window[propFunc.replace('func:window.', '')] === 'function') {
    return window[propFunc.replace('func:window.', '')];
  } else if (typeof this.props[propFunc] === 'function') {
    return propFunc;
  }
}

var ResponsiveForm = function (_Component) {
  (0, _inherits3.default)(ResponsiveForm, _Component);

  function ResponsiveForm(props) {
    (0, _classCallCheck3.default)(this, ResponsiveForm);

    // console.debug('initialformdata', setFormNameFields.call(this,{ formElementFields: [], formdata: {}, }));
    // console.debug({ props });
    var _this = (0, _possibleConstructorReturn3.default)(this, (ResponsiveForm.__proto__ || (0, _getPrototypeOf2.default)(ResponsiveForm)).call(this, props));

    var formdata = (0, _assign2.default)({}, _FormHelpers.setFormNameFields.call({ props: props }, { formElementFields: [], formdata: {} }).formdata, props.flattenFormData && props.formdata ? (0, _flat2.default)((0, _assign2.default)({}, props.formdata), props.flattenDataOptions) : props.formdata);
    // console.debug('initial', { formdata });
    if (props.stringyFormData) {
      formdata.genericdocjson = (0, _stringify2.default)(props.formdata, null, 2);
    }
    var customPropsFormdata = (0, _assign2.default)({}, formdata, props.useDynamicData && props.getState() ? props.getState().dynamic.formdata : {}, props.formdata);
    customPropsFormdata.__formOptions = props.useFormOptions ? (0, _assign2.default)({}, props.useDynamicData && props.getState() ? props.getState().dynamic.__formOptions : {}, props.__formOptions) : undefined;
    // console.debug({ formdata });

    _this.state = (0, _assign2.default)({
      __formIsSubmitting: false,
      formDataError: null,
      formDataErrors: {},
      __formDataStatusDate: new Date().toString(),
      formDataLists: {},
      formDataTables: {},
      formDataFiles: {}
    },
    // customProps.formdata,
    customPropsFormdata);

    _this.datalists = {};

    _this.getRenderedComponent = _AppLayoutMap.getRenderedComponent.bind(_this);
    _this.getFormSubmit = _FormElements.getFormSubmit.bind(_this);
    _this.getFormDatalist = _FormElements.getFormDatalist.bind(_this);
    _this.getFormCode = _FormElements.getFormCode.bind(_this);
    _this.getFormDatePicker = _FormElements.getFormDatePicker.bind(_this);
    _this.getFormTextInputArea = _FormElements.getFormTextInputArea.bind(_this);
    _this.getFormMaskedInput = _FormElements.getFormMaskedInput.bind(_this);
    _this.getFormAddressAPIInput = _FormElements.getFormAddressAPIInput.bind(_this);
    _this.getFormCombobox = _FormElements.getFormCombobox.bind(_this);
    _this.getFormDropdown = _FormElements.getFormDropdown.bind(_this);
    _this.getFormColorPicker = _FormElements.getFormColorPicker.bind(_this);
    _this.getFormTextArea = _FormElements.getFormTextArea.bind(_this);
    _this.getFormCheckbox = _FormElements.getFormCheckbox.bind(_this);
    _this.getFormButton = _FormElements.getFormButton.bind(_this);
    _this.getFormRemoteDropdown = _FormElements.getFormRemoteDropdown.bind(_this);
    _this.getFormSemanticCheckbox = _FormElements.getFormSemanticCheckbox.bind(_this);
    _this.getFormProgressSteps = _FormElements.getFormProgressSteps.bind(_this);
    _this.getCardFooterItem = _FormElements.getCardFooterItem.bind(_this);
    _this.getFormSelect = _FormElements.getFormSelect.bind(_this);
    _this.getRawInput = _FormElements.getRawInput.bind(_this);
    _this.getFormImageCropper = _FormElements.getFormImageCropper.bind(_this);
    _this.getSliderInput = _FormElements.getSliderInput.bind(_this);
    _this.getFormSwitch = _FormElements.getFormSwitch.bind(_this);
    _this.getFormDatatable = _FormElements.getFormDatatable.bind(_this);
    _this.getHiddenInput = _FormElements.getHiddenInput.bind(_this);
    _this.getFormEditor = _FormElements.getFormEditor.bind(_this);
    _this.getFormLink = _FormElements.getFormLink.bind(_this);
    _this.getFormGroup = _FormElements.getFormGroup.bind(_this);
    _this.getFormTabs = _FormElements.getFormTabs.bind(_this);
    _this.getImage = _FormElements.getImage.bind(_this);
    _this.getFormDNDTable = _FormElements.getFormDNDTable.bind(_this);
    _this.validateFormElement = _FormHelpers.validateFormElement.bind(_this);
    _this.valueCheckFormElement = _FormHelpers.valueCheckFormElement.bind(_this);

    _this.staticLayouts = _this.props.staticLayouts ? (0, _keys2.default)(_this.props.staticLayouts).reduce(function (result, layout) {
      result[layout] = _this.getRenderedComponent(_this.props.staticLayouts[layout], _this.state);
      return result;
    }, {}) : {};
    return _this;
  }

  (0, _createClass3.default)(ResponsiveForm, [{
    key: 'shouldComponentUpdate',
    value: function shouldComponentUpdate(nextProps, nextState) {
      if (this.props.onlyUpdateStateOnSubmit) {
        return this.state.__formDataStatusDate !== nextState.__formDataStatusDate;
      } else {
        return true;
      }
    }
  }, {
    key: 'componentWillMount',
    value: function componentWillMount() {
      var _this2 = this;

      if (this.props.hasContainer) {
        var prevState = (0, _assign2.default)({}, this.state);

        var _props$updateFormLayo = this.props.updateFormLayout(prevState, {}),
            validations = _props$updateFormLayo.validations;

        var validationsLength = this.props.validations.length;
        var tempArr = [];
        for (var i = 0; i < validationsLength; i++) {
          tempArr.push(this.props.validations.pop());
        }
        validations.forEach(function (validation) {
          _this2.props.validations.push(validation);
        });
      }
    }
  }, {
    key: 'componentWillReceiveProps',
    value: function componentWillReceiveProps(nextProps) {
      // console.warn('componentWillReceiveProps', nextProps);
      var formdata = nextProps.flattenFormData ? (0, _flat2.default)((0, _assign2.default)({}, nextProps.formdata), nextProps.flattenDataOptions) : nextProps.formdata;
      formdata = (0, _assign2.default)({}, nextProps.useDynamicData ? this.props.getState().dynamic.formdata : {}, formdata);
      var __formOptions = nextProps.useFormOptions ? (0, _assign2.default)({}, nextProps.useDynamicData && nextProps.getState() ? nextProps.getState().dynamic.__formOptions : {}, nextProps.__formOptions) : undefined;
      formdata.__formOptions = __formOptions;
      this.setState(formdata);
    }
  }, {
    key: 'getFormSumitUrl',
    value: function getFormSumitUrl(baseurl, params, prop) {
      var returnLink = baseurl;
      if (params && params.length > 0) {
        params.forEach(function (param) {
          returnLink = returnLink.replace(param.key, prop[param.val]);
        });
      }
      return returnLink;
    }
  }, {
    key: 'submitForm',
    value: function submitForm() {
      var _this3 = this;

      if (this.props.blockPageUI) {
        this.props.setUILoadedState(false, this.props.blockPageUILayout);
      }
      var state = this.props.getState();
      var headers = state.settings.userprofile ? state.settings.userprofile.options.headers : {};
      var formdata = (0, _assign2.default)({}, this.state);
      var validationErrors = {};
      var hiddenInputs = {};
      var submitFormData = {};
      var formElementFields = [];
      var getCBFromString = _FormHelpers.getCallbackFromString.bind(this);
      var formNameFields = _FormHelpers.setFormNameFields.bind(this);
      var getAssigedHiddenField = _FormHelpers.assignHiddenFields.bind(this);
      var getFormValidations = _FormHelpers.validateForm.bind(this);
      var getFormBody = _FormHelpers.assignFormBody.bind(this);
      var formSubmitNotification = _FormHelpers.handleFormSubmitNotification.bind(this);
      var formSuccessCallbacks = _FormHelpers.handleSuccessCallbacks.bind(this);
      var __formStateUpdate = function __formStateUpdate() {
        _this3.setState({
          __formIsSubmitting: false,
          __formDataStatusDate: new Date().toString()
        });

        if (_this3.props.blockPageUI) {
          _this3.props.setUILoadedState(true);
        }
      };
      this.setState({
        __formIsSubmitting: true
      });
      delete formdata.formDataLists;
      delete formdata.__formDataStatusDate;
      delete formdata.formDataTables;

      var assigedHiddenFields = getAssigedHiddenField({ formdata: formdata, hiddenInputs: hiddenInputs, submitFormData: submitFormData });
      hiddenInputs = assigedHiddenFields.hiddenInputs;
      formdata = assigedHiddenFields.formdata;
      submitFormData = assigedHiddenFields.submitFormData;
      var updatedFormFieldsAndData = formNameFields({ formElementFields: formElementFields, formdata: formdata });
      formElementFields = updatedFormFieldsAndData.formElementFields;
      formdata = updatedFormFieldsAndData.formdata;

      var validatedFormData = getFormValidations({ formdata: formdata, validationErrors: validationErrors });
      validationErrors = validatedFormData.validationErrors;
      formdata = validatedFormData.formdata;

      var multipleDropdownFormData = {};
      (0, _keys2.default)(formdata).forEach(function (key) {
        var name = key.split('.')[0];
        if (updatedFormFieldsAndData.multipleDropdowns[name] && formdata[key] !== undefined) multipleDropdownFormData[key] = formdata[key];
      });
      multipleDropdownFormData = (0, _flat.unflatten)(multipleDropdownFormData);
      formdata = (0, _assign2.default)({}, multipleDropdownFormData, formdata);

      if (formElementFields && formElementFields.length) {
        formElementFields.forEach(function (formElmField) {
          submitFormData[formElmField] = formdata[formElmField];
        });
      }

      if (this.props.sendSubmitButtonVal) {
        submitFormData['submitButtonVal'] = formdata.submitButtonVal;
      }
      // console.debug({ submitFormData, formdata, validationErrors });
      if (validationErrors && (0, _keys2.default)(validationErrors).length < 1) {
        this.setState({
          formDataErrors: {},
          __formIsSubmitting: false
        });
      }
      if (validationErrors && (0, _keys2.default)(validationErrors).length > 0) {
        this.setState({
          formDataErrors: validationErrors,
          __formIsSubmitting: false
        });
        console.debug('has errors', validationErrors, { submitFormData: submitFormData });
        if (this.props.blockPageUI) {
          this.props.setDebugUILoadedState(true);
        }
      } else if (!this.props.onSubmit) {
        this.props.debug(submitFormData);
        __formStateUpdate();
      } else if (typeof this.props.onSubmit === 'string' && this.props.onSubmit.indexOf('func:this.props') !== -1) {
        _FormHelpers.submitThisDotPropsFunc.call(this, { formdata: formdata, submitFormData: submitFormData });
        __formStateUpdate();
      } else if (typeof this.props.onSubmit === 'string' && this.props.onSubmit.indexOf('func:window') !== -1) {
        _FormHelpers.submitWindowFunc.call(this, { formdata: formdata, submitFormData: submitFormData });
        __formStateUpdate();
      } else if (typeof this.props.onSubmit !== 'function') {
        // console.log({ headers }, 'fetchOptions.options', fetchOptions.options);
        var timeoutWrapper = function timeoutWrapper(ms, promise) {
          return new _promise2.default(function (resolve, reject) {
            setTimeout(function () {
              reject(new Error("timeout"));
            }, ms);
            return promise.then(resolve, reject);
          });
        };

        var fetchOptions = (0, _assign2.default)({}, this.props.onSubmit);
        var formBody = new FormData();
        var fetchPostBody = void 0;
        var updatedFormBody = getFormBody({ formdata: formdata, headers: headers, formBody: formBody, submitFormData: submitFormData, fetchPostBody: fetchPostBody, fetchOptions: fetchOptions });
        var isGetRequest = updatedFormBody.isGetRequest;
        formdata = updatedFormBody.formdata;
        headers = updatedFormBody.headers;
        formBody = updatedFormBody.formBody;
        submitFormData = updatedFormBody.submitFormData;
        fetchPostBody = updatedFormBody.fetchPostBody;
        fetchOptions = updatedFormBody.fetchOptions;
        var timeout = fetchOptions.options && fetchOptions.options.timeout ? fetchOptions.options.timeout : null;
        var fetchFunc = timeout ? timeoutWrapper(timeout, fetch(this.getFormSumitUrl('' + fetchOptions.url + ((isGetRequest || this.props.stringifyBody) && fetchOptions.url.indexOf('?') !== -1 ? '&' : fetchOptions.url.indexOf('?') === -1 ? '?' : '') + (isGetRequest || this.props.stringifyBody ? _querystring2.default.stringify(submitFormData) : ''), fetchOptions.params, formdata), fetchOptions.options)) : fetch(this.getFormSumitUrl('' + fetchOptions.url + ((isGetRequest || this.props.stringifyBody) && fetchOptions.url.indexOf('?') !== -1 ? '&' : fetchOptions.url.indexOf('?') === -1 ? '?' : '') + (isGetRequest || this.props.stringifyBody ? _querystring2.default.stringify(submitFormData) : ''), fetchOptions.params, formdata), fetchOptions.options);

        fetchFunc.then(_util2.default.checkStatus).then(function (res) {
          try {
            if (fetchOptions.success) {
              formSubmitNotification({ fetchOptions: fetchOptions, __formStateUpdate: __formStateUpdate });
            }
            if (fetchOptions.successCallback || fetchOptions.responseCallback) {
              var successCallback = fetchOptions.successCallback ? getCBFromString(fetchOptions.successCallback) : false;
              var responseCallback = fetchOptions.responseCallback ? getCBFromString(fetchOptions.responseCallback) : false;
              if (Array.isArray(fetchOptions.successCallback) && Array.isArray(fetchOptions.successProps)) {
                successCallback = fetchOptions.successCallback ? getCBFromString(fetchOptions.successCallback, true) : false;
              }
              res.json().then(function (successData) {
                if (successData && (typeof successData.successCallback === 'string' || Array.isArray(successData.successCallback) && successData.successCallback.length)) {
                  successCallback = getCBFromString(successData.successCallback);
                }
                if (successData && (typeof successData.responseCallback === 'string' || Array.isArray(successData.responseCallback) && successData.responseCallback.length)) {
                  responseCallback = getCBFromString(successData.responseCallback);
                }
                formSuccessCallbacks({ fetchOptions: fetchOptions, submitFormData: submitFormData, successData: successData, successCallback: successCallback, responseCallback: responseCallback });
                __formStateUpdate();
              }).catch(function (e) {
                __formStateUpdate();
                // console.log('RES JSON FORM ERROR',e)
                throw e;
              });
            } else {
              return res.json();
            }
          } catch (e) {
            __formStateUpdate();
            // console.log('WRRor in promiSE',e)
            throw e;
          }
        }).catch(function (e) {
          __formStateUpdate();
          if ((typeof e === 'undefined' ? 'undefined' : (0, _typeof3.default)(e)) === 'object' && (typeof e.callback === 'string' || Array.isArray(e.callback) && e.callback.length) && e.callbackProps) {
            var errorCB = getCBFromString(e.callback);
            errorCB(e.callbackProps);
          } else {
            var _errorCB = getCBFromString(_this3.props.errorCallback);
            if (_this3.props.useErrorNotification) {
              console.error(e);
              _this3.props.errorNotification(e);
            }
            if (_errorCB) {
              var errorProps = _this3.props.useErrorMessageProp ? e.message : e;
              _errorCB(errorProps);
            } else if (_this3.props.onError && typeof _this3.props.onError === 'function') {
              _this3.props.onError(e);
            }
          }
        });
      } else {
        this.props.onSubmit(submitFormData);
      }
    }
  }, {
    key: 'componentWillUpdate',
    value: function componentWillUpdate(nextProps, nextState) {
      var _this4 = this;

      if (this.props.filterFunction) {
        var filterFunction = getFunctionFromProps.call(this, { propFunc: this.props.filterFunction });
        nextState = filterFunction.call(this, nextState);
      }
      if (this.props.onChange) {

        var formdata = (0, _assign2.default)({}, nextState);
        var submitFormData = formdata;
        delete formdata.formDataFiles;
        delete formdata.formDataErrors;
        delete formdata.formDataError;
        delete formdata.formDataStatusDate;
        delete formdata.formDataLists;
        delete formdata.formDataTables;
        delete formdata.__formDataStatusDate;
        delete formdata.__formOptions;
        // console.warn('TODO:this should eventually use the same logic as submitform');
        if (typeof this.props.onChange === 'string' && this.props.onChange.indexOf('func:this.props') !== -1) {
          if (this.props.onChange === 'func:this.props.setDynamicData') {
            this.props.setDynamicData(this.props.dynamicField, submitFormData);
          } else {
            this.props[this.props.onChange.replace('func:this.props.', '')](submitFormData);
          }
        } else if (typeof this.props.onChange === 'string' && this.props.onChange.indexOf('func:window') !== -1 && typeof window[this.props.onChange.replace('func:window.', '')] === 'function') {
          window[this.props.onChange.replace('func:window.', '')].call(this, submitFormData);
        } else if (typeof this.props.onChange === 'function') {
          this.props.onChange(nextState);
        }
      }
      if (this.props.hasContainer) {
        var prevState = (0, _assign2.default)({}, this.state);

        var _props$updateFormLayo2 = this.props.updateFormLayout(prevState, nextState),
            validations = _props$updateFormLayo2.validations;

        var validationsLength = this.props.validations.length;
        var tempArr = [];
        for (var i = 0; i < validationsLength; i++) {
          tempArr.push(this.props.validations.pop());
        }
        validations.forEach(function (validation) {
          _this4.props.validations.push(validation);
        });
      }
    }
  }, {
    key: 'render',
    value: function render() {
      var _this5 = this;

      var keyValue = 0;
      var formGroupData = this.props.formgroups.map(function (formgroup, i) {
        var gridProps = (0, _assign2.default)({
          isMultiline: true,
          key: i
        }, formgroup.gridProps);
        var getFormElements = function getFormElements(formElement, j) {
          // console.debug({ formElement });
          if (!formElement) {
            return null;
          } else if (formElement.type === 'text' || formElement.type === 'file') {
            return _this5.getFormTextInputArea({ formElement: formElement, i: j, formgroup: formgroup });
          } else if (formElement.type === 'button') {
            return _this5.getFormButton({ formElement: formElement, i: j, formgroup: formgroup });
          } else if (formElement.type === 'input') {
            return _this5.getRawInput({ formElement: formElement, i: j, formgroup: formgroup });
          } else if (formElement.type === 'maskedinput') {
            return _this5.getFormMaskedInput({ formElement: formElement, i: j, formgroup: formgroup });
          } else if (formElement.type === 'cropper') {
            return _this5.getFormImageCropper({ formElement: formElement, i: j, formgroup: formgroup });
          } else if (formElement.type === 'textarea') {
            return _this5.getFormTextArea({ formElement: formElement, i: j, formgroup: formgroup });
          } else if (formElement.type === 'hidden') {
            return _this5.getHiddenInput({ formElement: formElement, i: j, formgroup: formgroup });
          } else if (formElement.type === 'datalist') {
            return _this5.getFormDatalist({ formElement: formElement, i: j, formgroup: formgroup });
          } else if (formElement.type === 'combobox') {
            return _this5.getFormCombobox({ formElement: formElement, i: j, formgroup: formgroup });
          } else if (formElement.type === 'dropdown') {
            return _this5.getFormDropdown({ formElement: formElement, i: j, formgroup: formgroup });
          } else if (formElement.type === 'address_api_input') {
            return _this5.getFormAddressAPIInput({ formElement: formElement, i: j, formgroup: formgroup });
          } else if (formElement.type === 'colorpicker') {
            return _this5.getFormColorPicker({ formElement: formElement, i: j, formgroup: formgroup });
          } else if (formElement.type === 'remote_dropdown') {
            return _this5.getFormRemoteDropdown({ formElement: formElement, i: j, formgroup: formgroup });
          } else if (formElement.type === 'datatable') {
            return _this5.getFormDatatable({ formElement: formElement, i: j, formgroup: formgroup });
          } else if (formElement.type === 'dndtable') {
            return _this5.getFormDNDTable({ formElement: formElement, i: j, formgroup: formgroup });
          } else if (formElement.type === 'checkbox' || formElement.type === 'radio') {
            return _this5.getFormCheckbox({ formElement: formElement, i: j, formgroup: formgroup });
          } else if (formElement.type === 'Semantic.checkbox') {
            return _this5.getFormSemanticCheckbox({ formElement: formElement, i: j, formgroup: formgroup });
          } else if (formElement.type === 'progress') {
            return _this5.getFormProgressSteps({ formElement: formElement, i: j, formgroup: formgroup });
          } else if (formElement.type === 'label') {
            return _react2.default.createElement(
              _reBulma.Column,
              (0, _extends3.default)({ key: j }, formElement.layoutProps),
              _react2.default.createElement(
                _reBulma.Label,
                (0, _extends3.default)({ key: j }, formElement.labelProps),
                formElement.label
              )
            );
          } else if (formElement.type === 'line') {
            return _react2.default.createElement(
              _reBulma.Column,
              (0, _extends3.default)({ key: j }, formElement.layoutProps),
              _react2.default.createElement('hr', formElement.passProps)
            );
          } else if (formElement.type === 'code') {
            return _this5.getFormCode({ formElement: formElement, i: j, formgroup: formgroup });
          } else if (formElement.type === 'singleDatePicker' || formElement.type === 'rangeDatePicker') {
            return _this5.getFormDatePicker({ formElement: formElement, i: j, formgroup: formgroup });
          } else if (formElement.type === 'editor') {
            return _this5.getFormEditor({ formElement: formElement, i: j, formgroup: formgroup });
          } else if (formElement.type === 'link') {
            return _this5.getFormLink({
              formElement: formElement, i: j, button: _this5.getRenderedComponent(formElement.value, undefined, true)
            });
          } else if (formElement.type === 'select') {
            return _this5.getFormSelect({ formElement: formElement, i: j, formgroup: formgroup });
          } else if (formElement.type === 'switch') {
            return _this5.getFormSwitch({ formElement: formElement, i: j, formgroup: formgroup });
          } else if (formElement.type === 'image') {
            return _this5.getImage({ formElement: formElement, i: j, formgroup: formgroup });
          } else if (formElement.type === 'slider') {
            return _this5.getSliderInput({ formElement: formElement, i: j, formgroup: formgroup });
          } else if (formElement.type === 'staticLayout') {
            return _this5.staticLayouts[formElement.value];
          } else if (formElement.type === 'layout') {
            var layoutComponent = formElement.value;
            if (_this5.props.includeFormDataOnLayout) {
              layoutComponent.props = (0, _assign2.default)({}, layoutComponent.props, { formdata: _this5.state });
            }
            return _react2.default.createElement(
              _reBulma.Column,
              (0, _extends3.default)({ key: j }, formElement.layoutProps),
              _this5.getRenderedComponent(formElement.value, _this5.state)
            );
          } else if (formElement.type === 'submit') {
            return _this5.getFormSubmit({ formElement: formElement, i: j, formgroup: formgroup });
          } else if (formElement.type === 'group') {
            return _this5.getFormGroup({ formElement: formElement, i: j, groupElements: formElement.groupElements.map(getFormElements) });
          } else if (formElement.type === 'tabs') {
            formElement.getFormElements = getFormElements.bind(_this5);
            var tabs = formElement.tabs && formElement.tabs.length ? formElement.tabs : [];
            return _this5.getFormTabs({ formElement: formElement, i: j, tabs: tabs });
          } else {
            formElement.passProps = (0, _assign2.default)({}, formElement.passProps, { type: formElement.type });
            return _this5.getFormTextInputArea({ formElement: formElement, i: j, formgroup: formgroup });

            // return <Column key={j} {...formElement.layoutProps}>{`${formElement.label || formElement.name }(${formElement.type || 'unknown'}):${ this.state[formElement.name] || formElement.value }`}</Column>;
          }
        };
        /** If the formgroup is a card and has two columns, it will create a single card with two inputs split into two columns based on which ones are set in each column */
        if (formgroup.card && formgroup.card.twoColumns) {
          keyValue++;
          keyValue += i;
          return _react2.default.createElement(
            _ResponsiveCard2.default,
            (0, _extends3.default)({}, formgroup.card.props, { key: keyValue++ }),
            _react2.default.createElement(
              _reBulma.Columns,
              gridProps,
              _react2.default.createElement(
                _reBulma.Column,
                { size: 'isHalf' },
                formgroup.formElements[0] && formgroup.formElements[0].formGroupElementsLeft && formgroup.formElements[0].formGroupElementsLeft.length ? formgroup.formElements[0].formGroupElementsLeft.map(getFormElements) : null
              ),
              _react2.default.createElement(
                _reBulma.Column,
                { size: 'isHalf' },
                formgroup.formElements[0] && formgroup.formElements[0] && formgroup.formElements[0].formGroupElementsRight ? formgroup.formElements[0].formGroupElementsRight.map(getFormElements) : null
              )
            )
          );
        }

        /** If a formgroup is a card and doubleCard is true, it will create two columns, each with a card. The cards will be independant of each other but will share the same horizontal space */
        if (formgroup.card && formgroup.card.doubleCard) {
          keyValue++;
          keyValue += i;
          var leftDoubleCardColumnProps = (0, _assign2.default)({
            size: 'isHalf',
            display: 'flex'
          }, formgroup.card.leftDoubleCardColumn);
          var rightDoubleCardColumnProps = (0, _assign2.default)({
            size: 'isHalf',
            display: 'flex'
          }, formgroup.card.rightDoubleCardColumn);
          return _react2.default.createElement(
            _reBulma.Columns,
            gridProps,
            _react2.default.createElement(
              _reBulma.Column,
              leftDoubleCardColumnProps,
              _react2.default.createElement(
                _ResponsiveCard2.default,
                (0, _extends3.default)({}, formgroup.card.leftCardProps, { key: keyValue++ }),
                formgroup.formElements[0] && formgroup.formElements[0].formGroupCardLeft && formgroup.formElements[0].formGroupCardLeft.length ? formgroup.formElements[0].formGroupCardLeft.map(getFormElements) : null
              )
            ),
            _react2.default.createElement(
              _reBulma.Column,
              rightDoubleCardColumnProps,
              _react2.default.createElement(
                _ResponsiveCard2.default,
                (0, _extends3.default)({}, formgroup.card.rightCardProps, { key: keyValue++ }),
                formgroup.formElements[0] && formgroup.formElements[0].formGroupCardRight && formgroup.formElements[0].formGroupCardRight.length ? formgroup.formElements[0].formGroupCardRight.map(getFormElements) : null
              )
            )
          );
        }

        if (formgroup.card && formgroup.card.singleCard) {
          keyValue++;
          keyValue += i;
          var columnProps = gridProps.subColumnProps || {
            isMultiline: true
          }; //previously was size=isHalf
          return _react2.default.createElement(
            _ResponsiveCard2.default,
            (0, _extends3.default)({}, formgroup.card.props, { key: keyValue++ }),
            _react2.default.createElement(
              _reBulma.Columns,
              columnProps,
              formgroup.formElements && formgroup.formElements.length ? formgroup.formElements.map(getFormElements) : null
            )
          );
        }
        /** If a formgroup is a card, and is not a doubleCard or twoColumns, it will be a single card in a horizontal space in a half size column  */
        if (formgroup.card && !formgroup.card.twoColumns && !formgroup.card.doubleCard) {
          keyValue++;
          keyValue += i;
          var _columnProps = gridProps.subColumnProps || {}; //previously was size=isHalf
          return _react2.default.createElement(
            _reBulma.Columns,
            gridProps,
            _react2.default.createElement(
              _reBulma.Column,
              _columnProps,
              _react2.default.createElement(
                _ResponsiveCard2.default,
                (0, _extends3.default)({}, formgroup.card.props, { key: keyValue++ }),
                formgroup.formElements && formgroup.formElements.length ? formgroup.formElements.map(getFormElements) : null
              )
            )
          );
        }
        if (formgroup.gridElements) {
          return _react2.default.createElement(
            _reBulma.Columns,
            gridProps,
            formgroup.gridElements && formgroup.gridElements.length ? formgroup.gridElements.map(function (grid) {
              var gridColumnProps = (0, _assign2.default)({}, grid.gridColumnProps, {
                style: (0, _assign2.default)({
                  padding: 0
                }, grid.columnProps && grid.columnProps.style ? grid.columnProps.style : {})
              });
              return _react2.default.createElement(
                _reBulma.Column,
                gridColumnProps,
                grid.formElements && grid.formElements.length ? grid.formElements.map(getFormElements) : null
              );
            }) : null
          );
        }
        return _react2.default.createElement(
          _reBulma.Columns,
          gridProps,
          formgroup.formElements && formgroup.formElements.length ? formgroup.formElements.map(getFormElements) : null
        );
      });
      var footerGroupData = this.props.footergroups ? this.props.footergroups.map(function (formgroup, i) {
        var gridProps = (0, _assign2.default)({
          isMultiline: true,
          key: i
        }, formgroup.gridProps);
        var getFormElements = function getFormElements(formElement, j) {
          if (formElement.type === 'submit') {
            return _this5.getCardFooterItem({ formElement: formElement, i: j, formgroup: formgroup });
          } else {
            return _react2.default.createElement(
              _reBulma.CardFooterItem,
              null,
              _react2.default.createElement('div', { key: j })
            );
          }
        };
        return _react2.default.createElement(
          _reBulma.CardFooter,
          gridProps,
          formgroup.formElements.map(getFormElements)
        );
      }) : [];

      if (this.props.cardForm) {
        var cardFormProps = this.props.cardFormProps || {};
        return _react2.default.createElement(
          _reBulma.Card,
          (0, _extends3.default)({}, (0, _assign2.default)({}, { isFullwidth: true }, cardFormProps.cardProps), {
            style: this.props.cardStyle,
            className: '__ra_rf' + (cardFormProps.cardProps && cardFormProps.cardProps.className) ? cardFormProps.cardProps.className : '' }),
          this.props.cardFormTitle ? _react2.default.createElement(
            _reBulma.CardHeader,
            { style: cardFormProps.headerStyle },
            _react2.default.createElement(
              _reBulma.CardHeaderTitle,
              { style: cardFormProps.headerTitleStyle },
              this.props.cardFormTitle
            )
          ) : null,
          _react2.default.createElement(
            _reBulma.CardContent,
            cardFormProps.cardContentProps,
            formGroupData,
            this.props.children
          ),
          footerGroupData
        );
      } else if (this.props.notificationForm) {
        return _react2.default.createElement(
          'div',
          { className: '__ra_rf', style: this.props.style },
          _react2.default.createElement(
            _reBulma.Notification,
            this.props.notificationForm,
            formGroupData,
            this.props.children
          )
        );
      } else {
        return _react2.default.createElement(
          'div',
          (0, _extends3.default)({ className: '__ra_rf', style: this.props.style }, this.props.passProps),
          formGroupData,
          this.props.children
        );
      }
    }
  }, {
    key: 'componentDidUpdate',
    value: function componentDidUpdate(prevProps, prevState) {
      // console.log('componentDidUpdate this.props.error', this.props.error);
      if (this.props.formerror) {
        this.props.onError(this.props.formerror);
      }
      if (this.props.filterFunction) {
        var filterFunction = getFunctionFromProps.call(this, { propFunc: this.props.filterFunction });
        prevState = filterFunction.call(this, prevState);
      }
      if (this.props.afterChange) {

        var formdata = (0, _assign2.default)({}, prevState);
        var submitFormData = formdata;
        delete formdata.formDataFiles;
        delete formdata.formDataErrors;
        delete formdata.formDataError;
        delete formdata.formDataStatusDate;
        delete formdata.formDataLists;
        delete formdata.formDataTables;
        delete formdata.__formDataStatusDate;
        delete formdata.__formOptions;
        // console.warn('TODO:this should eventually use the same logic as submitform');
        if (typeof this.props.afterChange === 'string' && this.props.afterChange.indexOf('func:this.props') !== -1) {
          if (this.props.afterChange === 'func:this.props.setDynamicData') {
            this.props.setDynamicData(this.props.dynamicField, submitFormData);
          } else {
            this.props[this.props.afterChange.replace('func:this.props.', '')](submitFormData);
          }
        } else if (typeof this.props.afterChange === 'string' && this.props.afterChange.indexOf('func:window') !== -1 && typeof window[this.props.afterChange.replace('func:window.', '')] === 'function') {
          window[this.props.afterChange.replace('func:window.', '')].call(this, submitFormData);
        } else if (typeof this.props.afterChange === 'function') {
          this.props.onChange(prevState);
        }
      }
    }
  }]);
  return ResponsiveForm;
}(_react.Component);

ResponsiveForm.propType = propTypes;
ResponsiveForm.defaultProps = defaultProps;

exports.default = ResponsiveForm;