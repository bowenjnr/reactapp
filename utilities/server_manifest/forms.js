'use strict';
const capitalize = require('capitalize');

function getFormElement(formElement) {
  const formElementTypes = {
    input: formElement,
    submit: Object.assign({}, {
      passProps: {
        color: 'isSuccess',
        buttonStyle: 'isOutlined',
      },
    },
    formElement),
  };
  const element = formElementTypes[ formElement.type ] || formElement;
  
  if (formElement.label === true) {
    element.label = capitalize(element.name);
  }
  if (formElement.submit === true) {
    element.submitOnEnter = true;
  }
  if (formElement.horizontal === true) {
    element.layoutProps = Object.assign({},
      element.layoutProps,
      {
        
        horizontalform: true,
        formItemStyle: {
        },
      });
  }
  if (formElement.columnSize) {
    element.layoutProps = Object.assign({}, element.layoutProps, { size: formElement.columnSize, });
  }
  return element;
}

function getFormgroups(options) {
  const randomKey = Math.random;  
  return options.rows.map(row => (Object.assign({}, row, {
    gridProps: {
      key: randomKey(),
      // style: {
      //   marginTop: 30,
      //   padding: 10,
      // },
      subColumnProps: row.containGrid ? {
        style: {
          // overflow:'hidden',
          overflow:'auto',
        },
      }:undefined, 
    },
    formElements: (row.formElements && row.formElements.length)?row.formElements.map(getFormElement):[],
  })));
}

function getFormOnSubmitCallbacks(type, options) {
  const callbackMethod = {
    redirect: {
      callback: 'func:this.props.reduxRouter.push',
      props: options.redirect,
    },
    refresh: {
      callback: 'func:this.props.refresh',
      // props: options.redirect,
    },
    closeModal: {
      callback: 'func:this.props.hideModal',
      props: 'last',
    },
  };
  const submitAction = callbackMethod[ options.onSubmit ] || {};
  const completeAction = callbackMethod[ options.onComplete ] || {};
  return {
    successCallback: submitAction.callback,
    successProps: submitAction.props,
    responseCallback: completeAction.callback,
    responseProps: completeAction.props,
  };
}

function getFormNotification(options) {
  if (options.successNotification) {
    return { notification: options.successNotification, };
  } else if (options.successModal) {
    return { modal:options.successModal, };
  } else {
    return true;
  }
}

function getFormValidations(options) {
  const { validations = [], } = options;
  return validations.reduce((validationArray, key) => {
    const returnValidationObject = {};
    returnValidationObject.name = key.field;
    returnValidationObject.constraints = {
      [ key.field ]: key.constraints,
    };
    validationArray.push(returnValidationObject);
    return validationArray;
  }, []);
}

function createForm(options) {
  const formSubmission = Object.assign({
    success:getFormNotification(options),
    url: options.action, //'/tranforms',
    options: {
      method: (options.method) ? options.method.toUpperCase() : 'POST',
    },
    'params': options.actionParams, /** [{key:':id',val:'_id'}] */
    
  },
    (options.onSubmit) ? getFormOnSubmitCallbacks('onSubmit', options) : {},
    (options.onComplete) ? getFormOnSubmitCallbacks('onComplete', options) : {}
  );
  const validations = getFormValidations(options);
  const formProps = {
    flattenFormData: true,
    footergroups: false,
    useLoadingButtons:true,
    blockPageUI: options.loadingScreen,
    blockPageUILayout: options.loadingScreenLayout,
    hiddenFields: [
      {
        form_val: '$loki',
        form_name: '$loki',
      },
      {
        form_val: 'meta',
        form_name: 'meta',
      },
    ].concat(options.hiddenFields||[]),
    onSubmit: formSubmission,
    validations,
    formgroups: getFormgroups(options),
    style: Object.assign({
      paddingBottom:'1rem',
    }, options.style),
  };
  return {
    component: 'ResponsiveForm',
    props: Object.assign({},
      formProps,
      options.formProps),
    asyncprops: Object.assign({}, options.asyncprops),
  };
}

module.exports = {
  getFormElement,
  getFormgroups,
  getFormOnSubmitCallbacks,
  getFormNotification,
  createForm,
};