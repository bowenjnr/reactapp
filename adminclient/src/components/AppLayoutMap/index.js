import React, { createElement, } from 'react';
import * as rebulma from 're-bulma';
import * as recharts from 'recharts';
import * as victory from 'victory';
import * as semantic from 'semantic-ui-react';
import MaskedInput from 'react-text-mask';
import { Link, } from 'react-router';
import Slider, { Range, } from 'rc-slider';
import { default as Slick } from 'react-slick';
import { default as RCTable } from 'rc-table';
import { default as RCSwitch } from 'rc-switch';
import { default as RCTree, TreeNode as RCTreeNode } from 'rc-tree';
import { Carousel, } from 'react-responsive-carousel';
import GoogleMap from 'google-map-react';
import { getAdvancedBinding, } from './advancedBinding';
import ResponsiveForm from '../ResponsiveForm';
import ResponsiveNavBar from '../ResponsiveNavBar';
import DynamicForm from '../DynamicForm';
import DynamicLayout from '../DynamicLayout';
import RawOutput from '../RawOutput';
import RawStateOutput from '../RawOutput/RawStateOutput';
import MenuAppLink from '../AppSidebar/MenuAppLink';
import SubMenuLinks from '../AppSidebar/SubMenuLinks';
import CodeMirror from '../RACodeMirror';
import PreviewEditor from '../PreviewEditor';
import ResponsiveDatalist from '../ResponsiveDatalist';
import SingleDatePickerWrapper from '../SingleDatePickerWrapper';
import SwimLane from '../SwimLane';
import DateRangePickerWrapper from '../DateRangePickerWrapper';
// import Editor from '../RAEditor';
import ResponsiveTable from '../ResponsiveTable';
import RemoteDropdown from '../RemoteDropdown';
import DNDTable from '../DNDTable';
import ResponsiveCard from '../ResponsiveCard';
import DynamicChart from '../DynamicChart';
import ResponsiveTabs from '../ResponsiveTabs';
import ResponsiveBar from '../ResponsiveBar';
import ResponsiveLink from '../ResponsiveLink';
import ResponsiveFormContainer from '../ResponsiveFormContainer';
import ResponsiveButton from '../ResponsiveButton';
import ResponsiveCropper from '../ResponsiveCropper';
import ResponsiveSteps from '../ResponsiveSteps';
import FormItem from '../FormItem';
import utilities from '../../util';
let advancedBinding = getAdvancedBinding();
let renderIndex = 0;

export function getFunctionFromProps(options) {
  const { propFunc } = options;

  if (typeof propFunc === 'string' && propFunc.indexOf('func:this.props.reduxRouter') !== -1) {
    return this.props.reduxRouter[ propFunc.replace('func:this.props.reduxRouter.', '') ];
  } else if (typeof propFunc === 'string' && propFunc.indexOf('func:this.props') !== -1) {
    return this.props[ propFunc.replace('func:this.props.', '') ].bind(this);
  } else if (typeof propFunc === 'string' && propFunc.indexOf('func:window') !== -1 && typeof window[propFunc.replace('func:window.', '')] ==='function') {
    return window[ propFunc.replace('func:window.', '') ].bind(this);
  } else if(typeof this.props[propFunc] ==='function') {
    return propFunc.bind(this);
  } else {
    return function () { }
  }
}

export let AppLayoutMap = Object.assign({}, { victory,
  recharts, ResponsiveForm, ResponsiveNavBar, ResponsiveFormContainer, DynamicLayout, DynamicForm, RawOutput, RawStateOutput, FormItem, MenuAppLink, SubMenuLinks, ResponsiveTable, DNDTable, SingleDatePickerWrapper, SwimLane, DateRangePickerWrapper, ResponsiveCard, DynamicChart, ResponsiveBar, ResponsiveTabs, ResponsiveDatalist, CodeMirror, Range, Slider, GoogleMap, Carousel, PreviewEditor, ResponsiveSteps, RemoteDropdown,/* Editor,*/
  ResponsiveLink,
  ResponsiveButton,
  ResponsiveCropper,
  MaskedInput,
  RCTable,
  RCTree,
  RCTreeNode,
  RCSwitch,
  Slick,
}, React.DOM, rebulma, window.__ra_custom_elements, { Link, });

export function getComponentFromMap(options = {}) {
  const { componentObject, AppLayoutMap } = options;
  // let reactComponent = null;
  try {
    if (typeof componentObject.component !== 'string') {
      return componentObject.component;
    } else if (React.DOM[ componentObject.component ]) {
      return componentObject.component;
    } else if (recharts[ componentObject.component.replace('recharts.', '') ]) {
      return recharts[ componentObject.component.replace('recharts.', '') ];
    } else if (victory[ componentObject.component.replace('victory.', '') ]) {
      return victory[componentObject.component.replace('victory.', '')];
    } else if (componentObject.component.indexOf('Semantic.') !== -1 && semantic[componentObject.component.replace('Semantic.', '')]) {
      return semantic[ componentObject.component.replace('Semantic.', '') ];
    } else {
      return AppLayoutMap[ componentObject.component ];
    }
  } catch (e) {
    console.error(e, (e.stack) ? e.stack:'no stack');
    // throw e;
    return null;
  }
}

export function getRenderedComponent(componentObject, resources, debug) {
  if (debug) {
    console.debug({resources,componentObject})
  }
  try {
    if (advancedBinding) {
      AppLayoutMap.ResponsiveLink = ResponsiveLink.bind(this);
      AppLayoutMap.ResponsiveButton = ResponsiveButton.bind(this);
    }
  } catch (e) {
    console.warn('deeply nested props are unsupported on this device', e);
  }
  // console.log('this.props', this);
  renderIndex++;
  // if(resources) console.info({ resources });
  if (!componentObject) {
    return createElement('span', {}, debug ? 'Error: Missing Component Object' : '');
  }
  try {
    const getFunction = getFunctionFromProps.bind(this);
    let asyncprops = (componentObject.asyncprops && typeof componentObject.asyncprops === 'object')
      ? utilities.traverse(componentObject.asyncprops, resources)
      : {};
    let windowprops = (componentObject.windowprops && typeof componentObject.windowprops === 'object')
      ? utilities.traverse(componentObject.windowprops, window)
      : {};
    let thisprops = (componentObject.thisprops && typeof componentObject.thisprops === 'object')
      ? utilities.traverse(componentObject.thisprops, Object.assign({
        __reactapp_manifest: {
          _component: componentObject,
          _resources: resources,
        },
      }, this.props, componentObject.props, this.props.getState()))
      : {};
    let thisDotProps = (!React.DOM[ componentObject.component ] && !rebulma[ componentObject.component ] && !componentObject.ignoreReduxProps)
      ? this.props
      : null;
    //allowing javascript injections
    let evalProps = (componentObject.__dangerouslyEvalProps)
      ? Object.keys(componentObject.__dangerouslyEvalProps).reduce((eprops, epropName) => { 
        // eslint-disable-next-line
        eprops[ epropName ] = eval(componentObject.__dangerouslyEvalProps[ epropName ]);
        return eprops;
      }, {})
      : {};
    let insertedComponents = (componentObject.__dangerouslyInsertComponents)
      ? Object.keys(componentObject.__dangerouslyInsertComponents).reduce((cprops, cpropName) => {
        // eslint-disable-next-line
        cprops[ cpropName ] = getRenderedComponent.call(this, componentObject.__dangerouslyInsertComponents[ cpropName ], resources, debug);
        return cprops;
      }, {})
      : {};
    // if (componentObject.__dangerouslyInsertComponents){ console.log({ insertedComponents });}
    let renderedCompProps = Object.assign({
      key: renderIndex,
    }, thisDotProps,
      thisprops,
      componentObject.props, asyncprops, windowprops, evalProps, insertedComponents);
    
      //Allowing for window functions
    if(componentObject.hasWindowFunc || componentObject.hasPropFunc){
      Object.keys(renderedCompProps).forEach(key => {
        // if (typeof renderedCompProps[key] ==='string' && renderedCompProps[key].indexOf('func:window') !== -1 && typeof window[ renderedCompProps[key].replace('func:window.', '') ] ==='function'){
        //   renderedCompProps[key]= window[ renderedCompProps[key].replace('func:window.', '') ].bind(this);
        // } 
        if (typeof renderedCompProps[key] ==='string' && renderedCompProps[key].indexOf('func:') !== -1 ){
          renderedCompProps[ key ] = getFunction({ propFunc: renderedCompProps[ key ] });
        } 
      });
    }
    if (componentObject.hasWindowComponent && window.__ra_custom_elements) {
      Object.keys(renderedCompProps).forEach(key => {
        if (typeof renderedCompProps[key] ==='string' && renderedCompProps[key].indexOf('func:window.__ra_custom_elements') !== -1 && typeof window.__ra_custom_elements[ renderedCompProps[key].replace('func:window.__ra_custom_elements.', '') ] ==='function'){
          renderedCompProps[ key ] = React.createElement(window.__ra_custom_elements[ renderedCompProps[ key ].replace('func:window.__ra_custom_elements.', '') ], (renderedCompProps[ 'windowCompProps' ]) ? renderedCompProps[ 'windowCompProps' ]
            : this.props, null);
        }
      });
    }
    if (renderedCompProps._children /* && !componentObject.children */) {
      if (Array.isArray(renderedCompProps._children)) {
        componentObject.children = [].concat(renderedCompProps._children);
      } else {
        componentObject.children = renderedCompProps._children;
      }
      delete renderedCompProps._children;
    }
    let comparisons = {};
    // if (thisprops) {
    //   console.debug({ thisprops, renderedCompProps });
    // }
    // console.debug('componentObject.component', componentObject.component, { thisDotProps, });

    if (componentObject.comparisonprops) {
      comparisons = componentObject.comparisonprops.map(comp => {
        let compares = {};
        if (Array.isArray(comp.left)) {
          compares.left = comp.left;
        }
        if (Array.isArray(comp.right)) {
          compares.right = comp.right;
        }
        let propcompares = utilities.traverse(compares, renderedCompProps);
        let opscompares = Object.assign({}, comp, propcompares);
        // console.debug({ opscompares, compares, renderedCompProps });
        if (opscompares.operation === 'eq') {
          // return opscompares.left == opscompares.right;
          return opscompares.left === opscompares.right;
        } else if (opscompares.operation === 'dneq') {
          // return opscompares.left != opscompares.right;
          return opscompares.left !== opscompares.right;
        } else if (opscompares.operation === 'dnseq') {
          return opscompares.left !== opscompares.right;
        } else if (opscompares.operation === 'seq') {
          return opscompares.left === opscompares.right;
        } else if (opscompares.operation === 'lt') {
          return opscompares.left < opscompares.right;
        } else if (opscompares.operation === 'lte') {
          return opscompares.left <= opscompares.right;
        } else if (opscompares.operation === 'gt') {
          return opscompares.left > opscompares.right;
        } else if (opscompares.operation === 'gte') {
          return opscompares.left >= opscompares.right;
        } else if (opscompares.operation === 'dne') {
          return opscompares.left === undefined || opscompares.left === null;
        } else { //'exists'
          return opscompares.left !== undefined || opscompares.left !== null;
        }
      });
      // console.debug({ comparisons });
      // console.debug(comparisons.filter(comp => comp === true).length);
    }
    if (componentObject.comparisonprops && comparisons.filter(comp => comp === true).length!==comparisons.length && (!componentObject.comparisonorprops || (componentObject.comparisonorprops && comparisons.filter(comp => comp === true).length===0))) { 
      return null;
    } else if (typeof componentObject.conditionalprops !== 'undefined'
      && !Object.keys(utilities.traverse(componentObject.conditionalprops, renderedCompProps)).filter(key => utilities.traverse(componentObject.conditionalprops, renderedCompProps)[ key ]).length && (!componentObject.comparisonorprops || (componentObject.comparisonorprops && comparisons.filter(comp => comp === true).length===0))) {
      return null;
    } else {

      return createElement(
        //element component
        getComponentFromMap({ componentObject, AppLayoutMap }),
        // (typeof componentObject.component === 'string')
        //   ? (React.DOM[ componentObject.component ])
        //     ? componentObject.component
        //     : (recharts[ componentObject.component.replace('recharts.', '') ])
        //       ? recharts[ componentObject.component.replace('recharts.', '') ]
        //       : AppLayoutMap[ componentObject.component ]
        //   : componentObject.component,
        //element props
        renderedCompProps,
        //props children
        (componentObject.children && Array.isArray(componentObject.children) && typeof componentObject.children !== 'string')
          ? (componentObject.children.length === 1)
            ? getRenderedComponent.call(this,
              (componentObject.bindprops)
                ? Object.assign({},
                  componentObject.children[0], {
                    props: Object.assign({},
                      renderedCompProps,
                      ((componentObject.children[0].thisprops && componentObject.children[0].thisprops.style) // this is to make sure when you bind props, if you've defined props in a dynamic property, to not use bind props to  remove passing down styles
                        || (componentObject.children[0].asyncprops && componentObject.children[0].asyncprops.style)
                          || (componentObject.children[0].windowprops && componentObject.children[0].windowprops.style))
                          ? {}
                          : {
                            style: {},
                          },
                      componentObject.children[0].props,
                      { key: renderIndex + Math.random(), }),
                  })
                : componentObject.children[0], resources)
            : componentObject.children.map(childComponentObject => getRenderedComponent.call(this,
            (componentObject.bindprops)
              ? Object.assign({},
                childComponentObject, {
                  props: Object.assign({},
                    renderedCompProps,
                    ((childComponentObject.thisprops && childComponentObject.thisprops.style) // this is to make sure when you bind props, if you've defined props in a dynamic property, to not use bind props to  remove passing down styles
                      || (childComponentObject.asyncprops && childComponentObject.asyncprops.style)
                        || (childComponentObject.windowprops && childComponentObject.windowprops.style))
                        ? {}
                        : {
                          style: {},
                        },
                    childComponentObject.props,
                    { key: renderIndex + Math.random(), }),
                })
              : childComponentObject, resources))
          : (typeof componentObject.children === 'undefined')
            ? (renderedCompProps && renderedCompProps.children && typeof renderedCompProps.children==='string') ? renderedCompProps.children : null
            : componentObject.children
      );
    }
   
  } catch (e) {
    console.error({ componentObject, resources, }, 'this', this);
    console.error(e, (e.stack) ? e.stack:'no stack');
    throw e;
    // return createElement('div', {}, e.toString());
  }
}