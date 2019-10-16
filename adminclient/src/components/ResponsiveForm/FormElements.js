import React from 'react';
import FormItem from '../FormItem';
import RACodeMirror from '../RACodeMirror';
import PreviewEditor from '../PreviewEditor';
import ResponsiveDatalist from '../ResponsiveDatalist';
import ResponsiveTable from '../ResponsiveTable';
import DNDTable from '../DNDTable';
import RemoteDropdown from '../RemoteDropdown';
import ResponsiveTabs from '../ResponsiveTabs';
import SingleDatePickerWrapper from '../SingleDatePickerWrapper';
import DateRangePickerWrapper from '../DateRangePickerWrapper';
import ColorPicker from '../ColorPicker';
import createNumberMask from 'text-mask-addons/dist/createNumberMask';
import capitalize from 'capitalize';
import utilities from '../../util';
import qs from 'querystring';
// import RAEditor from '../RAEditor';
// import ResponsiveButton from '../ResponsiveButton';
// import { EditorState, } from 'draft-js';
import Slider from 'rc-slider';
import { default as RCSwitch } from 'rc-switch';
import { ControlLabel, Label, Input, Button, CardFooterItem, Select, Textarea, Group, Image, } from 're-bulma';
import MaskedInput from 'react-text-mask';
import {Dropdown, Checkbox, Step} from 'semantic-ui-react';
import moment from 'moment';
import numeral from 'numeral';
import pluralize from 'pluralize';
import flatten, { unflatten, } from 'flat';
import styles from '../../styles';
import ResponsiveCropper from '../ResponsiveCropper';
import { validateForm, } from './FormHelpers';
import Script from 'react-load-script';

export function getPropertyAttribute(options) {
  let { property, element, } = options;
  let attribute = element.name;
  let selector = element.idSelector;
  // console.log({ options });
  let returnVal;
  if (attribute.indexOf('.') === -1) {
    returnVal = property[attribute];
  } else {
    let attrArray = attribute.split('.');
    returnVal = (property[attrArray[0]]) ? property[attrArray[0]][attrArray[1]] : undefined;
  }

  if (selector && !options.skipSelector) {
    return returnVal[selector];
  } else {
    return returnVal;
  }
}

function getErrorStatus(state, name) {
  return (state.formDataErrors && state.formDataErrors[name]);
}

function getValidStatus(state, name) {
  return (state.formDataValid && state.formDataValid[name]);
}


function getFormElementHelp(hasError, state, name) {
  return (hasError) ? {
    color: 'isDanger',
    text: state.formDataErrors[name][0],
  } : undefined;
}

function getCustomErrorLabel(hasError, state, formelement) {
  return (hasError) ? (
    <span className="__re-bulma_help __re-bulma_is-danger" style={formelement.customErrorProps}>{state.formDataErrors[formelement.name][0]}</span>
  ) : null;
}

function getCustomErrorIcon(hasError, isValid, state, formelement) {
  let iconStyle = formelement.customIconStyle;
  let iconVar = (hasError)
    ? formelement.errorIcon || 'fa fa-exclamation'
    : (isValid)
      ? formelement.validIcon || 'fa fa-check'
      : (formelement.initialIcon)
        ? formelement.initialIcon
        : '';

  return (formelement.errorIconRight || formelement.errorIconLeft)
    ? <i className={`__re-bulma_fa ${iconVar} __ra_custom_error_icon`} style={iconStyle}></i>
    : null;
}

function getCustomLeftIcon(formElement, state) {
  state = state || {};
  let iconVar = (formElement.updateIconOnChange && state[formElement.name])
    ? formElement.options.filter(obj => obj.value === state[formElement.name])[0].icon
    : (formElement.leftIcon)
      ? formElement.leftIcon
      : null;
  if (iconVar) {
    return <i className={`__re-bulma_icon icon ${iconVar}`} style={{ position: 'absolute', top: '9px', left: '6px', zIndex: 1 }} aria-hidden="true"></i>;
  }
}

function valueChangeHandler(formElement) {
  return (event) => {
    let text = event.target.value;
    // console.debug({ text, formElement, });
    let updatedStateProp = {};
    updatedStateProp[formElement.name] = text;
    if (formElement.onChangeFilter) {
      const onChangeFunc = getFunctionFromProps.call(this, { propFunc: formElement.onChangeFilter });
      updatedStateProp = onChangeFunc.call(this, Object.assign({}, this.state, updatedStateProp), updatedStateProp);
    }
    this.setState(updatedStateProp, () => {
      if (formElement.validateOnChange) {
        this.validateFormElement({ formElement, });
      } else if (formElement.valueCheckOnChange) {
        this.valueCheckFormElement({ formElement })
      }
    });
  };
}

function getFormLabel(formElement) {
  return (formElement.label)
    ? (formElement.layoutProps && formElement.layoutProps.horizontalform)
      ? (<ControlLabel {...formElement.labelProps}>{
        (this && this.state && this.state[formElement.formdata_label])
          ? this.state[formElement.formdata_label]
          : formElement.label}</ControlLabel>)
      : (<Label {...formElement.labelProps}>{(this && this.state && this.state[formElement.formdata_label])
        ? this.state[formElement.formdata_label]
        : formElement.label}</Label>)
    : null;
}
function getCustomFormLabel(formElement) {
  return (formElement.customLabel)
    ? (formElement.layoutProps && formElement.layoutProps.horizontalform)
      ? (<ControlLabel {...formElement.labelProps}>{(formElement.label && !Array.isArray(formElement.customLabel) && typeof formElement.customLabel === 'object')
        ? this.getRenderedComponent(formElement.customLabel)
        : formElement.customLabel}</ControlLabel>)
      : (<Label {...formElement.labelProps}>{(formElement.customLabel && !Array.isArray(formElement.customLabel) && typeof formElement.customLabel === 'object')
        ? this.getRenderedComponent(formElement.customLabel)
        : formElement.customLabel}</Label>)
    : null;
}
function getInitialValue(formElement, state) {
  // console.debug({formElement, state})
  let formElementValue = formElement.value;

  if (!formElement.showNullValue && (state[formElement.name] === null || formElementValue === null || formElementValue === 'null')) {
    return '';
  } else {
    let returnVal = (typeof state[formElement.name] !== 'undefined')
      ? state[formElement.name]
      : formElementValue;

    if (formElement.momentFormat) {
      returnVal = moment(returnVal).format(formElement.momentFormat);
    }
    if (formElement.numeralFormat) {
      returnVal = numeral(returnVal).format(formElement.numeralFormat);
    }

    return returnVal;
  }
}

function getPassablePropsKeyEvents(passableProps, formElement) {
  if (formElement.keyPress) {
    let customKeyPress = () => { };
    if (typeof formElement.keyPress === 'string' && formElement.keyPress.indexOf('func:this.props') !== -1) {
      customKeyPress = this.props[formElement.keyPress.replace('func:this.props.', '')];
    } else if (typeof formElement.keyPress === 'string' && formElement.keyPress.indexOf('func:window') !== -1 && typeof window[formElement.keyPress.replace('func:window.', '')] === 'function') {
      customKeyPress = window[formElement.keyPress.replace('func:window.', '')].bind(this);
      // console.debug({ customKeyPress });
    }
    passableProps.onKeyPress = (e) => {
      if (formElement.validateOnKeypress) {
        this.validateFormElement({ formElement, });
      }
      customKeyPress(e, formElement);
      // console.debug('custom press');
    };
  } else if (formElement.submitOnEnter) {
    passableProps.onKeyPress = (e) => {
      if (formElement.submitOnEnter && (e.key === 'Enter' || e.which === 13)) {
        this.submitForm();
      }
    };
  }
  if (formElement.onBlur) {
    let customonBlur = () => { };
    if (typeof formElement.onBlur === 'string' && formElement.onBlur.indexOf('func:this.props') !== -1) {
      customonBlur = this.props[formElement.onBlur.replace('func:this.props.', '')];
    } else if (typeof formElement.onBlur === 'string' && formElement.onBlur.indexOf('func:window') !== -1 && typeof window[formElement.onBlur.replace('func:window.', '')] === 'function') {
      customonBlur = window[formElement.onBlur.replace('func:window.', '')].bind(this);
    }
    passableProps.onBlur = (e) => {
      if (formElement.validateOnBlur) {
        this.validateFormElement({ formElement, });
      } else if (formElement.valueCheckOnBlur) {
        this.valueCheckFormElement({ formElement, });
      }
      customonBlur(e, formElement);
    };
  }
  if (formElement.onFocus) {
    let customFocus = () => { };
    if (typeof formElement.onFocus === 'string' && formElement.onFocus.indexOf('func:this.props') !== -1) {
      customFocus = this.props[formElement.onFocus.replace('func:this.props.', '')];
    } else if (typeof formElement.onFocus === 'string' && formElement.onFocus.indexOf('func:window') !== -1 && typeof window[formElement.onFocus.replace('func:window.', '')] === 'function') {
      customFocus = window[formElement.onFocus.replace('func:window.', '')].bind(this);
    }
    passableProps.onFocus = (e) => {
      customFocus(e, formElement);
    };
  }
  if (formElement.keyUp) {
    let customkeyUp = () => { };
    if (typeof formElement.keyUp === 'string' && formElement.keyUp.indexOf('func:this.props') !== -1) {
      customkeyUp = this.props[formElement.keyUp.replace('func:this.props.', '')];
    } else if (typeof formElement.keyUp === 'string' && formElement.keyUp.indexOf('func:window') !== -1 && typeof window[formElement.keyUp.replace('func:window.', '')] === 'function') {
      customkeyUp = window[formElement.keyUp.replace('func:window.', '')].bind(this);
    }
    passableProps.onKeyUp = (e) => {
      if (formElement.validateOnKeyup) {
        this.validateFormElement({ formElement, });
      }
      customkeyUp(e, formElement);
    };
  }
  return passableProps;
}

function getFunctionFromProps(options) {
  const { propFunc } = options;

  if (typeof propFunc === 'string' && propFunc.indexOf('func:this.props.reduxRouter') !== -1) {
    return this.props.reduxRouter[this.props.replace('func:this.props.reduxRouter.', '')];
  } else if (typeof propFunc === 'string' && propFunc.indexOf('func:this.props') !== -1) {
    return this.props[this.props.replace('func:this.props.', '')];
  } else if (typeof propFunc === 'string' && propFunc.indexOf('func:window') !== -1 && typeof window[propFunc.replace('func:window.', '')] === 'function') {
    return window[propFunc.replace('func:window.', '')];
  } else if (typeof this.props[propFunc] === 'function') {
    return propFunc;
  } else {
    return function () { }
  }
}

export function getFormDNDTable(options) {
  let { formElement, i, } = options;
  // let initialValue = getInitialValue(formElement,
  // (Object.keys(this.state.formDataTables).length && this.state.formDataTables[formElement.name])?this.state.formDataTables :  Object.assign({}, this.state, unflatten(this.state, { overwrite: true })));
  let initialValue = this.state[formElement.name];
  // console.debug({ initialValue },this.state, this.state[formElement.name]);
  let hasError = getErrorStatus(this.state, formElement.name);
  const getTableHeaders = (row) => {
    return row.map(rowkey => {
      let selectOptions = (this.state.__formOptions && this.state.__formOptions[rowkey])
        ? this.state.__formOptions[rowkey]
        : [];
      // console.log({ selectOptions });
      return {
        label: capitalize(rowkey),
        sortid: rowkey,
        sortable: (typeof formElement.sortable !== 'undefined')
          ? formElement.sortable
          : true,
        formtype: (formElement.tableHeaderType && formElement.tableHeaderType[rowkey])
          ? formElement.tableHeaderType[rowkey]
          : 'text',
        defaultValue: (formElement.tableHeaderDefaultValue && formElement.tableHeaderDefaultValue[rowkey])
          ? formElement.tableHeaderDefaultValue[rowkey]
          : (selectOptions.length)
            ? selectOptions[0].value
            : undefined,
        formoptions: selectOptions,
        footerFormElementPassProps: Object.assign({
          placeholder: capitalize(rowkey),
        }, formElement.footerFormElementPassProps),
      };
    });
  };
  let handleRowUpdate = () => { console.debug('Error handleRowUpdate function does not exists') };
  if (formElement.handleRowUpdate && formElement.handleRowUpdate.indexOf('func:window') !== -1 && typeof window[formElement.handleRowUpdate.replace('func:window.', '')] === 'function') {
    handleRowUpdate = window[formElement.handleRowUpdate.replace('func:window.', '')].bind(this, formElement);
  }
  let useRowButtons = formElement.rowButtons;
  let ignoreTableHeaders = formElement.ignoreTableHeaders || [];
  let tableHeaders = (formElement.headers)
    ? (formElement.useStandardHeaders)
      ? getTableHeaders(formElement.headers.map(header => header.sortid))
      : formElement.headers
    : (initialValue && Array.isArray(initialValue) && initialValue.length)
      ? getTableHeaders(Object.keys(initialValue[0]).filter(header => ignoreTableHeaders.indexOf(header) === -1))
      : [];
  tableHeaders = (useRowButtons)
    ? tableHeaders.concat({
      label: formElement.rowOptionsLabel || '',
      formtype: false,
      formRowButtons: true,
      formRowButtonProps: formElement.formRowButtonProps,
    })
    : tableHeaders.concat({
      label: '',
      formtype: false,
    });
  tableHeaders = tableHeaders.map(header => {
    if ((header.formtype === 'select' || header.formtype === 'dropdown') && !header.formoptions) {
      header.formoptions = (header.sortid && this.state.__formOptions && this.state.__formOptions[header.sortid])
        ? this.state.__formOptions[header.sortid]
        : [];
    }
    return header;
  })
  let passedProps = Object.assign(
    {},
    this.props,
    {
      rows: initialValue,
      headers: tableHeaders,
      toggleRowKeys: formElement.toggleRowKeys,
      toggleRowClass: formElement.toggleRowClass,
    },
    formElement.passProps
  );
  return (<FormItem key={i} {...formElement.layoutProps} >
    {getFormLabel(formElement)}
    <DNDTable {...passedProps}
      handleRowUpdate={handleRowUpdate.bind(this)}
      value={initialValue} />
    {getCustomErrorLabel(hasError, this.state, formElement)}
  </FormItem>);
}

export function getFormDatatable(options) {
  let { formElement, i, } = options;
  let initialValue = getInitialValue(formElement,
    (Object.keys(this.state.formDataTables).length && this.state.formDataTables[formElement.name]) ? this.state.formDataTables : Object.assign({}, this.state, unflatten(this.state, { overwrite: true })));
  // console.debug({ initialValue },this.state, this.state[formElement.name]);
  let hasError = getErrorStatus(this.state, formElement.name);
  const getTableHeaders = (row) => {
    return row.map(rowkey => {
      let selectOptions = (this.state.__formOptions && this.state.__formOptions[rowkey])
        ? this.state.__formOptions[rowkey]
        : [];
      return {
        label: capitalize(rowkey),
        sortid: rowkey,
        sortable: (typeof formElement.sortable !== 'undefined')
          ? formElement.sortable
          : true,
        formtype: (formElement.tableHeaderType && formElement.tableHeaderType[rowkey])
          ? formElement.tableHeaderType[rowkey]
          : 'text',
        defaultValue: (formElement.tableHeaderDefaultValue && formElement.tableHeaderDefaultValue[rowkey])
          ? formElement.tableHeaderDefaultValue[rowkey]
          : (selectOptions.length)
            ? selectOptions[0].value
            : undefined,
        formoptions: selectOptions,
        footerFormElementPassProps: Object.assign({
          placeholder: capitalize(rowkey),
        }, formElement.footerFormElementPassProps),
      };
    });
  };
  let useRowButtons = formElement.rowButtons;
  let ignoreTableHeaders = formElement.ignoreTableHeaders || [];
  let tableHeaders = (formElement.headers)
    ? (formElement.useStandardHeaders)
      ? getTableHeaders(formElement.headers.map(header => header.sortid))
      : formElement.headers
    : (initialValue && Array.isArray(initialValue) && initialValue.length)
      ? getTableHeaders(Object.keys(initialValue[0]).filter(header => ignoreTableHeaders.indexOf(header) === -1))
      : [];
  tableHeaders = (useRowButtons)
    ? tableHeaders.concat({
      label: formElement.rowOptionsLabel || '',
      formtype: false,
      formRowButtons: true,
      formRowButtonProps: formElement.formRowButtonProps,
    })
    : tableHeaders.concat({
      label: '',
      formtype: false,
    });
  tableHeaders = tableHeaders.map(header => {
    if ((header.formtype === 'select' || header.formtype === 'dropdown') && !header.formoptions) {
      header.formoptions = (header.sortid && this.state.__formOptions && this.state.__formOptions[header.sortid])
        ? this.state.__formOptions[header.sortid]
        : [];
    }
    return header;
  })
  let passedProps = Object.assign(
    {},
    this.props,
    {
      selectEntireRow: formElement.selectEntireRow,
      insertSelectedRowHeaderIndex: formElement.insertSelectedRowHeaderIndex,
      selectOptionSortId: formElement.selectOptionSortId,
      selectOptionSortIdLabel: formElement.selectOptionSortIdLabel,
      flattenRowData: formElement.flattenRowData,
      addNewRows: formElement.addNewRows,
      sortable: formElement.sortable,
      replaceButton: false,
      uploadAddButton: true,
      useInputRows: formElement.useInputRows,
      rows: initialValue,
      headers: tableHeaders,
      limit: 5000,
      hasPagination: false,
      tableForm: true,
      uniqueFormOptions: formElement.uniqueFormOptions,
    },
    formElement.passProps
  );// formElement.datalist,
  // console.log({ tableHeaders, useRowButtons,passedProps });
  // console.debug({tableHeaders})
  // let shape ={};// this is the header of of the footer which has elements for new insert
  // let inlineshape ={};// if true, should look like a regular form row, else form below
  // console.debug({formElement,initialValue, },'this.state',this.state);
  return (<FormItem key={i} {...formElement.layoutProps} >
    {getFormLabel(formElement)}
    <ResponsiveTable {...passedProps}
      onChange={(newvalue) => {
        let selectedRowData = (formElement.selectEntireRow && (newvalue.selectedRowData || newvalue.selectedRowIndex))
          ? {
            [`${formElement.name}__tabledata`]: {
              selectedRowData: newvalue.selectedRowData,
              selectedRowIndex: newvalue.selectedRowIndex,
            },
          }
          : {};
        let flattenedData = (this.props.flattenFormData)
          ? flatten(Object.assign({}, selectedRowData, { [formElement.name]: newvalue.rows, }))
          : {};
        let updatedStateProp = Object.assign({
          formDataTables: Object.assign({}, this.state.formDataTables, { [formElement.name]: newvalue.rows, }),
          [formElement.name]: newvalue.rows,
        }, flattenedData, selectedRowData);
        if (formElement.onChangeFilter) {
          const onChangeFunc = getFunctionFromProps.call(this, { propFunc: formElement.onChangeFilter });
          updatedStateProp = onChangeFunc.call(this, Object.assign({}, this.state, updatedStateProp), updatedStateProp);
        }
        // console.debug('DATATABLE', updatedStateProp);
        this.setState(updatedStateProp);
      }}
      value={initialValue} />
    {getCustomErrorLabel(hasError, this.state, formElement)}
  </FormItem>);
}

export function getFormDatalist(options) {
  let { formElement, i, } = options;
  let initialValue = getInitialValue(formElement, Object.assign({}, this.state, unflatten(this.state)));
  let hasError = getErrorStatus(this.state, formElement.name);
  let passedProps = Object.assign({},
    this.props,
    {
      wrapperProps: {
        style: {
          display: 'flex',
          width: '100%',
          flex: '5',
          alignItems: 'stretch',
          flexDirection: 'column',
        },
      },
      passableProps: {
        help: getFormElementHelp(hasError, this.state, formElement.name),
        color: (hasError) ? 'isDanger' : undefined,
        icon: (hasError) ? formElement.errorIcon || 'fa fa-exclamation' : undefined,
        placeholder: formElement.placeholder,
        style: {
          width: '100%',
        },
      },
    },
    formElement.datalist);
  // console.debug({formElement,initialValue, },'this.state',this.state);
  // console.debug({ passedProps });
  if (formElement.datalist.staticSearch) {
    // let datalistdata = this.state[formElement.name];
    let datalistdata = [];
    if (this.props.__formOptions && this.props.__formOptions[formElement.name]) {
      datalistdata = this.props.__formOptions[formElement.name];
    } else {
      datalistdata = this.props.formdata[pluralize(formElement.datalist.entity)] || [];
    }
    passedProps.datalistdata = datalistdata;
  }
  return (<FormItem key={i} {...formElement.layoutProps} >
    {getFormLabel(formElement)}
    <ResponsiveDatalist {...passedProps}
      onChange={(newvalue) => {
        let updatedStateProp = {};
        updatedStateProp[formElement.name] = newvalue;
        this.setState(updatedStateProp);
      }}
      value={initialValue} />
  </FormItem>);
}

export function getFormCombobox(options) {
  let { formElement, i, } = options;
  let customLabel = getCustomFormLabel.bind(this);
  let wrapperProps = Object.assign({
    className: '__re-bulma_control',
  }, formElement.wrapperProps)

  let comboboxInput;
  let handleAddition = () => {
    if (comboboxInput.value) {
      this.setState({ [formElement.name]: [comboboxInput.value, ...this.state[formElement.name]] })
      comboboxInput.value = "";
    }

  }
  let handleDelete = (idx) => {
    this.state[formElement.name].splice(idx, 1)
    this.setState({ [formElement.name]: this.state[formElement.name]})
  }

  return (<FormItem key={i} {...formElement.layoutProps} initialIcon={formElement.initialIcon}>
    {formElement.customLabel ? customLabel(formElement) : getFormLabel(formElement)}
    <div role="combobox" {...wrapperProps} style={Object.assign({}, wrapperProps.style, { position: 'relative' })}>
      <div className="__re-bulma_control __ra_combobox_item">
        <input className="__re-bulma_input" ref={(ref) => comboboxInput = ref} />
        <Button color="isSuccess" onClick={handleAddition}>ADD</Button>
      </div>
      {this.state[formElement.name].map((el, idx) => {
        return (
          <div className="__re-bulma_control __ra_combobox_item" key={`${formElement.name}_combobox_${idx}`}>
            <input className="__re-bulma_input" value={el} readOnly/>
            <Button color="isDanger" onClick={() => handleDelete(idx)}>Delete</Button>
          </div>
        )
      })}
    </div>
  </FormItem>);
}

export function getFormDropdown(options) {
  let { formElement, i, } = options;
  let initialValue = getInitialValue(formElement, Object.assign({}, this.state, unflatten(this.state)));
  let hasError = getErrorStatus(this.state, formElement.name);
  let hasValue = (formElement.name && this.state[formElement.name]) ? true : false;
  let isValid = getValidStatus(this.state, formElement.name);
  let customLabel = getCustomFormLabel.bind(this);
  let wrapperProps = Object.assign({
    className: '__re-bulma_control',
  }, formElement.wrapperProps)
  let _renderContentComponent = (content) => {
    if (typeof content === 'object' && !Array.isArray(content)) {
      return this.getRenderedComponent(content);
    } else {
      return content;
    }
  }
  wrapperProps.className = ((hasError || isValid || formElement.initialIcon) && (formElement.errorIconRight || formElement.errorIconLeft)) ? (formElement.errorIconRight) ?
    wrapperProps.className + ' __re-bulma_has-icon __re-bulma_has-icon-right'
    : wrapperProps.className + ' __re-bulma_has-icon __re-bulma_has-icon-left'
    : wrapperProps.className;
  wrapperProps.className = (formElement.leftIcon || formElement.updateIconOnChange) ? wrapperProps.className + ' __ra-left-icon' : wrapperProps.className;

  let onChange;
  let passedProps = formElement.passProps;
  let getPassablePropkeyevents = getPassablePropsKeyEvents.bind(this);
  passedProps = getPassablePropkeyevents(passedProps, formElement);
  let dropdowndata = [];
  let displayField = (formElement.passProps.displayField) ? formElement.passProps.displayField : 'label';
  let valueField = (formElement.passProps.valueField) ? formElement.passProps.valueField : 'value';
  let imageField = (formElement.passProps.imageField) ? formElement.passProps.imageField : 'image';
  if (this.props.__formOptions && formElement.formoptions_field && this.props.__formOptions[formElement.formoptions_field]) {
    dropdowndata = this.props.__formOptions[formElement.formoptions_field];
    dropdowndata = dropdowndata.map(option => ((option[imageField])
      ? { text: _renderContentComponent(option[displayField]), value: option[valueField], key: option[valueField], image: { avatar: true, src: option[imageField] }, }
      : { text: _renderContentComponent(option[displayField]), value: option[valueField], key: option[valueField], icon: option.icon, selectedLabelStyle: option.selectedLabelStyle, content: (option.content) ? this.getRenderedComponent(option.content) : null }));
  }
  else if (this.props.__formOptions && this.props.__formOptions[formElement.name]) {
    dropdowndata = this.props.__formOptions[formElement.name];
    dropdowndata = dropdowndata.map(option => ((option[imageField])
      ? { text: _renderContentComponent(option[displayField]), value: option[valueField], key: option[valueField], image: { avatar: true, src: option[imageField] }, }
      : { text: _renderContentComponent(option[displayField]), value: option[valueField], key: option[valueField], icon: option.icon, selectedLabelStyle: option.selectedLabelStyle, content: (option.content) ? this.getRenderedComponent(option.content) : null }));
  } else {
    dropdowndata = formElement.options || [];
    dropdowndata = dropdowndata.map(option => ((option[imageField])
      ? { text: _renderContentComponent(option[displayField]), value: option[valueField], key: option[valueField], image: { avatar: true, src: option[imageField] }, }
      : { text: _renderContentComponent(option[displayField]), value: option[valueField], key: option[valueField], icon: option.icon, selectedLabelStyle: option.selectedLabelStyle, content: (option.content) ? this.getRenderedComponent(option.content) : null }));
  }
  passedProps.options = dropdowndata;
  if (formElement.disableOnChange) {
    onChange = () => { return () => { } };
  } else if (!onChange && formElement.passProps.multiple) {
    onChange = (event, newvalue) => {
      let updatedStateProp = {};
      newvalue.options.forEach((val, idx) => {
        if (newvalue.value[idx]) updatedStateProp[`${formElement.name}.${idx}`] = newvalue.value[idx];
        else updatedStateProp[`${formElement.name}.${idx}`] = undefined;
      });
      this.setState(updatedStateProp, () => {
        if (formElement.validateOnChange) {
          this.validateFormElement({ formElement, });
        } else if (formElement.valueCheckOnChange) {
          this.valueCheckFormElement({ formElement })
        }
      });
    }
  } else if (!onChange) {
    onChange = (event, newvalue) => {
      let updatedStateProp = {};
      updatedStateProp[formElement.name] = newvalue.value;
      this.setState(updatedStateProp, () => {
        if (formElement.validateOnChange) {
          this.validateFormElement({ formElement, });
        } else if (formElement.valueCheckOnChange) {
          this.valueCheckFormElement({ formElement })
        }
      });
    }
  }
  let customCallbackfunction;
  if (formElement.customOnChange) {
    if (formElement.customOnChange.indexOf('func:this.props') !== -1) {
      customCallbackfunction = this.props[formElement.customOnChange.replace('func:this.props.', '')];
    } else if (formElement.customOnChange.indexOf('func:window') !== -1 && typeof window[formElement.customOnChange.replace('func:window.', '')] === 'function') {
      customCallbackfunction = window[formElement.customOnChange.replace('func:window.', '')].bind(this, formElement);
    }
  }

  formElement.customIconStyle = Object.assign({}, { right: "24px" }, formElement.customIconStyle);

  if (formElement.passProps.multiple && Array.isArray(unflatten(this.state)[formElement.name])) {
    initialValue = unflatten(this.state)[formElement.name].filter(i => i !== undefined);
  }
  return (<FormItem key={i} {...formElement.layoutProps} initialIcon={formElement.initialIcon} isValid={isValid} hasError={hasError} hasValue={hasValue}>
    {formElement.customLabel ? customLabel(formElement) : getFormLabel(formElement)}
    <div {...wrapperProps} style={Object.assign({}, wrapperProps.style, { position: 'relative' })}>
      <Dropdown
        fluid
        selection
        {...passedProps}
        renderLabel={(label) => ({
          icon: label.icon,
          content: label.text,
          image: label.image,
          style: label.selectedLabelStyle
        })}
        value={initialValue}
        onChange={(event, newvalue) => {
          onChange.call(this, event, newvalue);
          if (customCallbackfunction) customCallbackfunction(event, newvalue);
        }}
      />
      {getCustomLeftIcon(formElement, this.state)}
      {getCustomErrorIcon(hasError, isValid, this.state, formElement)}
      {getCustomErrorLabel(hasError, this.state, formElement)}
    </div>
  </FormItem>);
}



export function getFormRemoteDropdown(options) {
  let { formElement, i, } = options;
  let initialValue = getInitialValue(formElement, Object.assign({}, this.state, unflatten(this.state)));
  let hasError = getErrorStatus(this.state, formElement.name);
  let hasValue = (formElement.name && this.state[formElement.name]) ? true : false;
  let isValid = getValidStatus(this.state, formElement.name);
  let customLabel = getCustomFormLabel.bind(this);
  let wrapperProps = Object.assign({
    className: '__re-bulma_control',
  }, formElement.wrapperProps)

  wrapperProps.className = ((hasError || isValid || formElement.initialIcon) && (formElement.errorIconRight || formElement.errorIconLeft)) ? (formElement.errorIconRight) ?
    wrapperProps.className + ' __re-bulma_has-icon __re-bulma_has-icon-right'
    : wrapperProps.className + ' __re-bulma_has-icon __re-bulma_has-icon-left'
    : wrapperProps.className;

  let onChange;
  let passedProps = Object.assign({}, this.props, formElement.passProps);
  let getPassablePropkeyevents = getPassablePropsKeyEvents.bind(this);
  passedProps = getPassablePropkeyevents(passedProps, formElement);
  let dropdowndata = [];
  let updatedState = {};
  if (formElement.disableOnChange) {
    onChange = () => { return () => { } };
  } else if (!onChange && formElement.passProps.multiple) {
    onChange = (event, newvalue) => {
      let updatedStateProp = {};
      newvalue.options.forEach((val, idx) => {
        if (newvalue.value[idx]) updatedStateProp[`${formElement.name}.${idx}`] = newvalue.value[idx];
        else updatedStateProp[`${formElement.name}.${idx}`] = undefined;
      });
      this.setState(updatedStateProp, () => {
        if (formElement.validateOnChange) {
          this.validateFormElement({ formElement, });
        } else if (formElement.valueCheckOnChange) {
          this.valueCheckFormElement({ formElement })
        }
      });
    }
  } else if (!onChange) {
    onChange = (event, newvalue) => {
      let updatedStateProp = {};
      updatedStateProp[formElement.name] = newvalue.value;
      this.setState(updatedStateProp, () => {
        if (formElement.validateOnChange) {
          this.validateFormElement({ formElement, });
        } else if (formElement.valueCheckOnChange) {
          this.valueCheckFormElement({ formElement })
        }
      });
    }
  }
  let customCallbackfunction;
  if (formElement.customOnChange) {
    if (formElement.customOnChange.indexOf('func:this.props') !== -1) {
      customCallbackfunction = this.props[formElement.customOnChange.replace('func:this.props.', '')];
    } else if (formElement.customOnChange.indexOf('func:window') !== -1 && typeof window[formElement.customOnChange.replace('func:window.', '')] === 'function') {
      customCallbackfunction = window[formElement.customOnChange.replace('func:window.', '')].bind(this, formElement);
    }
  }

  formElement.customIconStyle = Object.assign({}, { right: "24px" }, formElement.customIconStyle);

  if (formElement.passProps.multiple && Array.isArray(unflatten(this.state)[formElement.name])) {
    initialValue = unflatten(this.state)[formElement.name].filter(i => i !== undefined);
  }
  return (<FormItem key={i} {...formElement.layoutProps} initialIcon={formElement.initialIcon} isValid={isValid} hasError={hasError} hasValue={hasValue}>
    {formElement.customLabel ? customLabel(formElement) : getFormLabel(formElement)}
    <div {...wrapperProps}>
      <RemoteDropdown
        {...passedProps}
        value={initialValue}
        onChange={(event, newvalue) => {
          onChange.call(this, event, newvalue);
          if (customCallbackfunction) customCallbackfunction(event, newvalue);
        }}
      />
      {getCustomErrorIcon(hasError, isValid, this.state, formElement)}
      {getCustomErrorLabel(hasError, this.state, formElement)}
    </div>
  </FormItem>);
}

export function getFormMaskedInput(options) {
  let { formElement, i, /*formgroup, width,*/ onChange, } = options;
  let initialValue = getInitialValue(formElement, this.state);
  let getPassablePropkeyevents = getPassablePropsKeyEvents.bind(this);
  let fileClassname = `__reactapp_file_${formElement.name}`;
  let hasError = getErrorStatus(this.state, formElement.name);
  let hasValue = (formElement.name && this.state[formElement.name]) ? true : false;
  let isValid = getValidStatus(this.state, formElement.name);
  let customLabel = getCustomFormLabel.bind(this);
  let passableProps = Object.assign({
    type: 'text',
    className: '__re-bulma_input',
  }, formElement.passProps);

  if (typeof initialValue !== 'string') {
    initialValue = JSON.stringify(initialValue, null, 2);
  }
  if (formElement.disableOnChange) {
    onChange = () => { };
  } else if (!onChange) {
    onChange = (event) => {
      let text = event.target.value;
      let updatedStateProp = {};
      if (passableProps && passableProps.multiple) {
        document.querySelector(`.${fileClassname} input`).setAttribute('multiple', true);
      }
      updatedStateProp[formElement.name] = (passableProps.maxLength) ? text.substring(0, passableProps.maxLength) : text;
      this.setState(updatedStateProp);
    };
  }
  passableProps = getPassablePropkeyevents(passableProps, formElement);
  if (passableProps && passableProps.multiple) {
    let t = setImmediate(() => {
      document.querySelector(`.${fileClassname} input`).setAttribute('multiple', true);
      clearImmediate(t);
    });
  }

  formElement.customErrorProps = (formElement.customErrorProps) ? Object.assign({}, { marginTop: '6px' }, formElement.customErrorProps) : { marginTop: '6px' };

  let mask = [];
  function maskFunction(maskProp) {
    return function () {
      // return [ '(', /[1-9]/, /\d/, /\d/, ')', '\u2000', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/ ];
      if (Array.isArray(maskProp)) {
        const maskArray = maskProp.map(maskItem => {
          if (maskItem.charAt(0) === '/' && maskItem.charAt(maskItem.length - 1) === '/') {
            if (maskItem.charAt(1) === '[') {
              return new RegExp(maskItem.slice(1, maskItem.length - 1));
            } else {
              return new RegExp(`\\${maskItem.slice(1, maskItem.length - 1)}`);
            }
          } else {
            return maskItem;
          }
        });
        return maskArray;
      } else {
        return maskProp;
      }
    }
  }
  if (formElement.createNumberMask && typeof passableProps.mask === 'string' && passableProps.mask.indexOf('func:window') !== -1 && typeof window[passableProps.mask.replace('func:window.', '')] === 'function') {
    let numberMaskConfig = (typeof window[passableProps.mask.replace('func:window.', '')].call(this, formElement) === 'object') ? window[passableProps.mask.replace('func:window.', '')].call(this, formElement) : {};
    mask = createNumberMask(numberMaskConfig);
  } else if (typeof passableProps.mask === 'string' && passableProps.mask.indexOf('func:window') !== -1 && typeof window[passableProps.mask.replace('func:window.', '')] === 'function') {
    mask = window[passableProps.mask.replace('func:window.', '')].bind(this, formElement);
  } else if (formElement.createNumberMask) {
    // console.log('passableProps.numberMask',passableProps.numberMask)
    mask = createNumberMask(maskFunction(passableProps.mask));
  } else if (passableProps.mask) {
    mask = maskFunction(passableProps.mask);
  }
  // console.log({mask})
  let wrapperProps = Object.assign({
    className: '__re-bulma_control',
  }, formElement.wrapperProps);

  wrapperProps.className = ((hasError || isValid || formElement.initialIcon) && (formElement.errorIconRight || formElement.errorIconLeft)) ? (formElement.errorIconRight) ?
    wrapperProps.className + ' __re-bulma_has-icon __re-bulma_has-icon-right'
    : wrapperProps.className + ' __re-bulma_has-icon __re-bulma_has-icon-left'
    : wrapperProps.className;
  wrapperProps.className = (formElement.leftIcon) ? wrapperProps.className + ' __ra-left-icon' : wrapperProps.className;

  return (<FormItem key={i} {...formElement.layoutProps} initialIcon={formElement.initialIcon} isValid={isValid} hasError={hasError} hasValue={hasValue} >
    {formElement.customLabel ? customLabel(formElement) : getFormLabel(formElement)}
    <span {...wrapperProps} style={Object.assign({}, wrapperProps.style, { position: 'relative' })}>
      <MaskedInput
        {...passableProps}
        mask={mask}
        className={(hasError) ? passableProps.className + ' __re-bulma_is-danger' : passableProps.className}
        color={(hasError) ? 'isDanger' : undefined}
        onChange={onChange}
        placeholder={formElement.placeholder}
        value={initialValue} />
      {getCustomLeftIcon(formElement)}
      {getCustomErrorIcon(hasError, isValid, this.state, formElement)}
      {getCustomErrorLabel(hasError, this.state, formElement)}
    </span>
  </FormItem>);
}

export function getFormAddressAPIInput(options) {
  let applicationSettings = this.props.getState().settings;

  let { formElement, i, /*formgroup, width,*/ onChange, } = options;
  let initialValue = getInitialValue(formElement, this.state);
  let getPassablePropkeyevents = getPassablePropsKeyEvents.bind(this);
  let hasError = getErrorStatus(this.state, formElement.name);
  let isValid = getValidStatus(this.state, formElement.name);
  let hasValue = (formElement.name && this.state[formElement.name]) ? true : false;
  let customLabel = getCustomFormLabel.bind(this);
  let submitMultipartForm;
  let passableProps = Object.assign({
    type: formElement.type || 'text',
  }, formElement.passProps);

  let wrapperProps = Object.assign({},
    formElement.wrapperProps, {
    className: `__re-bulma_control __re-bulma_has-icon __re-bulma_has-icon-right${(formElement.leftIcon) ? ' __ra-left-icon' : ''} ${(formElement.wrapperProps && formElement.wrapperProps.className) ? formElement.wrapperProps.className : ''}`,
  })
  if (initialValue && typeof initialValue === 'object') {
    initialValue = initialValue.formatted_address || '';
  }
  if (formElement.disableOnChange) {
    onChange = () => { };
  } else if (!onChange) {
    onChange = (value) => {
      let updatedStateProp = {};
      let customCallbackfunction;
      updatedStateProp[formElement.name] = value.target.value;
      if (formElement.onChangeFilter) {
        const onChangeFunc = getFunctionFromProps.call(this, { propFunc: formElement.onChangeFilter });
        updatedStateProp = onChangeFunc.call(this, Object.assign({}, this.state, updatedStateProp), updatedStateProp);
      } else if (formElement.customOnChange) {
        if (formElement.customOnChange.indexOf('func:this.props') !== -1) {
          customCallbackfunction = this.props[formElement.customOnChange.replace('func:this.props.', '')];
        } else if (formElement.customOnChange.indexOf('func:window') !== -1 && typeof window[formElement.customOnChange.replace('func:window.', '')] === 'function') {
          customCallbackfunction = window[formElement.customOnChange.replace('func:window.', '')].bind(this, formElement);
        }
      }
      this.setState(updatedStateProp);
      if (typeof customCallbackfunction === 'function') customCallbackfunction();
    };
  }
  passableProps = getPassablePropkeyevents(passableProps, formElement);

  function handlePlaceSelect() {
    let addressObject = formElement.autocomplete.getPlace();
    let addressData = { formatted_address: addressObject.formatted_address };
    let address = addressObject.address_components;
    if (formElement.passProps && formElement.passProps.include_places_detail && address) {
      let fieldConfig = formElement.passProps.fieldConfig || {}
      for (let i = 0; i < address.length; i++) {
        let addressChunk = address[i];
        if (addressChunk.types && addressChunk.types[0]) {
          let addressType = addressChunk.types[0];
          if (fieldConfig[addressType]) {
            let name_type = (fieldConfig[addressType].short) ? 'short_name' : 'long_name';
            let field_name = (fieldConfig[addressType].field_name) ? fieldConfig[addressType].field_name : addressType;
            addressData[field_name] = addressChunk[name_type];
          }
        }
      }
    }
    let updateData;
    if (formElement.passProps && formElement.passProps.include_places_detail && address) {
      updateData = Object.assign({}, addressData, {
        query: addressObject.formatted_address,
      });
    } else {
      updateData = addressObject.formatted_address;
    }
    onChange({
      target: {
        value: updateData
      }
    });
  }
  function handleScriptLoad() {
    let options = {
      types: ['address'],
      componentRestrictions: { country: "us" },
    };
    if (formElement.passProps && formElement.passProps.include_places_detail) {
      options.fields = ["formatted_address", 'address_components'];
    } else {
      options.fields = ["formatted_address",];
    }
    /*global google*/ // PLEASE KEEP THIS LINE To disable any eslint 'google not defined' errors
    formElement.autocomplete = new google.maps.places.Autocomplete(
      document.querySelector(`.autocomplete_address_${formElement.name} > input`),
      options,
    );
    formElement.autocomplete.setFields(['address_components', 'formatted_address']);
    formElement.autocomplete.addListener('place_changed', handlePlaceSelect);
  }
  handlePlaceSelect = handlePlaceSelect.bind(this);
  handleScriptLoad = handleScriptLoad.bind(this);

  if (submitMultipartForm) clearTimeout(submitMultipartForm);
  if (applicationSettings && applicationSettings.credentials && applicationSettings.credentials.google_places_api) {
    let api_credential = applicationSettings.credentials.google_places_api;
    let inputProps = (formElement.passProps && formElement.passProps.inputProps) ? formElement.passProps.inputProps : {};
    let className = passableProps.className ? passableProps.className : ''
    className += ` autocomplete_address_${formElement.name}`
    return (<FormItem key={i} {...formElement.layoutProps} initialIcon={formElement.initialIcon} isValid={isValid} hasError={hasError} hasValue={hasValue} >
      {formElement.customLabel ? customLabel(formElement) : getFormLabel(formElement)}
      <div {...wrapperProps} style={Object.assign({}, wrapperProps.style, { position: 'relative' })}>
        <Script
          url={`https://maps.googleapis.com/maps/api/js?key=${api_credential}&libraries=places`}
          onLoad={handleScriptLoad}
        />
        <Input
          {...passableProps}
          {...inputProps}
          value={initialValue}
          className={className}
          onChange={(e) => { this.setState({ [formElement.name]: e.target.value }) }}
          help={getFormElementHelp(hasError, this.state, formElement.name)}
          color={(hasError) ? 'isDanger' : undefined}
          icon={(formElement.leftIcon) ? formElement.leftIcon : null}
          hasIcon={true}
          placeholder={formElement.placeholder} />
        {getCustomErrorIcon(hasError, isValid, this.state, formElement)}
      </div>
    </FormItem>);
  } else {
    return (<FormItem key={i} {...formElement.layoutProps} initialIcon={formElement.initialIcon} isValid={isValid} hasError={hasError} hasValue={hasValue} >
      {formElement.customLabel ? customLabel(formElement) : getFormLabel(formElement)}
      <div {...wrapperProps} style={Object.assign({}, wrapperProps.style, { position: 'relative' })}>
        <Input {...passableProps}
          help={getFormElementHelp(hasError, this.state, formElement.name)}
          color={(hasError) ? 'isDanger' : undefined}
          icon={(formElement.leftIcon) ? formElement.leftIcon : null}
          hasIcon={true}
          onChange={onChange}
          placeholder={formElement.placeholder}
          value={initialValue} />
        {getCustomErrorIcon(hasError, isValid, this.state, formElement)}
      </div>
    </FormItem>);
  }
}

export function getFormTextInputArea(options) {
  let { formElement, i, /*formgroup, width,*/ onChange, } = options;
  let initialValue = getInitialValue(formElement, this.state); //formElement.value || this.state[ formElement.name ] || getPropertyAttribute({ element:formElement, property:this.state, });
  let getPassablePropkeyevents = getPassablePropsKeyEvents.bind(this);
  let fileClassname = `__reactapp_file_${formElement.name}`;
  let hasError = getErrorStatus(this.state, formElement.name);
  let isValid = getValidStatus(this.state, formElement.name);
  let hasValue = (formElement.name && this.state[formElement.name]) ? true : false;
  let customLabel = getCustomFormLabel.bind(this);
  let submitMultipartForm;
  let passableProps = Object.assign({
    type: formElement.type || 'text',
  }, formElement.passProps);
  if (passableProps && passableProps.type === 'file') {
    passableProps.className = fileClassname;
  }
  let wrapperProps = Object.assign({},
    formElement.wrapperProps, {
    className: `__re-bulma_control __re-bulma_has-icon __re-bulma_has-icon-right${(formElement.leftIcon) ? ' __ra-left-icon' : ''} ${(formElement.wrapperProps && formElement.wrapperProps.className) ? formElement.wrapperProps.className : ''}`,
  })

  if (typeof initialValue !== 'string') {
    initialValue = JSON.stringify(initialValue, null, 2);
  }
  if (formElement.disableOnChange) {
    onChange = () => { };
  } else if (!onChange) {
    onChange = (event) => {
      let text = event.target.value;
      let updatedStateProp = {};
      let customCallbackfunction;
      if (passableProps && passableProps.multiple) {
        document.querySelector(`.${fileClassname} input`).setAttribute('multiple', true);
      }

      if (passableProps && passableProps.type === 'file') {
        updatedStateProp.formDataFiles = Object.assign({}, this.state.formDataFiles, {
          [formElement.name]: document.querySelector(`.${fileClassname} input`),
        });
        if (formElement.submitOnChange) {
          submitMultipartForm = setTimeout(() => {
            this.submitForm();
          }, 0);
          setTimeout(() => {
            window.location.reload();
          }, 1000);
        }
      } else {
        updatedStateProp[formElement.name] = (passableProps.maxLength) ? text.substring(0, passableProps.maxLength) : text;
      }
      if (formElement.onChangeFilter) {
        const onChangeFunc = getFunctionFromProps.call(this, { propFunc: formElement.onChangeFilter });
        updatedStateProp = onChangeFunc.call(this, Object.assign({}, this.state, updatedStateProp), updatedStateProp);
      } else if (formElement.customOnChange) {
        if (formElement.customOnChange.indexOf('func:this.props') !== -1) {
          customCallbackfunction = this.props[formElement.customOnChange.replace('func:this.props.', '')];
        } else if (formElement.customOnChange.indexOf('func:window') !== -1 && typeof window[formElement.customOnChange.replace('func:window.', '')] === 'function') {
          customCallbackfunction = window[formElement.customOnChange.replace('func:window.', '')].bind(this, formElement);
        }
      }
      this.setState(updatedStateProp);
      if (typeof customCallbackfunction === 'function') customCallbackfunction();
    };
  }
  passableProps = getPassablePropkeyevents(passableProps, formElement);

  // console.debug({ passableProps });
  if (passableProps && passableProps.multiple) {
    let t = setImmediate(() => {
      document.querySelector(`.${fileClassname} input`).setAttribute('multiple', true);
      clearImmediate(t);
    });
  }
  if (submitMultipartForm) clearTimeout(submitMultipartForm);
  return (<FormItem key={i} {...formElement.layoutProps} initialIcon={formElement.initialIcon} isValid={isValid} hasError={hasError} hasValue={hasValue} >
    {formElement.customLabel ? customLabel(formElement) : getFormLabel(formElement)}
    <div {...wrapperProps} style={Object.assign({}, wrapperProps.style, { position: 'relative', display: 'block' })}>
      <Input {...passableProps}
        help={getFormElementHelp(hasError, this.state, formElement.name)}
        color={(hasError) ? 'isDanger' : undefined}
        icon={(formElement.leftIcon) ? formElement.leftIcon : null}
        hasIcon={true}
        onChange={onChange}
        placeholder={formElement.placeholder}
        value={initialValue} />
      {getCustomErrorIcon(hasError, isValid, this.state, formElement)}
    </div>
  </FormItem>);
}

export function getFormImageCropper(options) {
  const self = this;
  let customLabel = getCustomFormLabel.bind(this);
  let { formElement, i, /*formgroup, width,*/ onChange, } = options;
  let initialValue = getInitialValue(formElement, this.state);
  try {
    initialValue = JSON.parse(initialValue);
  } catch (e) {
    initialValue = { "height": 0, "width": 0, "x": 0, "y": 0 };
  }
  let fileClassname = `__reactapp_file_${formElement.name}`;
  let passProps = Object.assign({}, formElement.passProps, { fileInputProps: { className: fileClassname } });
  if (passProps.cropperSrc && this.state[passProps.cropperSrc]) {
    passProps.src = this.state[passProps.cropperSrc];
  }
  passProps.cropperProps.data = initialValue;
  let getFileData = function (filedata) {
    let formDataFiles = Object.assign({}, this.state.formDataFiles, {
      [formElement.name]: filedata,
    });
    this.setState({
      formDataFiles
    });
  };
  let getCropperBoxData = function (boxdata) {
    this.setState({
      [formElement.name]: JSON.stringify(boxdata),
    })
  };
  return (<FormItem key={i} {...formElement.layoutProps} >
    {formElement.customLabel ? customLabel(formElement) : getFormLabel(formElement)}
    <ResponsiveCropper getFileData={getFileData.bind(self)} getCropperBoxData={getCropperBoxData.bind(self)} {...passProps} />
  </FormItem>);
}

export function getFormTextArea(options) {
  let { formElement, i, /*formgroup, width,*/ onChange, } = options;
  let initialValue = getInitialValue(formElement, this.state); //formElement.value || this.state[ formElement.name ] || getPropertyAttribute({ element:formElement, property:this.state, });
  let hasError = getErrorStatus(this.state, formElement.name);
  let isValid = getValidStatus(this.state, formElement.name);
  let hasValue = (formElement.name && this.state[formElement.name]) ? true : false;
  let customLabel = getCustomFormLabel.bind(this);
  let passableProps = Object.assign({
  }, formElement.passProps);
  let getPassablePropkeyevents = getPassablePropsKeyEvents.bind(this);
  passableProps = getPassablePropkeyevents(passableProps, formElement);

  if (typeof initialValue !== 'string') {
    initialValue = JSON.stringify(initialValue, null, 2);
  }
  if (formElement.disableOnChange) {
    onChange = () => { return () => { } };
  } else if (!onChange) {
    onChange = valueChangeHandler.bind(this, formElement);
  }

  let iconClassNames = ((hasError || isValid || formElement.initialIcon) && (formElement.errorIconRight || formElement.errorIconLeft))
    ? (formElement.errorIconRight)
      ? ' __re-bulma_has-icon __re-bulma_has-icon-right'
      : ' __re-bulma_has-icon __re-bulma_has-icon-left'
    : '';

  return (<FormItem key={i} {...formElement.layoutProps} initialIcon={formElement.initialIcon} isValid={isValid} hasError={hasError} hasValue={hasValue} >
    {formElement.customLabel ? customLabel(formElement) : getFormLabel(formElement)}
    <p className={"__re-bulma_control" + iconClassNames}>
      <Textarea {...passableProps}
        onChange={(event) => onChange()(event)}
        help={getFormElementHelp(hasError, this.state, formElement.name)}
        icon={(hasError) ? formElement.errorIcon || 'fa fa-exclamation' : (isValid) ? formElement.validIcon || 'fa fa-check' : (formElement.initialIcon) ? formElement.initialIcon : undefined}
        color={(hasError) ? 'isDanger' : undefined}
        hasIconRight={formElement.errorIconRight}
        placeholder={formElement.placeholder || formElement.label}
        value={this.state[formElement.name] || initialValue} />
      {getCustomErrorIcon(hasError, isValid, this.state, formElement)}
    </p>
  </FormItem>);
}

export function getFormSelect(options) {
  let { formElement, i, /*formgroup, width,*/ onChange, } = options;
  let initialValue = getInitialValue(formElement, this.state); //formElement.value || this.state[ formElement.name ] || getPropertyAttribute({ element:formElement, property:this.state, });
  let hasError = getErrorStatus(this.state, formElement.name);
  let isValid = getValidStatus(this.state, formElement.name);
  let hasValue = (formElement.name && this.state[formElement.name]) ? true : false;
  let customLabel = getCustomFormLabel.bind(this);
  let selectOptions = (this.state.__formOptions && this.state.__formOptions[formElement.name])
    ? this.state.__formOptions[formElement.name]
    : formElement.options || [];
  if (typeof initialValue !== 'string') {
    initialValue = JSON.stringify(initialValue, null, 2);
  }
  if (formElement.disableOnChange) {
    onChange = () => { return () => { } };
  } else if (!onChange) {
    onChange = valueChangeHandler.bind(this, formElement);
  }
  let customCallbackfunction;
  if (formElement.customOnChange) {
    if (formElement.customOnChange.indexOf('func:this.props') !== -1) {
      customCallbackfunction = this.props[formElement.customOnChange.replace('func:this.props.', '')];
    } else if (formElement.customOnChange.indexOf('func:window') !== -1 && typeof window[formElement.customOnChange.replace('func:window.', '')] === 'function') {
      customCallbackfunction = window[formElement.customOnChange.replace('func:window.', '')].bind(this, formElement);
    }
  }

  let iconClassNames = ((hasError || isValid || formElement.initialIcon) && (formElement.errorIconRight || formElement.errorIconLeft))
    ? (formElement.errorIconRight)
      ? ' __re-bulma_has-icon __re-bulma_has-icon-right'
      : ' __re-bulma_has-icon __re-bulma_has-icon-left'
    : '';
  iconClassNames = (formElement.leftIcon) ? + ' __ra-left-icon' : '';

  formElement.customIconStyle = Object.assign({}, { right: "24px" }, formElement.customIconStyle);

  return (<FormItem key={i} {...formElement.layoutProps} initialIcon={formElement.initialIcon} isValid={isValid} hasError={hasError} hasValue={hasValue} >
    {formElement.customLabel ? customLabel(formElement) : getFormLabel(formElement)}
    <div className={"__re-bulma_control" + iconClassNames} style={{ position: 'relative', display: 'block' }}>
      <Select {...formElement.passProps}
        style={Object.assign({}, { flex: 'inherit', marginBottom: 0 }, (formElement.passProps && formElement.passProps.style) ? formElement.passProps.style : {})}
        help={getFormElementHelp(hasError, this.state, formElement.name)}
        color={(hasError) ? 'isDanger' : undefined}
        onChange={(event) => {
          onChange()(event);
          if (customCallbackfunction) customCallbackfunction(event);
        }}
        placeholder={formElement.placeholder || formElement.label}
        value={this.state[formElement.name] || initialValue} >
        {selectOptions.map((opt, k) => {
          return <option key={k} disabled={opt.disabled} value={opt.value}>{opt.label || opt.value}</option>;
        })}
      </Select>
      {getCustomLeftIcon(formElement)}
      {(!formElement.errorIconLeft) ? getCustomErrorIcon(hasError, isValid, this.state, formElement) : null}
    </div>
  </FormItem>);
}

export function getFormCheckbox(options) {
  let { formElement, i, onValueChange, } = options;
  let hasError = getErrorStatus(this.state, formElement.name);
  let hasValue = (formElement.name && this.state[formElement.name]) ? true : false;
  let customLabel = getCustomFormLabel.bind(this);
  if (formElement.disableOnChange) {
    onValueChange = () => { };
  } else if (!onValueChange) {
    onValueChange = (/*event*/) => {
      // let text = event.target.value;
      let updatedStateProp = {};
      // console.debug('before', { updatedStateProp, formElement, }, event.target);
      if (formElement.type === 'radio') {
        // event.target.value = 'on';
        updatedStateProp[this.state[formElement.formdata_name] || formElement.name] = this.state[formElement.formdata_value] || formElement.value || 'on';
      } else {
        updatedStateProp[this.state[formElement.formdata_name] || formElement.name] = (this.state[this.state[formElement.formdata_name] || formElement.name]) ? 0 : 'on';
      }
      // console.debug('after', { updatedStateProp, formElement, }, event.target);
      if (formElement.onChangeFilter) {
        const onChangeFunc = getFunctionFromProps.call(this, { propFunc: formElement.onChangeFilter });
        updatedStateProp = onChangeFunc.call(this, Object.assign({}, this.state, updatedStateProp), updatedStateProp);
      }
      this.setState(updatedStateProp, () => {
        if (formElement.validateOnChange) {
          this.validateFormElement({ formElement, });
        }
      });
    };
  }
  return (<FormItem key={i} {...formElement.layoutProps} hasError={hasError} hasValue={hasValue} >
    {(!formElement.customLabel) ? getFormLabel(formElement) : null}
    <input {...formElement.passProps}
      type={formElement.type || 'checkbox'}
      name={this.state[formElement.formdata_name] || formElement.name}
      checked={(formElement.type === 'radio')
        ? this.state[formElement.name] === formElement.value
        : this.state[formElement.name]}
      onChange={onValueChange}
    />
    {customLabel(formElement)}
    <span {...formElement.placeholderProps}>{this.state[formElement.formdata_placeholder] || formElement.placeholder}</span>
    {getCustomErrorLabel(hasError, this.state, formElement)}
  </FormItem>);
}

export function getFormButton(options) {
  let { formElement, i, onValueChange, } = options;
  if (formElement.value) {
    this.setState({ [formElement.name]: formElement.value })
  }
  let hasError = getErrorStatus(this.state, formElement.name);
  let hasValue = (formElement.name && this.state[formElement.name]) ? true : false;
  let customLabel = getCustomFormLabel.bind(this);
  let onClickHandler;
  if (formElement.onClick) {
    if (formElement.onClick.indexOf('func:this.props') !== -1) {
      onClickHandler = this.props[formElement.onClick.replace('func:this.props.', '')];
    } else if (formElement.onClick.indexOf('func:window') !== -1 && typeof window[formElement.onClick.replace('func:window.', '')] === 'function') {
      onClickHandler = window[formElement.onClick.replace('func:window.', '')].bind(this, formElement);
    } else {
      onClickHandler = () => { };
    }
  } else {
    onClickHandler = () => { };
  }


  return (<FormItem key={i} {...formElement.layoutProps} hasError={hasError} hasValue={hasValue} >
    {formElement.customLabel ? customLabel(formElement) : getFormLabel(formElement)}
    <Button {...formElement.passProps}
      type={formElement.type}
      name={this.state[formElement.formdata_name] || formElement.name}
      onClick={onClickHandler}
    >
    </Button>
    <span {...formElement.placeholderProps}>{this.state[formElement.formdata_placeholder] || formElement.placeholder}</span>
    {getCustomErrorLabel(hasError, this.state, formElement)}
  </FormItem>);
}


export function getFormSemanticCheckbox(options) {
  let { formElement, i, onValueChange, } = options;
  let hasError = getErrorStatus(this.state, formElement.name);
  let hasValue = (formElement.name && this.state[formElement.name]) ? true : false;
  if (formElement.disableOnChange) {
    onValueChange = () => { };
  } else if (!onValueChange) {
    onValueChange = (/*event*/) => {
      // let text = event.target.value;
      let updatedStateProp = {};
      // console.debug('before', { updatedStateProp, formElement, }, event.target);

      updatedStateProp[this.state[formElement.formdata_name] || formElement.name] = (this.state[this.state[formElement.formdata_name] || formElement.name]) ? 0 : 'on';
      // console.debug('after', { updatedStateProp, formElement, }, event.target);
      if (formElement.onChangeFilter) {
        const onChangeFunc = getFunctionFromProps.call(this, { propFunc: formElement.onChangeFilter });
        updatedStateProp = onChangeFunc.call(this, Object.assign({}, this.state, updatedStateProp), updatedStateProp);
      }
      this.setState(updatedStateProp, () => {
        if (formElement.validateOnChange) {
          this.validateFormElement({ formElement, });
        }
      });
    };
  }
  return (<FormItem key={i} {...formElement.layoutProps} hasError={hasError} hasValue={hasValue} >
    <Checkbox {...formElement.passProps}
      name={this.state[formElement.formdata_name] || formElement.name}
      checked={(this.state[formElement.name] === "on") ? true : false}
      onChange={onValueChange}
      label={(typeof formElement.label === "string")
        ? formElement.label
        : (typeof formElement.label === "object")
          ? this.getRenderedComponent(formElement.label)
          : null}
    >
    </Checkbox>
    {/*<span {...formElement.placeholderProps}>{this.state[ formElement.formdata_placeholder] || formElement.placeholder}</span>*/}
    {getCustomErrorLabel(hasError, this.state, formElement)}
  </FormItem>);
}

export function getFormProgressSteps(options) {
  let { formElement, i, onValueChange, } = options;
  let hasError = getErrorStatus(this.state, formElement.name);
  let hasValue = (formElement.name && this.state[formElement.name]) ? true : false;
  let customLabel = getCustomFormLabel.bind(this);
  formElement.steps = (this.props.__formOptions && this.props.__formOptions[formElement.name])
    ? this.props.__formOptions[formElement.name]
    : (formElement.steps)
      ? formElement.steps
      : [];
  formElement.steps = formElement.steps || [];
  if (formElement.disableOnChange) {
    onValueChange = () => { };
  } else if (!onValueChange) {
    onValueChange = (event) => {
      let updatedStateProp = {};
      updatedStateProp[this.state[formElement.formdata_name] || formElement.name] = event.target.value;
      // console.debug('after', { updatedStateProp, formElement, }, event.target);
      if (formElement.onChangeFilter) {
        const onChangeFunc = getFunctionFromProps.call(this, { propFunc: formElement.onChangeFilter });
        updatedStateProp = onChangeFunc.call(this, Object.assign({}, this.state, updatedStateProp), updatedStateProp);
      }
      this.setState(updatedStateProp, () => {
        if (formElement.validateOnChange) {
          this.validateFormElement({
            formElement,
          });
        }
      });
    };
  }
  if (!hasValue) {
    let defaultChecked = formElement.steps.filter(obj => obj.checked);
    if (defaultChecked.length > 0) {
      let updatedStateProp = {};
      updatedStateProp[this.state[formElement.formdata_name] || formElement.name] = defaultChecked[0].value;
      this.setState(updatedStateProp)
    }
  }
  return (<FormItem key={i} {...formElement.layoutProps} hasError={hasError} hasValue={hasValue} >
    {formElement.customLabel ? customLabel(formElement) : getFormLabel(formElement)}
    <div className={"__re-bulma_control"}>
      <Step.Group fluid {...formElement.passProps}>
        {
          formElement.steps.map((step, idx) => {
            return (
              <Step
                disabled={(formElement.passProps && formElement.passProps.disabled)
                  ? formElement.passProps.disabled
                  : null}
                {...step.stepProps}
                active={(this.state[formElement.name] === step.value) ? true : null}
                key={`${formElement.name}-${idx}`}
                as={'label'}
                style={{ position: 'relative', cursor: 'pointer' }}
              >
                <input
                  type='radio'
                  name={this.state[formElement.formdata_name] || formElement.name}
                  checked={(this.state[formElement.name] === step.value)
                    ? true
                    : false}
                  onChange={onValueChange}
                  value={step.value}
                  style={{ position: 'absolute', opacity: 0, top: 0, left: 0 }}
                />
                <Step.Content>
                  {(!Array.isArray(step.title) && typeof step.title === 'object')
                    ? this.getRenderedComponent(step.title)
                    : <div>{step.title}</div>}
                </Step.Content>
              </Step>);
          })
        }
      </Step.Group>
      {getCustomErrorLabel(hasError, this.state, formElement)}
    </div>
  </FormItem>);
}

export function getFormSwitch(options) {
  let { formElement, i, onValueChange, } = options;
  let hasError = getErrorStatus(this.state, formElement.name);
  let hasValue = (formElement.name && this.state[formElement.name]) ? true : false;
  let customLabel = getCustomFormLabel.bind(this);
  if (formElement.disableOnChange) {
    onValueChange = () => { };
  } else if (!onValueChange) {
    onValueChange = (/*event*/) => {
      // let text = event.target.value;
      let updatedStateProp = {};
      // console.debug('before', { updatedStateProp, formElement, }, event.target);
      updatedStateProp[this.state[formElement.formdata_name] || formElement.name] = (this.state[this.state[formElement.formdata_name] || formElement.name]) ? 0 : 'on';

      // console.debug('after', { updatedStateProp, formElement, }, event.target);
      if (formElement.onChange) {
        const onChangeFunc = getFunctionFromProps.call(this, { propFunc: formElement.onChange });
        onChangeFunc.call(this, Object.assign({}, this.state, updatedStateProp), updatedStateProp);
      }
      if (formElement.onChangeFilter) {
        const onChangeFunc = getFunctionFromProps.call(this, { propFunc: formElement.onChangeFilter });
        updatedStateProp = onChangeFunc.call(this, Object.assign({}, this.state, updatedStateProp), updatedStateProp);
      }
      this.setState(updatedStateProp, () => {
        if (formElement.validateOnChange) {
          this.validateFormElement({ formElement, });
        }
      });
    };
  }

  return (<FormItem key={i} {...formElement.layoutProps} hasError={hasError} hasValue={hasValue} >
    {formElement.customLabel ? customLabel(formElement) : getFormLabel(formElement)}
    <div>
      <RCSwitch
        {...formElement.passProps}
        // type={formElement.type || 'checkbox'}
        // name={this.state[ formElement.formdata_name] || formElement.name}
        checked={this.state[formElement.name]}
        // disabled={this.state.disabled}
        // checkedChildren={'on'}
        // unCheckedChildren={''}
        onChange={onValueChange}
      />
    </div>
    <span {...formElement.placeholderProps}>{this.state[formElement.formdata_placeholder] || formElement.placeholder}</span>
    {getCustomErrorLabel(hasError, this.state, formElement)}
  </FormItem>);
}

export function getRawInput(options) {
  let { formElement, i, onValueChange, } = options;
  let hasError = getErrorStatus(this.state, formElement.name);
  let customLabel = getCustomFormLabel.bind(this);
  let wrapperProps = Object.assign({
    style: {
      overflow: 'auto',
      backgroundColor: 'white',
      border: (hasError) ? '1px solid #ed6c63' : '1px solid #d3d6db',
      borderRadius: 3,
      height: 'auto',
      boxShadow: 'inset 0 1px 2px rgba(17,17,17,.1)',
    },
  }, formElement.wrapperProps, {
    className: `${(formElement.leftIcon) ? '__ra-left-icon' : ''} ${(formElement.wrapperProps && formElement.wrapperProps.className) ? formElement.wrapperProps.className : ''}`,
  });
  let passableProps = formElement.passProps;
  let getPassablePropkeyevents = getPassablePropsKeyEvents.bind(this);
  passableProps = getPassablePropkeyevents(passableProps, formElement);
  if (!onValueChange) {
    onValueChange = (/*event*/) => {
      // let text = event.target.value;
      let updatedStateProp = {};
      updatedStateProp[formElement.name] = (this.state[formElement.name]) ? false : 'on';
      // console.log({ updatedStateProp });
      if (formElement.onChangeFilter) {
        const onChangeFunc = getFunctionFromProps.call(this, { propFunc: formElement.onChangeFilter });
        updatedStateProp = onChangeFunc.call(this, Object.assign({}, this.state, updatedStateProp), updatedStateProp);
      }
      this.setState(updatedStateProp);
    };
  }

  return (<FormItem key={i} {...formElement.layoutProps} >
    {formElement.customLabel ? customLabel(formElement) : getFormLabel(formElement)}
    <div {...wrapperProps} style={Object.assign({}, wrapperProps.style, { position: 'relative' })}>
      <input {...passableProps}
        type={formElement.type}
        checked={this.state[formElement.name]}
        onChange={onValueChange}
      >
      </input>
      {getCustomLeftIcon(formElement)}
      {getCustomErrorLabel(hasError, this.state, formElement)}
    </div>
  </FormItem>);
}

export function getSliderInput(options) {
  let { formElement, i, onValueChange, } = options;
  // const Handle = (
  // );
  let hasError = getErrorStatus(this.state, formElement.name);
  let wrapperProps = Object.assign({
    style: {
      overflow: 'auto',
      backgroundColor: 'white',
      border: (hasError) ? '1px solid #ed6c63' : '1px solid #d3d6db',
      borderRadius: 3,
      height: 'auto',
      boxShadow: 'inset 0 1px 2px rgba(17,17,17,.1)',
    },
  }, formElement.wrapperProps);
  let passableProps = Object.assign({}, formElement.passProps);
  let customCallbackfunction = () => { };
  if (formElement.handle) {
    passableProps.handle = ({ value, offset, }) => (
      <div style={{ left: `${offset}%`, }} className="__reactapp_slider__handle">
        <span className="__reactapp_arrow-left" />
        {(formElement.numeralFormat) ? numeral(value).format(formElement.numeralFormat) : value}
        <span className="__reactapp_arrow-right" />
      </div>
    );
  }
  if (formElement.customOnChange) {
    if (formElement.customOnChange.indexOf('func:this.props') !== -1) {
      customCallbackfunction = this.props[formElement.customOnChange.replace('func:this.props.', '')];
    } else if (formElement.customOnChange.indexOf('func:window') !== -1 && typeof window[formElement.customOnChange.replace('func:window.', '')] === 'function') {
      customCallbackfunction = window[formElement.customOnChange.replace('func:window.', '')].bind(this);
    }
  }
  if (!onValueChange) {
    onValueChange = (val) => {
      // console.debug({ val });
      let updatedStateProp = {};
      updatedStateProp[formElement.name] = val;
      // console.log({ updatedStateProp });
      if (formElement.onChangeFilter) {
        const onChangeFunc = getFunctionFromProps.call(this, { propFunc: formElement.onChangeFilter });
        updatedStateProp = onChangeFunc.call(this, Object.assign({}, this.state, updatedStateProp), updatedStateProp);
      }
      this.setState(updatedStateProp);
      customCallbackfunction(val);
    };
  }
  const initValue = formElement.name && this.state[formElement.name] !== undefined ?
    this.state[formElement.name]
    : formElement.value !== undefined ? formElement.value
      : formElement.passProps && formElement.passProps.defaultValue ? formElement.passProps.defaultValue
        : formElement.passProps && formElement.passProps.min ? formElement.passProps.min
          : null;

  return (<FormItem key={i} {...formElement.layoutProps} >
    {getFormLabel(formElement)}
    <div {...wrapperProps}>
      <Slider {...passableProps}
        onChange={onValueChange}
        value={initValue}
      >
        {(formElement.leftLabel)
          ? (<span className="__reactapp_slider__label __reactapp_slider__label_left">{formElement.leftLabel}</span>)
          : null
        }
        {(formElement.rightLabel)
          ? (<span className="__reactapp_slider__label __reactapp_slider__label_right">{formElement.rightLabel}</span>)
          : null
        }
      </Slider>
      {getCustomErrorLabel(hasError, this.state, formElement)}
    </div>
  </FormItem>);
}

export function getHiddenInput(options) {
  let { formElement, i, } = options;
  let initialValue = this.state[formElement.formdata_name] || this.state[formElement.name] || formElement.value;

  return <input key={i}  {...formElement.passProps}
    type="hidden"
    value={initialValue} />;
}

export function getImage(options) {
  let { formElement, i, } = options;
  let initialValue = getInitialValue(formElement, this.state);
  let imageProps = Object.assign({
    style: {
      textAlign: 'center',
    },
  }, formElement.passProps);
  //formElement.value || this.state[ formElement.name ] || getPropertyAttribute({ element:formElement, property:this.state, });
  return (<FormItem key={i} {...formElement.layoutProps} >
    {getFormLabel(formElement)}
    {(formElement.link)
      ? (<a href={initialValue} target="_blank"><Image key={i}  {...imageProps} src={this.state[formElement.preview] || initialValue} /></a>)
      : <Image key={i}  {...imageProps} src={this.state[formElement.preview] || initialValue} />
    }
  </FormItem>);
}

export function getFormLink(options) {
  let { formElement, i, button, } = options;

  let wrapperProps = Object.assign({
    style: styles.inputStyle,
  }, formElement.wrapperProps);
  let linkWrapperProps = Object.assign({
    style: {
      padding: '0 5px',
    },
  }, formElement.linkWrapperProps);
  // console.debug({ linkWrapperProps, formElement });
  wrapperProps.className = wrapperProps.className || "";
  wrapperProps.className = (formElement.leftIcon) ? wrapperProps.className + ' __ra-left-icon' : wrapperProps.className;
  return (<FormItem key={i} {...formElement.layoutProps} >
    {getFormLabel(formElement)}
    <span {...wrapperProps} >
      {getCustomLeftIcon(formElement)}
      <span {...linkWrapperProps}>
        {button}
      </span>
    </span>
  </FormItem>);
}

export function getFormGroup(options) {
  let customLabel = getCustomFormLabel.bind(this);
  let { formElement, i, groupElements, } = options;
  return (<FormItem key={i} {...formElement.layoutProps} >
    {formElement.customLabel ? customLabel(formElement) : getFormLabel(formElement)}
    <Group {...formElement.passProps}
    >
      {groupElements}
    </Group>
  </FormItem>);
}

export function getFormTabs(options) {
  let customLabel = getCustomFormLabel.bind(this);
  let { formElement, i, tabs, } = options;
  const self = this;
  tabs = tabs.map(tab => {
    tab.formElements = tab.formElements || [];
    tab.layout = {
      formElements: tab.formElements || [],
    };
    return tab;
  });
  let getFormElementsWrapper = function (tab) {
    return (<div {...tab.tabProps}>{tab.formElements.map(formElement.getFormElements.bind(self))}</div>);
  }
  let onTabChange = function (currentTab) {
    if (formElement.name) {
      self.setState({ [formElement.name]: currentTab.name });
    }
  };
  getFormElementsWrapper = getFormElementsWrapper.bind(self);
  onTabChange = (formElement.passProps.markActiveTab) ? onTabChange.bind(this) : () => { };
  return (<FormItem key={i} {...formElement.layoutProps} >
    {formElement.customLabel ? customLabel(formElement) : getFormLabel(formElement)}
    <ResponsiveTabs {...formElement.passProps} onChange={onTabChange} isForm={true} tabs={tabs} getFormElements={getFormElementsWrapper}
    />
  </FormItem>);
}

export function getFormCode(options) {
  let { formElement, i, onValueChange, } = options;
  let hasError = getErrorStatus(this.state, formElement.name);
  let initialVal = getInitialValue(formElement, this.state) || '';
  let customLabel = getCustomFormLabel.bind(this);
  let CodeMirrorProps = Object.assign({
    codeMirrorProps: Object.assign({
      lineNumbers: true,
      value: (formElement.stringify) ? JSON.stringify(initialVal, null, 2) : initialVal, //formElement.value || this.state[ formElement.name ] || getPropertyAttribute({ element:formElement, property:this.state, });
      //value: this.state[ formElement.name ] || formElement.value,
      style: {
        minHeight: 200,
      },
      lineWrapping: true,
      onChange: (!onValueChange) ? function (newvalue) {
        newvalue = (formElement.stringify) ? JSON.parse(newvalue) : newvalue;
        let updatedStateProp = {};
        updatedStateProp[formElement.name] = newvalue;
        if (formElement.onChangeFilter) {
          const onChangeFunc = getFunctionFromProps.call(this, { propFunc: formElement.onChangeFilter });
          updatedStateProp = onChangeFunc.call(this, Object.assign({}, this.state, updatedStateProp), updatedStateProp);
        }
        this.setState(updatedStateProp);
      }.bind(this) : onValueChange,
    }, formElement.codeMirrorProps),
    wrapperProps: Object.assign({
      style: {
        overflow: 'auto',
        backgroundColor: 'white',
        border: (hasError) ? '1px solid #ed6c63' : '1px solid #d3d6db',
        borderRadius: 3,
        height: 'auto',
        boxShadow: 'inset 0 1px 2px rgba(17,17,17,.1)',
      },
    }, formElement.codeMirrorWrapperProps),
  }, formElement.passProps);

  return (<FormItem key={i} {...formElement.layoutProps} >
    {formElement.customLabel ? customLabel(formElement) : getFormLabel(formElement)}
    <RACodeMirror key={i} {...CodeMirrorProps} />
    {getCustomErrorLabel(hasError, this.state, formElement)}
  </FormItem>
  );
}

export function getFormColorPicker(options) {
  let { formElement, i, onValueChange, } = options;
  let hasError = getErrorStatus(this.state, formElement.name);
  let isValid = getValidStatus(this.state, formElement.name);
  let initialVal = getInitialValue(formElement, this.state) || '';
  let customLabel = getCustomFormLabel.bind(this);
  let ColorPickerProps = Object.assign({
    onChange: (!onValueChange) ? function (newvalue) {
      if (typeof newvalue === 'object' && newvalue.hex) {
        newvalue = newvalue.hex;
      }
      newvalue = (formElement.stringify) ? JSON.parse(newvalue) : newvalue;
      let updatedStateProp = {};
      updatedStateProp[formElement.name] = newvalue;
      if (formElement.onChangeFilter) {
        const onChangeFunc = getFunctionFromProps.call(this, { propFunc: formElement.onChangeFilter });
        updatedStateProp = onChangeFunc.call(this, Object.assign({}, this.state, updatedStateProp), updatedStateProp);
      }
      this.setState(updatedStateProp);
    }.bind(this) : onValueChange,
  }, formElement.passProps);

  let passableProps = Object.assign({
    type: formElement.type || 'text',
  }, formElement.passProps);
  if (typeof initialVal !== 'string') {
    initialVal = JSON.stringify(initialVal, null, 2);
  }

  let handleOnChange = function (e, second) {
    this.setState({ [formElement.name]: e.target.value });
  };
  return (<FormItem key={i} {...formElement.layoutProps} >
    {formElement.customLabel ? customLabel(formElement) : getFormLabel(formElement)}
    <div style={{ display: 'flex' }} className='__ra_color_picker'>
      <ColorPicker key={i} {...ColorPickerProps} color={this.state[formElement.name]} {...this.state} />
      <Input {...passableProps}
        help={getFormElementHelp(hasError, this.state, formElement.name)}
        color={(hasError) ? 'isDanger' : undefined}
        icon={(hasError) ? formElement.errorIcon || 'fa fa-exclamation' : (isValid) ? formElement.validIcon || 'fa fa-check' : (formElement.initialIcon) ? formElement.initialIcon : undefined}
        hasIconRight={formElement.errorIconRight}
        onChange={handleOnChange.bind(this)}
        placeholder={formElement.placeholder}
        value={initialVal} />
    </div>
  </FormItem>
  );
}

export function getFormDatePicker(options) {
  let customLabel = getCustomFormLabel.bind(this);
  let { formElement, i, onValueChange, } = options;
  let hasError = getErrorStatus(this.state, formElement.name);
  let isValid = getValidStatus(this.state, formElement.name);
  let initialVal = getInitialValue(formElement, this.state);
  let hasValue = (formElement.name && this.state[formElement.name]) ? true : false;
  let singleCustomOnChange = function ({ date }) {
    this.setState({ [formElement.name]: (date) ? date.toISOString() : null }, () => {
      if (formElement.validateOnChange) {
        this.validateFormElement({ formElement, })
      } else if (formElement.valueCheckOnChange) {
        this.valueCheckFormElement({ formElement })
      }
    });
  };
  let rangeCustomOnChange = function ({ startDate, endDate }) {
    let combined_date = `${startDate.toISOString()};${endDate.toISOString()}`
    this.setState({ [formElement.name]: combined_date }, () => {
      if (formElement.validateOnChange) {
        this.validateFormElement({ formElement, })
      } else if (formElement.valueCheckOnChange) {
        this.valueCheckFormElement({ formElement })
      }
    })
  };
  let SingleDatePickerProps = Object.assign({}, {
    customOnChange: singleCustomOnChange.bind(this),
    initialDate: (initialVal) ? new moment(initialVal) : null
  }, formElement.passProps);
  let RangeDatePickerProps = Object.assign({}, {
    customOnChange: rangeCustomOnChange.bind(this),
    initialDate: (initialVal) ? new moment(initialVal) : null
  }, formElement.passProps);
  if (formElement.type === 'singleDatePicker') {
    return (<FormItem key={i} {...formElement.layoutProps} initialIcon={formElement.initialIcon} isValid={isValid} hasError={hasError} hasValue={hasValue}>
      {formElement.customLabel ? customLabel(formElement) : getFormLabel(formElement)}
      <div className={`__re-bulma_control${(formElement.leftIcon) ? ' __ra-left-icon' : ''}`} style={{ position: 'relative' }}>
        <SingleDatePickerWrapper key={i} {...SingleDatePickerProps} />
        {getCustomLeftIcon(formElement)}
        {getCustomErrorIcon(hasError, isValid, this.state, formElement)}
        {getCustomErrorLabel(hasError, this.state, formElement)}
      </div>
    </FormItem>
    );
  } else if (formElement.type === 'rangeDatePicker') {
    return (<FormItem key={i} {...formElement.layoutProps} initialIcon={formElement.initialIcon} isValid={isValid} hasError={hasError} hasValue={hasValue}>
      {formElement.customLabel ? customLabel(formElement) : getFormLabel(formElement)}
      <div className={`__re-bulma_control${(formElement.leftIcon) ? ' __ra-left-icon' : ''}`} style={{ position: 'relative' }}>
        <DateRangePickerWrapper key={i} {...RangeDatePickerProps} />
        {getCustomLeftIcon(formElement)}
        {getCustomErrorIcon(hasError, isValid, this.state, formElement)}
        {getCustomErrorLabel(hasError, this.state, formElement)}
      </div>
    </FormItem>
    );
  }
}

export function getFormEditor(options) {
  let { formElement, i, onValueChange, } = options;
  let initialVal = getInitialValue(formElement, this.state);
  let customLabel = getCustomFormLabel.bind(this);
  if (!onValueChange) {
    onValueChange = (newvalue) => {
      // console.debug({ newvalue, });
      let updatedStateProp = {};
      updatedStateProp[formElement.name] = newvalue.target.value;
      if (formElement.onChangeFilter) {
        const onChangeFunc = getFunctionFromProps.call(this, { propFunc: formElement.onChangeFilter });
        updatedStateProp = onChangeFunc.call(this, Object.assign({}, this.state, updatedStateProp), updatedStateProp);
      }
      this.setState(updatedStateProp);
    };
  }
  // console.debug({ initialVal });
  let EditorProps = Object.assign({}, this.props, {
    // wrapperProps: {
    //   style: {
    //     overflow: 'hidden',
    //     backgroundColor: 'white',
    //     border: '1px solid #d3d6db',
    //     borderRadius: 3,
    //     minHeight:'2rem',
    //     display:'flex',
    //     boxShadow: 'inset 0 1px 2px rgba(17,17,17,.1)',
    //   },
    // },
    passProps: {
      // toolbarStyle: {
      //   borderTop: 'none',
      //   borderLeft: 'none',
      //   borderRight: 'none',
      //   padding: '5px 0 0',
      // },
    },
    onChange: onValueChange,
  }, formElement.passProps);

  return (<FormItem key={i} {...formElement.layoutProps} >
    {formElement.customLabel ? customLabel(formElement) : getFormLabel(formElement)}
    <PreviewEditor key={i} {...EditorProps} value={initialVal} />
  </FormItem>
  );
}

function getConfirmModal(options) {
  let { formElement, } = options;
  let confirmModal;
  let modalContent = formElement.confirmModal.textContent || [];
  let onSubmit;
  if (formElement.confirmModal.type === 'comment') {
    let name = formElement.confirmModal.name || 'comment';
    onSubmit = (e) => {
      if (this.props.formgroups[this.props.formgroups.length - 1] && this.props.formgroups[this.props.formgroups.length - 1].formElements) {
        this.props.formgroups[this.props.formgroups.length - 1].formElements.push({ name, });
        this.props.hideModal('last');
        this.submitForm.call(this);
        this.props.formgroups[this.props.formgroups.length - 1].formElements = this.props.formgroups[this.props.formgroups.length - 1].formElements.filter(formElement => formElement.name !== name);
      } else {
        this.submitForm.call(this);
      }
    };
    let comment_box = Object.assign({}, {
      component: 'Input',
      type: 'commentbox',
      props: {
        onChange: (e) => this.setState({ [name]: e.target.value }),
      },
    }, formElement.confirmModal.comment);
    if (modalContent && modalContent[modalContent.length - 1] && modalContent[modalContent.length - 1].type === 'commentbox') {
      modalContent.pop();
      modalContent.push(comment_box);
    } else {
      modalContent.push(comment_box);
    }
  } else {
    onSubmit = () => {
      this.props.hideModal('last');
      this.submitForm.call(this);
    };
  }
  confirmModal = Object.assign({
    title: 'Please Confirm',
    text: {
      component: 'div',
      props: Object.assign({
        style: {
          textAlign: 'center',
        },
        className: '__ra_rf_fe_s_cm',
      }, formElement.confirmModal.contentWrapperProps),
      children: [
        {
          component: 'div',
          props: {
            className: '__ra_rf_fe_s_cm_t',
          },
          children: modalContent || '',
        },
        {
          component: 'div',
          props: Object.assign({
            className: '__ra_rf_fe_s_cm_bc',
          }, formElement.confirmModal.buttonWrapperProps),
          children: [
            {
              component: 'ResponsiveButton',
              props: Object.assign({
                style: {
                  margin: 10,
                },
                buttonProps: {
                  size: 'isMedium',

                  color: 'isPrimary',
                },
                onClick: onSubmit,
                onclickProps: 'last',
              }, formElement.confirmModal.yesButtonProps),
              children: formElement.confirmModal.yesButtonText || 'Yes',
            },
            {
              component: 'ResponsiveButton',
              props: Object.assign({
                style: {
                  margin: 10,
                },
                buttonProps: {
                  size: 'isMedium',
                },
                onClick: 'func:this.props.hideModal',
                onclickProps: 'last',
              }, formElement.confirmModal.noButtonProps),
              children: formElement.confirmModal.noButtonText || 'No',
            },
          ],
        },
      ],
    },
  }, formElement.confirmModal);
  this.props.createModal(confirmModal);
}

export function getFormSubmit(options) {
  let { formElement, i, } = options;
  let customLabel = getCustomFormLabel.bind(this);
  let passableProps = Object.assign({
    state: (formElement.confirmModal && Object.keys(this.state.formDataErrors).length > 0)
      ? 'isDisabled'
      : undefined,
  }, (this.props.useLoadingButtons && this.state.__formIsSubmitting)
    ? {
      state: 'isLoading'
    }
    : {},
    formElement.passProps);
  return (<FormItem key={i} {...formElement.layoutProps} >
    {formElement.customLabel ? customLabel(formElement) : getFormLabel(formElement)}
    <Button {...passableProps}
      onClick={() => {
        let validated_formdata = validateForm.call(this, { formdata: this.state, validationErrors: {} });
        let updateStateData = {
          formDataErrors: validated_formdata.validationErrors,
        };
        if (this.props.sendSubmitButtonVal) {
          updateStateData['submitButtonVal'] = formElement.value;
        }
        this.setState(updateStateData, () => {
          (formElement.confirmModal && Object.keys(this.state.formDataErrors).length < 1) ? getConfirmModal.call(this, { formElement }) : this.submitForm.call(this);
        });
      }}>
      {formElement.value}
    </Button>
  </FormItem>);
}


export function getCardFooterItem(options) {
  let { formElement, i, } = options;
  formElement.layoutProps = Object.assign({
    style: { cursor: 'pointer', textAlign: 'center', },
  }, formElement.layoutProps);
  return (<CardFooterItem key={i} {...formElement.layoutProps} onClick={this.submitForm.bind(this)}>
    <Label {...formElement.passProps}>
      {formElement.value}
    </Label>
  </CardFooterItem>);
}