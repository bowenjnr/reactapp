import flatten from 'flat';
import validate from 'validate.js';

/**
 *
 *
 * @param {String} function_string sting for function name
 * @returns the window function associated with the function_string if it exists on the window. Otherwise the function returns null
 */
const getWindowFunction = function_string => {
  if (typeof function_string === 'string' && function_string.indexOf('func:window') !== -1 && typeof window[ function_string.replace('func:window.', '') ] === 'function') {
    return window[ function_string.replace('func:window.', '') ];
  }
  return null;
};

/**
 *
 * creates custom validations on the validator object provided by validate.js. 
 * @param {Object} validation validation object defined as part of the validations array in the form manifest
 * @param {Array} validation.custom_validators list of names for custom validations. Each name gets set as the key for the validation on the validate.validators object
 * @param {Array} validation.custom_validators_functions list of function names for custom validations. Function gets defined on the window. Format for function can be found in 
 * Validate.js docs
 */
const createValidators = validation => {
  validation.custom_validators.forEach((custom_validator, index) => {
    if (validation.custom_validator_functions) {
      const window_function = getWindowFunction(validation.custom_validator_functions[ index ])
      if (window_function) {
        validate.validators[ custom_validator ] = window_function;
      }
    }
  });
};

export function validateFormElement(options) {
  try {
    let { formElement, } = options;
    /*allows for custom validations to be defined in manifest. If there are custom validations on the formElement, define them on the validators object
    provided by validate.js*/
    this.props.validations.forEach(validation => {
      if (validation.custom_validators && validation.custom_validators.length) createValidators(validation)
    })
    let validation = this.props.validations.filter(validation => validation.name === formElement.name);
    validation = (validation.length > 0) ? validation[ 0 ] : false;
    if (validation) {
      let validationerror = validate({
        [ validation.name ]: this.state[ validation.name ],
      }, validation.constraints);
      let validationErrors;
      let validationValid;
      if (validationerror) {
        validationErrors = Object.assign({}, this.state.formDataErrors);
        validationErrors[ validation.name ] = validationerror[ validation.name ];
        if (this.state.formDataValid) {
          validationValid = Object.assign({}, this.state.formDataValid);
          delete validationValid[ validation.name ];
        }
      } else {
        validationValid = Object.assign({}, this.state.formDataValid);
        validationValid[ validation.name ] = true;
        if (this.state.formDataErrors) {
          validationErrors = Object.assign({}, this.state.formDataErrors);
          delete validationErrors[ validation.name ];
        }
      }
      this.setState({ formDataErrors: validationErrors, formDataValid: validationValid });
      // console.debug('has errors', validationErrors, 'this.state[formElement.name]', this.state[ formElement.name ]);
    }
  } catch (e) {
    console.debug('validation check error', e);
  }
}

export function valueCheckFormElement(options) {
  try {
    let { formElement, } = options;
    let validationValid = Object.assign({}, this.state.formDataValid);
    if (this.state[ formElement.name ]) {
      validationValid[ formElement.name ] = true;
    } else {
      delete validationValid[ formElement.name ];
    }
    this.setState({ formDataValid: validationValid });
    // console.debug('has errors', validationErrors, 'this.state[formElement.name]', this.state[ formElement.name ]);
  } catch (e) {
    console.debug('value check error', e);
  }
}

export function validateForm(options) {
  let { formdata, validationErrors, } = options;
  // console.debug('testin valdation',this.props.validations,) 
  if (this.props.validations) {
    this.props.validations.forEach(validation => {
      if (validation.custom_validators && validation.custom_validators.length) createValidators(validation)
      let validationerror = validate({
        [ validation.name ]: formdata[ validation.name ],
      }, validation.constraints);
      // console.debug(formdata[ validation.name ], { validation, validationerror, });
      if (validationerror) {
        validationErrors[ validation.name ] = validationerror[ validation.name ];
      } else {
        delete validationErrors[ validation.name ];
      }
    });
  } else {
    delete formdata.formDataErrors;
  }
  return { formdata, validationErrors, };
}

export function assignHiddenFields(options) {
  let { formdata, hiddenInputs, submitFormData, } = options;
  let dynamicFields = {};
  let ApplicationState = this.props.getState();

  if (this.props.hiddenFields) {
    this.props.hiddenFields.forEach(hiddenField => {
      let hiddenFormValue = (typeof this.state[ hiddenField.form_val ] === 'undefined') ?
        hiddenField.form_static_val :
        this.state[ hiddenField.form_val ];
      hiddenInputs[ hiddenField.form_name ] = hiddenFormValue;
      submitFormData[ hiddenField.form_name ] = hiddenFormValue;
    });
  }
  if (this.props.dynamicFields) {
    let mergedDynamicField = (this.props.mergeDynamicFields) ?
      Object.assign({}, ApplicationState.dynamic, flatten(ApplicationState.dynamic)) :
      ApplicationState.dynamic;
    this.props.dynamicFields.forEach(dynamicHiddenField => {
      let hiddenFormValue = (typeof mergedDynamicField[ dynamicHiddenField.form_val ] === 'undefined') ?
        dynamicHiddenField.form_static_val :
        mergedDynamicField[ dynamicHiddenField.form_val ];
      dynamicFields[ dynamicHiddenField.form_name ] = hiddenFormValue;
      submitFormData[ dynamicHiddenField.form_name ] = hiddenFormValue;
    });
  }
  formdata = Object.assign(formdata, hiddenInputs, dynamicFields);
  return { formdata, hiddenInputs, submitFormData, };
}

export function getCallbackFromString(successCBProp, multiArgs = false) {
  let successCallback;
  if (!multiArgs && Array.isArray(successCBProp) && successCBProp.length) {
    let fns = successCBProp.map(getCallbackFromString.bind(this));
    successCallback = function () {
      for (let i = 0; i < fns.length; i++) {
        fns[ i ].call(this, ...arguments);
      }
    }.bind(this);
  } else if (multiArgs & Array.isArray(successCBProp) && successCBProp.length) {
    let fns = successCBProp.map(getCallbackFromString.bind(this));
    successCallback = function () {
      for (let i = 0; i < fns.length; i++) {
        let args = [ arguments[ 0 ][ i ] ].concat([].slice.call(arguments, 1));
        fns[ i ].call(this, ...args);
      }
    }.bind(this);
  } else {
    if (typeof successCBProp === 'string' && successCBProp.indexOf('func:this.props.reduxRouter') !== -1) {
      successCallback = this.props.reduxRouter[ successCBProp.replace('func:this.props.reduxRouter.', '') ];
    } else if (typeof successCBProp === 'string' && successCBProp.indexOf('func:window') !== -1 && typeof window[ successCBProp.replace('func:window.', '') ] === 'function') {
      successCallback = window[ successCBProp.replace('func:window.', '') ].bind(this);
    } else if (typeof successCBProp === 'string') {
      successCallback = this.props[ successCBProp.replace('func:this.props.', '') ];
    }
  }
  return successCallback;
}

export function setAddNameToName(options) {
  let { formdata, formElementFields, formElm, multipleDropdowns, } = options;
  let recursiveSetAddNameToName = setAddNameToName.bind(this);
  // console.debug('addNameToName','(formElm.passProps && formElm.passProps.state===isDisabled)',(formElm.passProps && formElm.passProps.state==='isDisabled'),{ formElm });
  // skip if null, or disabled
  // console.debug({ formElm, });
  if (!formElm ||
    formElm.disabled ||
    (formElm.passProps && formElm.passProps.state === 'isDisabled')
  ) {
    // console.debug('skip', formElm);
    //
  } else if (formElm.type === 'group') {
    if (formElm.groupElements && formElm.groupElements.length) {
      formElm.groupElements.forEach(formElm => recursiveSetAddNameToName({ formdata, formElementFields, formElm, }));
    }
  } else if (formElm.type === 'tabs') {
    if (formElm.name && formElm.passProps && formElm.passProps.markActiveTab) {
      formdata[ formElm.name ] = (this.state) ?
      this.state[ formElm.name ] || formElm.value :
        formElm.value;
        formElementFields.push(formElm.name)
    }
    if (Array.isArray(formElm.tabs) && formElm.tabs.length) {
      formElm.tabs.forEach(tab => {
        if (Array.isArray(tab.formElements)) {
          tab.formElements.forEach(formElm => recursiveSetAddNameToName({ formElementFields, formdata, formElm, multipleDropdowns, }))
        }
      });
    }
  } else if (formElm.name) {
    formElementFields.push(formElm.name);
    if (formElm.type === 'hidden' || (this.props && this.props.setInitialValues)) {
      if (formElm.type === 'radio') {
        if (this.state && formElm.name && this.state[ formElm.name ]) {
          formdata[ formElm.name ] = this.state[ formElm.name ];
        } else if (this.state || formElm.checked || (formElm.passProps && formElm.passProps.checked)) {
          formdata[ formElm.name ] = formElm.value;
        }
      } else {
        formdata[ formElm.name ] = (this.state) ?
          this.state[ formElm.name ] || formElm.value :
          formElm.value;
      }
    }
    if (formElm.type === 'datalist') {
      // console.debug('before',{formElm,formdata});
      if (formElm.datalist.multi && formdata[ formElm.name ] && formdata[ formElm.name ].length) {
        formdata[ formElm.name ] = formdata[ formElm.name ].map(datum => datum[ formElm.datalist.selector || '_id' ]);
      } else if (formdata[ formElm.name ] && Object.keys(formdata[ formElm.name ]).length) {
        formdata[ formElm.name ] = formdata[ formElm.name ][ formElm.datalist.selector || '_id' ];
      }
      // console.debug('after',{formElm,formdata});
    }
    if (formElm.type === 'dropdown' && formElm.passProps && formElm.passProps.multiple) {
      multipleDropdowns[ formElm.name ] = true;
    }
  }
  return { formdata, formElementFields, formElement: formElm, multipleDropdowns, };
}


export function setFormNameFields(options) {
  let { formElementFields, formdata, } = options;
  let multipleDropdowns = {};
  const addNameToName = setAddNameToName.bind(this);
  function _mapFormFieldNames(formgroup, formdata, formElementFields) {
    if (formgroup.formElements && formgroup.formElements.length) {
      formgroup.formElements.forEach(formElement => {
        let formElementsLeft = (formElement.formGroupElementsLeft && formElement.formGroupElementsLeft.length) ? formElement.formGroupElementsLeft : false;
        let formElementsRight = (formElement.formGroupElementsRight && formElement.formGroupElementsRight.length) ? formElement.formGroupElementsRight : false;
        let formGroupLeft = (formElement.formGroupCardLeft && formElement.formGroupCardLeft.length) ? formElement.formGroupCardLeft : false;
        let formGroupRight = (formElement.formGroupCardRight && formElement.formGroupCardRight.length) ? formElement.formGroupCardRight : false;
        if (formElementsLeft || formElementsRight) {
          if (formElementsLeft) formElementsLeft.forEach(formElm => addNameToName({
            formElementFields,
            formdata,
            formElm,
            multipleDropdowns,
          }));
          if (formElementsRight) formElementsRight.forEach(formElm => addNameToName({
            formElementFields,
            formdata,
            formElm,
            multipleDropdowns,
          }));
        } else if (formGroupLeft || formGroupRight) {
          if (formGroupLeft) formGroupLeft.forEach(formElm => addNameToName({
            formElementFields,
            formdata,
            formElm,
            multipleDropdowns,
          }));
          if (formGroupRight) formGroupRight.forEach(formElm => addNameToName({
            formElementFields,
            formdata,
            formElm,
            multipleDropdowns,
          }));
        } else if (formElement.type === 'group') {
          if (formElement.groupElements && formElement.groupElements.length) formElement.groupElements.forEach(formElm => addNameToName({
            formElementFields,
            formdata,
            formElm,
            multipleDropdowns,
          }));
        } else if (formElement.type === 'tabs') {
          if (formElement.name && formElement.passProps && formElement.passProps.markActiveTab) {
            formdata[formElement.name] = (this.state) ?
              this.state[formElement.name] || formElement.value :
              formElement.value;
            formElementFields.push(formElement.name)
          }
          if (formElement.tabs && formElement.tabs.length) {
            formElement.tabs.forEach(tab => {
              if (tab.formElements && tab.formElements.length) {
                tab.formElements.forEach(formElm => addNameToName({
                  formElementFields,
                  formdata,
                  formElm,
                  multipleDropdowns,
                }));
              }
            })
          }
        } else if (!formElement ||
          formElement.disabled ||
          (formElement.passProps && formElement.passProps.state === 'isDisabled')
        ) {
          //skip if dsiabled
          // console.debug('skip', formElement);

        } else {
          if (formElement.name) {
            addNameToName({
              formElementFields,
              formdata,
              formElm: formElement,
              multipleDropdowns,
            });
            // formElementFields.push(formElement.name);
          }
        }
      });
    }
  }
  if (this.props.formgroups && this.props.formgroups.length) {
    this.props.formgroups.forEach(formgroup => {
      if (formgroup.gridElements) {
        formgroup.gridElements.map(grid => _mapFormFieldNames(grid, formdata, formElementFields))
      } else {
        _mapFormFieldNames(formgroup, formdata, formElementFields);
      }
    });
  }
  return { formElementFields, formdata, multipleDropdowns, };
}

export function assignFormBody(options) {
  let { formdata, headers, formBody, submitFormData, fetchPostBody, fetchOptions, } = options;
  //if file
  if (Object.keys(formdata.formDataFiles).length) {
    delete headers[ 'Content-Type' ];
    delete headers[ 'content-type' ];
    Object.keys(formdata.formDataFiles).forEach((formFileName) => {
      let fileList = formdata.formDataFiles[ formFileName ].files;
      for (let x = 0; x < fileList.length; x++) {
        formBody.append(formFileName, fileList.item(x));
      }
    });
    delete formdata.formDataErrors;
    delete formdata.formDataFiles;
    Object.keys(submitFormData).forEach(form_name => {
      formBody.append(form_name, submitFormData[ form_name ]);
    });
    fetchPostBody = formBody;
  } else {
    delete formdata.formDataErrors;
    delete formdata.formDataFiles;
    fetchPostBody = JSON.stringify(submitFormData);
  }
  let isGetRequest = fetchOptions.options && fetchOptions.options.method && fetchOptions.options.method.toUpperCase() === 'GET';
  let bodyForFetch = (isGetRequest)
    ? {}
    : {
      body: fetchPostBody,
    };
  if (fetchOptions.options.headers) {
    headers = Object.assign({}, headers, fetchOptions.options.headers);
  }
  fetchOptions.options = Object.assign(
    {},
    fetchOptions.options,
    {
      headers,
    },
    bodyForFetch);

  return { formdata, headers, formBody, submitFormData, fetchPostBody, fetchOptions, isGetRequest, };
}

export function handleFormSubmitNotification(options) {
  let { fetchOptions, __formStateUpdate, } = options;
  if (fetchOptions.success.modal) {
    this.props.createModal(fetchOptions.success.modal);
  } else if (fetchOptions.success.notification) {
    this.props.createNotification(fetchOptions.success.notification);
  } else {
    this.props.createNotification({ text: 'Saved', timeout: 4000, type: 'success', });
  }
  if (!fetchOptions.successCallback && !fetchOptions.responseCallback) {
    __formStateUpdate();
  }
}

export function handleSuccessCallbacks(options) {
  let { fetchOptions, submitFormData, successData, successCallback, responseCallback, } = options;
  if (fetchOptions.successCallback === 'func:this.props.setDynamicData') {
    this.props.setDynamicData(this.props.dynamicField, submitFormData);
  } else {
    if (fetchOptions.setDynamicData) {
      this.props.setDynamicData(this.props.dynamicField, submitFormData);
    }
    if (successCallback) {
      successCallback(fetchOptions.successProps || successData.callbackProps || Object.assign({}, submitFormData, successData), submitFormData);
    }
  }
  if (responseCallback) {
    if (fetchOptions.responseCallback === 'func:this.props.setDynamicData') {
      this.props.setDynamicData(this.props.dynamicResponseField, successData);
    } else {
      if (fetchOptions.setDynamicResponseData) {
        this.props.setDynamicData(this.props.dynamicResponseField, successData);
      }
      responseCallback(fetchOptions.responseProps || successData.callbackProps || successData, submitFormData);
    }
  }
  if (this.props.updateFormOnResponse) {
    this.setState((this.props.flattenFormData)
      ? Object.assign({}, successData, flatten(successData, this.props.flattenDataOptions))
      : successData);
  }
}

export function submitThisDotPropsFunc(options) {
  let { formdata, submitFormData, } = options;
  delete formdata.formDataFiles;
  delete formdata.formDataErrors;
  if (this.props.onSubmit === 'func:this.props.setDynamicData') {
    // console.debug('this.props', this.props);
    this.props.setDynamicData(this.props.dynamicField, submitFormData);
  } else {
    this.props[ this.props.onSubmit.replace('func:this.props.', '') ](submitFormData);
  }
}

export function submitWindowFunc(options) {
  let { formdata, submitFormData, } = options;
  delete formdata.formDataFiles;
  delete formdata.formDataErrors;
  window[ this.props.onSubmit.replace('func:window.', '') ].call(this, submitFormData);
}
