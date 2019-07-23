import React, { Component, PropTypes, } from 'react';
import { Columns, Card, CardHeader, CardHeaderTitle, CardContent, CardFooter, CardFooterItem, Notification, Column, Label, } from 're-bulma';
import ResponsiveCard from '../ResponsiveCard';
import { getRenderedComponent, } from '../AppLayoutMap';
import utilities from '../../util';
import {
  getFormTextInputArea,
  getFormMaskedInput,
  getFormAddressAPIInput,
  getFormDNDTable,
  getFormDropdown,
  getFormRemoteDropdown,
  getFormCheckbox,
  getFormColorPicker,
  getFormSemanticCheckbox,
  getFormProgressSteps, 
  getFormSubmit,
  getFormSelect,
  getCardFooterItem,
  getFormCode,
  getFormDatePicker,
  getFormTextArea,
  getFormEditor,
  getFormLink,
  getHiddenInput,
  getFormGroup,
  getFormTabs,
  getImage,
  getFormDatalist,
  getRawInput,
  getSliderInput,
  getFormDatatable,
  getFormSwitch,
  getFormButton,
  getFormImageCropper
} from './FormElements';
import { getCallbackFromString, setFormNameFields, assignHiddenFields, validateForm, assignFormBody, handleFormSubmitNotification, handleSuccessCallbacks, submitThisDotPropsFunc, submitWindowFunc, validateFormElement, valueCheckFormElement } from './FormHelpers';
import flatten, { unflatten, } from 'flat';
import qs from 'querystring';
// function getCallbackFromString(fetchOptions.successCallback) {

const propTypes = {
  hasContainer: PropTypes.bool,
  updateFormLayout: PropTypes.func,
  notificationForm: PropTypes.any,
  flattenFormData: PropTypes.bool,
  stringyFormData: PropTypes.bool,
  useFormOptions: PropTypes.bool,
  uniqueFormOptions: PropTypes.bool,
  setInitialValues: PropTypes.bool,
  flattenDataOptions: PropTypes.object,
  useErrorNotification: PropTypes.bool,
  useDynamicData: PropTypes.bool,
  cardForm: PropTypes.bool,
  cardFormProps: PropTypes.object,
  passProps: PropTypes.object,
  formdata: PropTypes.object,
  __formOptions: PropTypes.object,
  onSubmit: PropTypes.any,
  validations: PropTypes.array,
  hiddenFields: PropTypes.array,
  footergroups: PropTypes.array,
  onlyUpdateStateOnSubmit: PropTypes.bool,
  formgroups: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.object,
  ]),
};

const defaultProps = {
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
  updateFormLayout: function () { },
  hasContainer: false,
  validations: [],
};

function getFunctionFromProps(options) {
  const { propFunc } = options;

  if (typeof propFunc === 'string' && propFunc.indexOf('func:this.props.reduxRouter') !== -1) {
    return this.props.reduxRouter[ this.props.replace('func:this.props.reduxRouter.', '') ];
  } else if (typeof propFunc === 'string' && propFunc.indexOf('func:this.props') !== -1) {
    return this.props[ this.props.replace('func:this.props.', '') ];
  } else if (typeof propFunc === 'string' && propFunc.indexOf('func:window') !== -1 && typeof window[ propFunc.replace('func:window.', '') ] === 'function') {
    return window[ propFunc.replace('func:window.', '') ];
  } else if (typeof this.props[ propFunc ] === 'function') {
    return propFunc;
  }
}

class ResponsiveForm extends Component {
  constructor(props) {
    super(props);
    // console.debug('initialformdata', setFormNameFields.call(this,{ formElementFields: [], formdata: {}, }));
    // console.debug({ props });
    let formdata = Object.assign({},
      setFormNameFields.call({ props, }, { formElementFields: [], formdata: {}, }).formdata,
      (props.flattenFormData && props.formdata)
        ? flatten(Object.assign({}, props.formdata), props.flattenDataOptions)
        : props.formdata);
    // console.debug('initial', { formdata });
    if (props.stringyFormData) {
      formdata.genericdocjson = JSON.stringify(props.formdata, null, 2);
    }
    let customPropsFormdata = Object.assign({}, formdata, (props.useDynamicData && props.getState())
      ? props.getState().dynamic.formdata
      : {}, props.formdata);
    customPropsFormdata.__formOptions = (props.useFormOptions)
      ? Object.assign({},
        (props.useDynamicData && props.getState()) ? props.getState().dynamic.__formOptions : {}, props.__formOptions)
      : undefined;
    // console.debug({ formdata });

    this.state = Object.assign(
      {
        __formIsSubmitting: false,
        formDataError: null,
        formDataErrors: {},
        __formDataStatusDate: new Date().toString(),
        formDataLists: {},
        formDataTables: {},
        formDataFiles: {},
      },
      // customProps.formdata,
      customPropsFormdata);

    this.datalists = {};

    this.getRenderedComponent = getRenderedComponent.bind(this);
    this.getFormSubmit = getFormSubmit.bind(this);
    this.getFormDatalist = getFormDatalist.bind(this);
    this.getFormCode = getFormCode.bind(this);
    this.getFormDatePicker = getFormDatePicker.bind(this);
    this.getFormTextInputArea = getFormTextInputArea.bind(this);
    this.getFormMaskedInput = getFormMaskedInput.bind(this);
    this.getFormAddressAPIInput = getFormAddressAPIInput.bind(this);
    this.getFormDropdown = getFormDropdown.bind(this);
    this.getFormColorPicker = getFormColorPicker.bind(this);
    this.getFormTextArea = getFormTextArea.bind(this);
    this.getFormCheckbox = getFormCheckbox.bind(this);
    this.getFormButton = getFormButton.bind(this);
    this.getFormRemoteDropdown = getFormRemoteDropdown.bind(this);
    this.getFormSemanticCheckbox = getFormSemanticCheckbox.bind(this);
    this.getFormProgressSteps = getFormProgressSteps.bind(this);
    this.getCardFooterItem = getCardFooterItem.bind(this);
    this.getFormSelect = getFormSelect.bind(this);
    this.getRawInput = getRawInput.bind(this);
    this.getFormImageCropper = getFormImageCropper.bind(this);
    this.getSliderInput = getSliderInput.bind(this);
    this.getFormSwitch = getFormSwitch.bind(this);
    this.getFormDatatable = getFormDatatable.bind(this);
    this.getHiddenInput = getHiddenInput.bind(this);
    this.getFormEditor = getFormEditor.bind(this);
    this.getFormLink = getFormLink.bind(this);
    this.getFormGroup = getFormGroup.bind(this);
    this.getFormTabs = getFormTabs.bind(this);
    this.getImage = getImage.bind(this);
    this.getFormDNDTable = getFormDNDTable.bind(this);
    this.validateFormElement = validateFormElement.bind(this);
    this.valueCheckFormElement = valueCheckFormElement.bind(this);

    this.staticLayouts = (this.props.staticLayouts)
      ? Object.keys(this.props.staticLayouts).reduce((result, layout) => {
        result[ layout ] = this.getRenderedComponent(this.props.staticLayouts[ layout ], this.state);
        return result;
      }, {})
      : {};
  }
  shouldComponentUpdate(nextProps, nextState) {
    if (this.props.onlyUpdateStateOnSubmit) {
      return this.state.__formDataStatusDate !== nextState.__formDataStatusDate;
    } else {
      return true;
    }
  }
  componentWillMount() {
    if (this.props.hasContainer) {
      let prevState = Object.assign({}, this.state);
      let { validations } = this.props.updateFormLayout(prevState, {});
      let validationsLength = this.props.validations.length;
      let tempArr = [];
      for (let i = 0; i < validationsLength; i++) {
        tempArr.push(this.props.validations.pop());
      }
      validations.forEach(validation => {
        this.props.validations.push(validation);
      })
    }
  }

  componentWillReceiveProps(nextProps) {
    // console.warn('componentWillReceiveProps', nextProps);
    let formdata = (nextProps.flattenFormData)
      ? flatten(Object.assign({}, nextProps.formdata), nextProps.flattenDataOptions)
      : nextProps.formdata;
    formdata = Object.assign({},
      (nextProps.useDynamicData)
        ? this.props.getState().dynamic.formdata
        : {},
      formdata);
    let __formOptions = (nextProps.useFormOptions)
      ? Object.assign({},
        (nextProps.useDynamicData && nextProps.getState()) ? nextProps.getState().dynamic.__formOptions : {}, nextProps.__formOptions)
      : undefined;
    formdata.__formOptions = __formOptions;
    this.setState(formdata);
  }
  getFormSumitUrl(baseurl, params, prop) {
    let returnLink = baseurl;
    if (params && params.length > 0) {
      params.forEach((param) => {
        returnLink = returnLink.replace(param.key, prop[ param.val ]);
      });
    }
    return returnLink;
  }
  submitForm() {
    if (this.props.blockPageUI) {
      this.props.setUILoadedState(false, this.props.blockPageUILayout);
    }
    let state = this.props.getState();
    let headers = (state.settings.userprofile) ? state.settings.userprofile.options.headers : {};
    let formdata = Object.assign({}, this.state);
    let validationErrors = {};
    let hiddenInputs = {};
    let submitFormData = {};
    let formElementFields = [];
    const getCBFromString = getCallbackFromString.bind(this);
    const formNameFields = setFormNameFields.bind(this);
    const getAssigedHiddenField = assignHiddenFields.bind(this);
    const getFormValidations = validateForm.bind(this);
    const getFormBody = assignFormBody.bind(this);
    const formSubmitNotification = handleFormSubmitNotification.bind(this);
    const formSuccessCallbacks = handleSuccessCallbacks.bind(this);
    const __formStateUpdate = () => {
      this.setState({
        __formIsSubmitting: false,
        __formDataStatusDate: new Date().toString(),
      });

      if (this.props.blockPageUI) {
        this.props.setUILoadedState(true);
      }
    };
    this.setState({
      __formIsSubmitting: true,
    });
    delete formdata.formDataLists;
    delete formdata.__formDataStatusDate;
    delete formdata.formDataTables;

    let assigedHiddenFields = getAssigedHiddenField({ formdata, hiddenInputs, submitFormData, });
    hiddenInputs = assigedHiddenFields.hiddenInputs;
    formdata = assigedHiddenFields.formdata;
    submitFormData = assigedHiddenFields.submitFormData;
    let updatedFormFieldsAndData = formNameFields({ formElementFields, formdata, });
    formElementFields = updatedFormFieldsAndData.formElementFields;
    formdata = updatedFormFieldsAndData.formdata;

    let validatedFormData = getFormValidations({ formdata, validationErrors, });
    validationErrors = validatedFormData.validationErrors;
    formdata = validatedFormData.formdata;

    let multipleDropdownFormData = {};
    Object.keys(formdata).forEach(key => {
      let name = key.split('.')[ 0 ];
      if (updatedFormFieldsAndData.multipleDropdowns[ name ] && formdata[ key ] !== undefined) multipleDropdownFormData[ key ] = formdata[ key ];
    });
    multipleDropdownFormData = unflatten(multipleDropdownFormData);
    formdata = Object.assign({}, multipleDropdownFormData, formdata);

    if (formElementFields && formElementFields.length) {
      formElementFields.forEach(formElmField => {
        submitFormData[ formElmField ] = formdata[ formElmField ];
      });
    }

    if (this.props.sendSubmitButtonVal) {
      submitFormData[ 'submitButtonVal' ] = formdata.submitButtonVal;
    }
    // console.debug({ submitFormData, formdata, validationErrors });
    if (validationErrors && Object.keys(validationErrors).length < 1) {
      this.setState({
        formDataErrors: {},
        __formIsSubmitting: false,
      });
    }
    if (validationErrors && Object.keys(validationErrors).length > 0) {
      this.setState({
        formDataErrors: validationErrors,
        __formIsSubmitting: false,
      });
      console.debug('has errors', validationErrors, { submitFormData, });
      if (this.props.blockPageUI) {
        this.props.setDebugUILoadedState(true);
      }
    } else if (!this.props.onSubmit) {
      this.props.debug(submitFormData);
      __formStateUpdate();
    } else if (typeof this.props.onSubmit === 'string' && this.props.onSubmit.indexOf('func:this.props') !== -1) {
      submitThisDotPropsFunc.call(this, { formdata, submitFormData, });
      __formStateUpdate();
    } else if (typeof this.props.onSubmit === 'string' && this.props.onSubmit.indexOf('func:window') !== -1) {
      submitWindowFunc.call(this, { formdata, submitFormData, });
      __formStateUpdate();
    } else if (typeof this.props.onSubmit !== 'function') {
      let fetchOptions = Object.assign({}, this.props.onSubmit);
      let formBody = new FormData();
      let fetchPostBody;
      let updatedFormBody = getFormBody({ formdata, headers, formBody, submitFormData, fetchPostBody, fetchOptions, });
      let isGetRequest = updatedFormBody.isGetRequest;
      formdata = updatedFormBody.formdata;
      headers = updatedFormBody.headers;
      formBody = updatedFormBody.formBody;
      submitFormData = updatedFormBody.submitFormData;
      fetchPostBody = updatedFormBody.fetchPostBody;
      fetchOptions = updatedFormBody.fetchOptions;
      let timeout = (fetchOptions.options && fetchOptions.options.timeout) ? fetchOptions.options.timeout : null;
      // console.log({ headers }, 'fetchOptions.options', fetchOptions.options);
      function timeoutWrapper(ms, promise) {
        return new Promise(function (resolve, reject) {
          setTimeout(function () {
            reject(new Error("timeout"))
          }, ms)
          return promise.then(resolve, reject)
        })
      }
      let fetchFunc = timeout ? timeoutWrapper(timeout, fetch(
        this.getFormSumitUrl(`${fetchOptions.url}${
          ((isGetRequest || this.props.stringifyBody) && fetchOptions.url.indexOf('?') !== -1)
            ? '&'
            : (fetchOptions.url.indexOf('?') === -1)
              ? '?'
              : ''}${(isGetRequest || this.props.stringifyBody)
                ? qs.stringify(submitFormData)
                : ''}`,
          fetchOptions.params,
          formdata),
        fetchOptions.options
      )) : fetch(
        this.getFormSumitUrl(`${fetchOptions.url}${
          ((isGetRequest || this.props.stringifyBody) && fetchOptions.url.indexOf('?') !== -1)
            ? '&'
            : (fetchOptions.url.indexOf('?') === -1)
              ? '?'
              : ''}${(isGetRequest || this.props.stringifyBody)
                ? qs.stringify(submitFormData)
                : ''}`,
          fetchOptions.params,
          formdata),
        fetchOptions.options
      );

      fetchFunc
        .then(utilities.checkStatus)
        .then(res => {
          try {
            if (fetchOptions.success) {
              formSubmitNotification({ fetchOptions, __formStateUpdate, });
            }
            if (fetchOptions.successCallback || fetchOptions.responseCallback) {
              let successCallback = (fetchOptions.successCallback)
                ? getCBFromString(fetchOptions.successCallback)
                : false;
              let responseCallback = (fetchOptions.responseCallback)
                ? getCBFromString(fetchOptions.responseCallback)
                : false;
              if (Array.isArray(fetchOptions.successCallback) && Array.isArray(fetchOptions.successProps)) {
                successCallback = (fetchOptions.successCallback)
                  ? getCBFromString(fetchOptions.successCallback, true)
                  : false;
              }
              res.json()
                .then(successData => {
                  if (successData && (typeof successData.successCallback === 'string' || (Array.isArray(successData.successCallback) && successData.successCallback.length))) {
                    successCallback = getCBFromString(successData.successCallback);
                  }
                  if (successData && (typeof successData.responseCallback === 'string' || (Array.isArray(successData.responseCallback) && successData.responseCallback.length))) {
                    responseCallback = getCBFromString(successData.responseCallback);
                  }
                  formSuccessCallbacks({ fetchOptions, submitFormData, successData, successCallback, responseCallback, });
                  __formStateUpdate();
                })
                .catch(e => {
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
        })
        .catch(e => {
          __formStateUpdate();
          if (typeof e === 'object' && (typeof e.callback === 'string' || (Array.isArray(e.callback) && e.callback.length)) && e.callbackProps) {
            let errorCB = getCBFromString(e.callback);
            errorCB(e.callbackProps);
          } else {
            let errorCB = getCBFromString(this.props.errorCallback);
            if (this.props.useErrorNotification) {
              console.error(e);
              this.props.errorNotification(e);
            }
            if (errorCB) {
              let errorProps = (this.props.useErrorMessageProp) ? e.message : e;
              errorCB(errorProps);
            } else if (this.props.onError && typeof this.props.onError === 'function') {
              this.props.onError(e);
            }
          }
        });
    } else {
      this.props.onSubmit(submitFormData);
    }
  }
  componentWillUpdate(nextProps, nextState) {
    if (this.props.filterFunction) {
      const filterFunction = getFunctionFromProps.call(this, { propFunc: this.props.filterFunction, });
      nextState = filterFunction.call(this, nextState);
    }
    if (this.props.onChange) {

      let formdata = Object.assign({}, nextState);
      let submitFormData = formdata;
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
          this.props[ this.props.onChange.replace('func:this.props.', '') ](submitFormData);
        }
      } else if (typeof this.props.onChange === 'string' && this.props.onChange.indexOf('func:window') !== -1 && typeof window[ this.props.onChange.replace('func:window.', '') ] === 'function') {
        window[ this.props.onChange.replace('func:window.', '') ].call(this, submitFormData);
      } else if (typeof this.props.onChange === 'function') {
        this.props.onChange(nextState);
      }
    }
    if (this.props.hasContainer) {
      let prevState = Object.assign({}, this.state);
      let { validations } = this.props.updateFormLayout(prevState, nextState);
      let validationsLength = this.props.validations.length;
      let tempArr = [];
      for (let i = 0; i < validationsLength; i++) {
        tempArr.push(this.props.validations.pop());
      }
      validations.forEach(validation => {
        this.props.validations.push(validation);
      })
    }
  }
  render() {
    let keyValue = 0;
    let formGroupData = this.props.formgroups.map((formgroup, i) => {
      let gridProps = Object.assign({
        isMultiline: true,
        key: i,
      }, formgroup.gridProps);
      let getFormElements = (formElement, j) => {
        // console.debug({ formElement });
        if (!formElement) {
          return null;
        } else if (formElement.type === 'text' || formElement.type === 'file') {
          return this.getFormTextInputArea({ formElement, i: j, formgroup, });
        } else if (formElement.type === 'button') {
          return this.getFormButton({ formElement, i: j, formgroup, });
        } else if (formElement.type === 'input') {
          return this.getRawInput({ formElement, i: j, formgroup, });
        } else if (formElement.type === 'maskedinput') {
          return this.getFormMaskedInput({ formElement, i: j, formgroup, });
        } else if (formElement.type === 'cropper') {
          return this.getFormImageCropper({ formElement, i: j, formgroup, });
        } else if (formElement.type === 'textarea') {
          return this.getFormTextArea({ formElement, i: j, formgroup, });
        } else if (formElement.type === 'hidden') {
          return this.getHiddenInput({ formElement, i: j, formgroup, });
        } else if (formElement.type === 'datalist') {
          return this.getFormDatalist({ formElement, i: j, formgroup, });
        } else if (formElement.type === 'dropdown') {
          return this.getFormDropdown({ formElement, i: j, formgroup, });
        } else if (formElement.type === 'address_api_input') {
          return this.getFormAddressAPIInput({ formElement, i: j, formgroup, });
        } else if (formElement.type === 'colorpicker') {
          return this.getFormColorPicker({ formElement, i: j, formgroup, });
        } else if (formElement.type === 'remote_dropdown') {
          return this.getFormRemoteDropdown({ formElement, i: j, formgroup, });
        } else if (formElement.type === 'datatable') {
          return this.getFormDatatable({ formElement, i: j, formgroup, });
        } else if (formElement.type === 'dndtable') {
          return this.getFormDNDTable({ formElement, i: j, formgroup, });
        } else if (formElement.type === 'checkbox' || formElement.type === 'radio') {
          return this.getFormCheckbox({ formElement, i: j, formgroup, });
        } else if (formElement.type === 'Semantic.checkbox') {
          return this.getFormSemanticCheckbox({ formElement, i: j, formgroup, });
        } else if (formElement.type === 'progress') {
          return this.getFormProgressSteps({ formElement, i: j, formgroup, });
        } else if (formElement.type === 'label') {
          return (<Column key={j} {...formElement.layoutProps}>
            <Label key={j} {...formElement.labelProps}>{formElement.label}</Label>
          </Column>);
        } else if (formElement.type === 'line') {
          return (<Column key={j} {...formElement.layoutProps}>
            <hr {...formElement.passProps} />
          </Column>);
        } else if (formElement.type === 'code') {
          return this.getFormCode({ formElement, i: j, formgroup, });
        } else if (formElement.type === 'singleDatePicker' || formElement.type === 'rangeDatePicker') {
          return this.getFormDatePicker({ formElement, i: j, formgroup, });
        } else if (formElement.type === 'editor') {
          return this.getFormEditor({ formElement, i: j, formgroup, });
        } else if (formElement.type === 'link') {
          return this.getFormLink({
            formElement, i: j, button: this.getRenderedComponent(formElement.value, undefined, true),
          });
        } else if (formElement.type === 'select') {
          return this.getFormSelect({ formElement, i: j, formgroup, });
        } else if (formElement.type === 'switch') {
          return this.getFormSwitch({ formElement, i: j, formgroup, });
        } else if (formElement.type === 'image') {
          return this.getImage({ formElement, i: j, formgroup, });
        } else if (formElement.type === 'slider') {
          return this.getSliderInput({ formElement, i: j, formgroup, });
        } else if (formElement.type === 'staticLayout') {
          return this.staticLayouts[ formElement.value ];
        } else if (formElement.type === 'layout') {
          const layoutComponent = formElement.value;
          if (this.props.includeFormDataOnLayout) {
            layoutComponent.props = Object.assign({}, layoutComponent.props, { formdata: this.state });
          }
          return (<Column key={j} {...formElement.layoutProps}>{this.getRenderedComponent(formElement.value, this.state)}</Column>);
        } else if (formElement.type === 'submit') {
          return this.getFormSubmit({ formElement, i: j, formgroup, });
        } else if (formElement.type === 'group') {
          return this.getFormGroup({ formElement, i: j, groupElements: formElement.groupElements.map(getFormElements), });
        } else if (formElement.type === 'tabs') {
          formElement.getFormElements = getFormElements.bind(this);
          let tabs = (formElement.tabs && formElement.tabs.length) ? formElement.tabs : [];
          return this.getFormTabs({ formElement, i: j, tabs, });
        } else {
          formElement.passProps = Object.assign({}, formElement.passProps, { type: formElement.type, });
          return this.getFormTextInputArea({ formElement, i: j, formgroup, });

          // return <Column key={j} {...formElement.layoutProps}>{`${formElement.label || formElement.name }(${formElement.type || 'unknown'}):${ this.state[formElement.name] || formElement.value }`}</Column>;
        }
      };
      /** If the formgroup is a card and has two columns, it will create a single card with two inputs split into two columns based on which ones are set in each column */
      if (formgroup.card && formgroup.card.twoColumns) {
        keyValue++;
        keyValue += i;
        return (
          <ResponsiveCard {...formgroup.card.props} key={keyValue++}>
            <Columns {...gridProps}>
              <Column size="isHalf">
                {(formgroup.formElements[ 0 ] && formgroup.formElements[ 0 ].formGroupElementsLeft && formgroup.formElements[ 0 ].formGroupElementsLeft.length) ? formgroup.formElements[ 0 ].formGroupElementsLeft.map(getFormElements) : null}
              </Column>
              <Column size="isHalf">
                {(formgroup.formElements[ 0 ] && formgroup.formElements[ 0 ] && formgroup.formElements[ 0 ].formGroupElementsRight) ? formgroup.formElements[ 0 ].formGroupElementsRight.map(getFormElements) : null}
              </Column>
            </Columns>
          </ResponsiveCard>);
      }

      /** If a formgroup is a card and doubleCard is true, it will create two columns, each with a card. The cards will be independant of each other but will share the same horizontal space */
      if (formgroup.card && formgroup.card.doubleCard) {
        keyValue++;
        keyValue += i;
        let leftDoubleCardColumnProps = Object.assign({
          size: 'isHalf',
          display: 'flex',
        }, formgroup.card.leftDoubleCardColumn);
        let rightDoubleCardColumnProps = Object.assign({
          size: 'isHalf',
          display: 'flex',
        }, formgroup.card.rightDoubleCardColumn);
        return (
          <Columns {...gridProps}>
            <Column {...leftDoubleCardColumnProps}>
              <ResponsiveCard {...formgroup.card.leftCardProps} key={keyValue++}>
                {(formgroup.formElements[ 0 ] && formgroup.formElements[ 0 ].formGroupCardLeft && formgroup.formElements[ 0 ].formGroupCardLeft.length) ? formgroup.formElements[ 0 ].formGroupCardLeft.map(getFormElements) : null}
              </ResponsiveCard>
            </Column>
            <Column {...rightDoubleCardColumnProps}>
              <ResponsiveCard {...formgroup.card.rightCardProps} key={keyValue++}>
                {(formgroup.formElements[ 0 ] && formgroup.formElements[ 0 ].formGroupCardRight && formgroup.formElements[ 0 ].formGroupCardRight.length) ? formgroup.formElements[ 0 ].formGroupCardRight.map(getFormElements) : null}
              </ResponsiveCard>
            </Column>
          </Columns>);
      }

      if (formgroup.card && formgroup.card.singleCard) {
        keyValue++;
        keyValue += i;
        let columnProps = gridProps.subColumnProps || {
          isMultiline: true,
        };//previously was size=isHalf
        return (<ResponsiveCard {...formgroup.card.props} key={keyValue++}>
          <Columns {...columnProps}>
            {(formgroup.formElements && formgroup.formElements.length) ? formgroup.formElements.map(getFormElements) : null}
          </Columns>
        </ResponsiveCard>);
      }
      /** If a formgroup is a card, and is not a doubleCard or twoColumns, it will be a single card in a horizontal space in a half size column  */
      if (formgroup.card && !formgroup.card.twoColumns && !formgroup.card.doubleCard) {
        keyValue++;
        keyValue += i;
        let columnProps = gridProps.subColumnProps || {};//previously was size=isHalf
        return (<Columns {...gridProps}>
          <Column {...columnProps}>
            <ResponsiveCard {...formgroup.card.props} key={keyValue++}>
              {(formgroup.formElements && formgroup.formElements.length) ? formgroup.formElements.map(getFormElements) : null}
            </ResponsiveCard>
          </Column>
        </Columns>);
      }
      if (formgroup.gridElements) {
        return (<Columns {...gridProps}>
          {(formgroup.gridElements && formgroup.gridElements.length) ? formgroup.gridElements.map(grid => {
            let gridColumnProps = Object.assign({}, grid.gridColumnProps, 
            {
              style: Object.assign({
                padding: 0,
              }, (grid.columnProps && grid.columnProps.style) ? grid.columnProps.style : {})
            })
            return <Column {...gridColumnProps}>{(grid.formElements && grid.formElements.length) ? grid.formElements.map(getFormElements) : null}</Column>
          }) : null}
        </Columns>);
      }
      return (<Columns {...gridProps}>
        {(formgroup.formElements && formgroup.formElements.length) ? formgroup.formElements.map(getFormElements) : null}
      </Columns>);
    });
    let footerGroupData = (this.props.footergroups)
      ? this.props.footergroups.map((formgroup, i) => {
        let gridProps = Object.assign({
          isMultiline: true,
          key: i,
        }, formgroup.gridProps);
        let getFormElements = (formElement, j) => {
          if (formElement.type === 'submit') {
            return this.getCardFooterItem({ formElement, i: j, formgroup, });
          } else {
            return <CardFooterItem>
              <div key={j} />
            </CardFooterItem>;
          }
        };
        return (<CardFooter {...gridProps}>
          {formgroup.formElements.map(getFormElements)}
        </CardFooter>);
      })
      : [];

    if (this.props.cardForm) {
      let cardFormProps = this.props.cardFormProps || {};
      return (<Card
        {...Object.assign({}, { isFullwidth: true, }, cardFormProps.cardProps) }
        style={this.props.cardStyle}
        className={'__ra_rf' + (cardFormProps.cardProps && cardFormProps.cardProps.className) ? (cardFormProps.cardProps.className) : ''} >
        {(this.props.cardFormTitle)
          ? (<CardHeader style={cardFormProps.headerStyle}>
            <CardHeaderTitle style={cardFormProps.headerTitleStyle}>{this.props.cardFormTitle}
            </CardHeaderTitle>
          </CardHeader>)
          : null}
        <CardContent {...cardFormProps.cardContentProps}>
          {formGroupData}
          {this.props.children}
        </CardContent>
        {footerGroupData}
      </Card>);
    } else if (this.props.notificationForm) {
      return (<div className="__ra_rf" style={this.props.style}>
        <Notification {...this.props.notificationForm}>
          {formGroupData}
          {this.props.children}
        </Notification>
      </div>);
    } else {
      return (<div className="__ra_rf" style={this.props.style} {...this.props.passProps}>
        {formGroupData}
        {this.props.children}
      </div>);
    }
  }
  componentDidUpdate(prevProps, prevState) {
    // console.log('componentDidUpdate this.props.error', this.props.error);
    if (this.props.formerror) {
      this.props.onError(this.props.formerror);
    }
    if (this.props.filterFunction) {
      const filterFunction = getFunctionFromProps.call(this, { propFunc: this.props.filterFunction, });
      prevState = filterFunction.call(this, prevState);
    }
    if (this.props.afterChange) {

      let formdata = Object.assign({}, prevState);
      let submitFormData = formdata;
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
          this.props[ this.props.afterChange.replace('func:this.props.', '') ](submitFormData);
        }
      } else if (typeof this.props.afterChange === 'string' && this.props.afterChange.indexOf('func:window') !== -1 && typeof window[ this.props.afterChange.replace('func:window.', '') ] === 'function') {
        window[ this.props.afterChange.replace('func:window.', '') ].call(this, submitFormData);
      } else if (typeof this.props.afterChange === 'function') {
        this.props.onChange(prevState);
      }
    }
  }
}

ResponsiveForm.propType = propTypes;
ResponsiveForm.defaultProps = defaultProps;

export default ResponsiveForm;