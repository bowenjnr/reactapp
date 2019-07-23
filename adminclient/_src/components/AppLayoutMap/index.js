'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.AppLayoutMap = undefined;

var _keys = require('babel-runtime/core-js/object/keys');

var _keys2 = _interopRequireDefault(_keys);

var _typeof2 = require('babel-runtime/helpers/typeof');

var _typeof3 = _interopRequireDefault(_typeof2);

var _assign = require('babel-runtime/core-js/object/assign');

var _assign2 = _interopRequireDefault(_assign);

exports.getFunctionFromProps = getFunctionFromProps;
exports.getComponentFromMap = getComponentFromMap;
exports.getRenderedComponent = getRenderedComponent;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reBulma = require('re-bulma');

var rebulma = _interopRequireWildcard(_reBulma);

var _recharts = require('recharts');

var recharts = _interopRequireWildcard(_recharts);

var _victory = require('victory');

var victory = _interopRequireWildcard(_victory);

var _semanticUiReact = require('semantic-ui-react');

var semantic = _interopRequireWildcard(_semanticUiReact);

var _reactTextMask = require('react-text-mask');

var _reactTextMask2 = _interopRequireDefault(_reactTextMask);

var _reactRouter = require('react-router');

var _rcSlider = require('rc-slider');

var _rcSlider2 = _interopRequireDefault(_rcSlider);

var _reactSlick = require('react-slick');

var _reactSlick2 = _interopRequireDefault(_reactSlick);

var _rcTable = require('rc-table');

var _rcTable2 = _interopRequireDefault(_rcTable);

var _rcSwitch = require('rc-switch');

var _rcSwitch2 = _interopRequireDefault(_rcSwitch);

var _rcTree = require('rc-tree');

var _rcTree2 = _interopRequireDefault(_rcTree);

var _reactResponsiveCarousel = require('react-responsive-carousel');

var _googleMapReact = require('google-map-react');

var _googleMapReact2 = _interopRequireDefault(_googleMapReact);

var _advancedBinding = require('./advancedBinding');

var _ResponsiveForm = require('../ResponsiveForm');

var _ResponsiveForm2 = _interopRequireDefault(_ResponsiveForm);

var _ResponsiveNavBar = require('../ResponsiveNavBar');

var _ResponsiveNavBar2 = _interopRequireDefault(_ResponsiveNavBar);

var _DynamicForm = require('../DynamicForm');

var _DynamicForm2 = _interopRequireDefault(_DynamicForm);

var _DynamicLayout = require('../DynamicLayout');

var _DynamicLayout2 = _interopRequireDefault(_DynamicLayout);

var _RawOutput = require('../RawOutput');

var _RawOutput2 = _interopRequireDefault(_RawOutput);

var _RawStateOutput = require('../RawOutput/RawStateOutput');

var _RawStateOutput2 = _interopRequireDefault(_RawStateOutput);

var _MenuAppLink = require('../AppSidebar/MenuAppLink');

var _MenuAppLink2 = _interopRequireDefault(_MenuAppLink);

var _SubMenuLinks = require('../AppSidebar/SubMenuLinks');

var _SubMenuLinks2 = _interopRequireDefault(_SubMenuLinks);

var _RACodeMirror = require('../RACodeMirror');

var _RACodeMirror2 = _interopRequireDefault(_RACodeMirror);

var _PreviewEditor = require('../PreviewEditor');

var _PreviewEditor2 = _interopRequireDefault(_PreviewEditor);

var _ResponsiveDatalist = require('../ResponsiveDatalist');

var _ResponsiveDatalist2 = _interopRequireDefault(_ResponsiveDatalist);

var _SingleDatePickerWrapper = require('../SingleDatePickerWrapper');

var _SingleDatePickerWrapper2 = _interopRequireDefault(_SingleDatePickerWrapper);

var _SwimLane = require('../SwimLane');

var _SwimLane2 = _interopRequireDefault(_SwimLane);

var _DateRangePickerWrapper = require('../DateRangePickerWrapper');

var _DateRangePickerWrapper2 = _interopRequireDefault(_DateRangePickerWrapper);

var _ResponsiveTable = require('../ResponsiveTable');

var _ResponsiveTable2 = _interopRequireDefault(_ResponsiveTable);

var _RemoteDropdown = require('../RemoteDropdown');

var _RemoteDropdown2 = _interopRequireDefault(_RemoteDropdown);

var _DNDTable = require('../DNDTable');

var _DNDTable2 = _interopRequireDefault(_DNDTable);

var _ResponsiveCard = require('../ResponsiveCard');

var _ResponsiveCard2 = _interopRequireDefault(_ResponsiveCard);

var _DynamicChart = require('../DynamicChart');

var _DynamicChart2 = _interopRequireDefault(_DynamicChart);

var _ResponsiveTabs = require('../ResponsiveTabs');

var _ResponsiveTabs2 = _interopRequireDefault(_ResponsiveTabs);

var _ResponsiveBar = require('../ResponsiveBar');

var _ResponsiveBar2 = _interopRequireDefault(_ResponsiveBar);

var _ResponsiveLink = require('../ResponsiveLink');

var _ResponsiveLink2 = _interopRequireDefault(_ResponsiveLink);

var _ResponsiveFormContainer = require('../ResponsiveFormContainer');

var _ResponsiveFormContainer2 = _interopRequireDefault(_ResponsiveFormContainer);

var _ResponsiveButton = require('../ResponsiveButton');

var _ResponsiveButton2 = _interopRequireDefault(_ResponsiveButton);

var _ResponsiveCropper = require('../ResponsiveCropper');

var _ResponsiveCropper2 = _interopRequireDefault(_ResponsiveCropper);

var _ResponsiveSteps = require('../ResponsiveSteps');

var _ResponsiveSteps2 = _interopRequireDefault(_ResponsiveSteps);

var _FormItem = require('../FormItem');

var _FormItem2 = _interopRequireDefault(_FormItem);

var _util = require('../../util');

var _util2 = _interopRequireDefault(_util);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// import Editor from '../RAEditor';
var advancedBinding = (0, _advancedBinding.getAdvancedBinding)();
var renderIndex = 0;

function getFunctionFromProps(options) {
  var propFunc = options.propFunc;


  if (typeof propFunc === 'string' && propFunc.indexOf('func:this.props.reduxRouter') !== -1) {
    return this.props.reduxRouter[propFunc.replace('func:this.props.reduxRouter.', '')];
  } else if (typeof propFunc === 'string' && propFunc.indexOf('func:this.props') !== -1) {
    return this.props[propFunc.replace('func:this.props.', '')].bind(this);
  } else if (typeof propFunc === 'string' && propFunc.indexOf('func:window') !== -1 && typeof window[propFunc.replace('func:window.', '')] === 'function') {
    return window[propFunc.replace('func:window.', '')].bind(this);
  } else if (typeof this.props[propFunc] === 'function') {
    return propFunc.bind(this);
  } else {
    return function () {};
  }
}

var AppLayoutMap = exports.AppLayoutMap = (0, _assign2.default)({}, { victory: victory,
  recharts: recharts, ResponsiveForm: _ResponsiveForm2.default, ResponsiveNavBar: _ResponsiveNavBar2.default, ResponsiveFormContainer: _ResponsiveFormContainer2.default, DynamicLayout: _DynamicLayout2.default, DynamicForm: _DynamicForm2.default, RawOutput: _RawOutput2.default, RawStateOutput: _RawStateOutput2.default, FormItem: _FormItem2.default, MenuAppLink: _MenuAppLink2.default, SubMenuLinks: _SubMenuLinks2.default, ResponsiveTable: _ResponsiveTable2.default, DNDTable: _DNDTable2.default, SingleDatePickerWrapper: _SingleDatePickerWrapper2.default, SwimLane: _SwimLane2.default, DateRangePickerWrapper: _DateRangePickerWrapper2.default, ResponsiveCard: _ResponsiveCard2.default, DynamicChart: _DynamicChart2.default, ResponsiveBar: _ResponsiveBar2.default, ResponsiveTabs: _ResponsiveTabs2.default, ResponsiveDatalist: _ResponsiveDatalist2.default, CodeMirror: _RACodeMirror2.default, Range: _rcSlider.Range, Slider: _rcSlider2.default, GoogleMap: _googleMapReact2.default, Carousel: _reactResponsiveCarousel.Carousel, PreviewEditor: _PreviewEditor2.default, ResponsiveSteps: _ResponsiveSteps2.default, RemoteDropdown: _RemoteDropdown2.default, /* Editor,*/
  ResponsiveLink: _ResponsiveLink2.default,
  ResponsiveButton: _ResponsiveButton2.default,
  ResponsiveCropper: _ResponsiveCropper2.default,
  MaskedInput: _reactTextMask2.default,
  RCTable: _rcTable2.default,
  RCTree: _rcTree2.default,
  RCTreeNode: _rcTree.TreeNode,
  RCSwitch: _rcSwitch2.default,
  Slick: _reactSlick2.default
}, _react2.default.DOM, rebulma, window.__ra_custom_elements, { Link: _reactRouter.Link });

function getComponentFromMap() {
  var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var componentObject = options.componentObject,
      AppLayoutMap = options.AppLayoutMap;
  // let reactComponent = null;

  try {
    if (typeof componentObject.component !== 'string') {
      return componentObject.component;
    } else if (_react2.default.DOM[componentObject.component]) {
      return componentObject.component;
    } else if (recharts[componentObject.component.replace('recharts.', '')]) {
      return recharts[componentObject.component.replace('recharts.', '')];
    } else if (victory[componentObject.component.replace('victory.', '')]) {
      return victory[componentObject.component.replace('victory.', '')];
    } else if (componentObject.component.indexOf('Semantic.') !== -1 && semantic[componentObject.component.replace('Semantic.', '')]) {
      return semantic[componentObject.component.replace('Semantic.', '')];
    } else {
      return AppLayoutMap[componentObject.component];
    }
  } catch (e) {
    console.error(e, e.stack ? e.stack : 'no stack');
    // throw e;
    return null;
  }
}

function getRenderedComponent(componentObject, resources, debug) {
  var _this = this;

  if (debug) {
    console.debug({ resources: resources, componentObject: componentObject });
  }
  try {
    if (advancedBinding) {
      AppLayoutMap.ResponsiveLink = _ResponsiveLink2.default.bind(this);
      AppLayoutMap.ResponsiveButton = _ResponsiveButton2.default.bind(this);
    }
  } catch (e) {
    console.warn('deeply nested props are unsupported on this device', e);
  }
  // console.log('this.props', this);
  renderIndex++;
  // if(resources) console.info({ resources });
  if (!componentObject) {
    return (0, _react.createElement)('span', {}, debug ? 'Error: Missing Component Object' : '');
  }
  try {
    var getFunction = getFunctionFromProps.bind(this);
    var asyncprops = componentObject.asyncprops && (0, _typeof3.default)(componentObject.asyncprops) === 'object' ? _util2.default.traverse(componentObject.asyncprops, resources) : {};
    var windowprops = componentObject.windowprops && (0, _typeof3.default)(componentObject.windowprops) === 'object' ? _util2.default.traverse(componentObject.windowprops, window) : {};
    var thisprops = componentObject.thisprops && (0, _typeof3.default)(componentObject.thisprops) === 'object' ? _util2.default.traverse(componentObject.thisprops, (0, _assign2.default)({
      __reactapp_manifest: {
        _component: componentObject,
        _resources: resources
      }
    }, this.props, componentObject.props, this.props.getState())) : {};
    var thisDotProps = !_react2.default.DOM[componentObject.component] && !rebulma[componentObject.component] && !componentObject.ignoreReduxProps ? this.props : null;
    //allowing javascript injections
    var evalProps = componentObject.__dangerouslyEvalProps ? (0, _keys2.default)(componentObject.__dangerouslyEvalProps).reduce(function (eprops, epropName) {
      // eslint-disable-next-line
      eprops[epropName] = eval(componentObject.__dangerouslyEvalProps[epropName]);
      return eprops;
    }, {}) : {};
    var insertedComponents = componentObject.__dangerouslyInsertComponents ? (0, _keys2.default)(componentObject.__dangerouslyInsertComponents).reduce(function (cprops, cpropName) {
      // eslint-disable-next-line
      cprops[cpropName] = getRenderedComponent.call(_this, componentObject.__dangerouslyInsertComponents[cpropName], resources, debug);
      return cprops;
    }, {}) : {};
    // if (componentObject.__dangerouslyInsertComponents){ console.log({ insertedComponents });}
    var renderedCompProps = (0, _assign2.default)({
      key: renderIndex
    }, thisDotProps, thisprops, componentObject.props, asyncprops, windowprops, evalProps, insertedComponents);

    //Allowing for window functions
    if (componentObject.hasWindowFunc || componentObject.hasPropFunc) {
      (0, _keys2.default)(renderedCompProps).forEach(function (key) {
        // if (typeof renderedCompProps[key] ==='string' && renderedCompProps[key].indexOf('func:window') !== -1 && typeof window[ renderedCompProps[key].replace('func:window.', '') ] ==='function'){
        //   renderedCompProps[key]= window[ renderedCompProps[key].replace('func:window.', '') ].bind(this);
        // } 
        if (typeof renderedCompProps[key] === 'string' && renderedCompProps[key].indexOf('func:') !== -1) {
          renderedCompProps[key] = getFunction({ propFunc: renderedCompProps[key] });
        }
      });
    }
    if (componentObject.hasWindowComponent && window.__ra_custom_elements) {
      (0, _keys2.default)(renderedCompProps).forEach(function (key) {
        if (typeof renderedCompProps[key] === 'string' && renderedCompProps[key].indexOf('func:window.__ra_custom_elements') !== -1 && typeof window.__ra_custom_elements[renderedCompProps[key].replace('func:window.__ra_custom_elements.', '')] === 'function') {
          renderedCompProps[key] = _react2.default.createElement(window.__ra_custom_elements[renderedCompProps[key].replace('func:window.__ra_custom_elements.', '')], renderedCompProps['windowCompProps'] ? renderedCompProps['windowCompProps'] : _this.props, null);
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
    var comparisons = {};
    // if (thisprops) {
    //   console.debug({ thisprops, renderedCompProps });
    // }
    // console.debug('componentObject.component', componentObject.component, { thisDotProps, });

    if (componentObject.comparisonprops) {
      comparisons = componentObject.comparisonprops.map(function (comp) {
        var compares = {};
        if (Array.isArray(comp.left)) {
          compares.left = comp.left;
        }
        if (Array.isArray(comp.right)) {
          compares.right = comp.right;
        }
        var propcompares = _util2.default.traverse(compares, renderedCompProps);
        var opscompares = (0, _assign2.default)({}, comp, propcompares);
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
        } else {
          //'exists'
          return opscompares.left !== undefined || opscompares.left !== null;
        }
      });
      // console.debug({ comparisons });
      // console.debug(comparisons.filter(comp => comp === true).length);
    }
    if (componentObject.comparisonprops && comparisons.filter(function (comp) {
      return comp === true;
    }).length !== comparisons.length && (!componentObject.comparisonorprops || componentObject.comparisonorprops && comparisons.filter(function (comp) {
      return comp === true;
    }).length === 0)) {
      return null;
    } else if (typeof componentObject.conditionalprops !== 'undefined' && !(0, _keys2.default)(_util2.default.traverse(componentObject.conditionalprops, renderedCompProps)).filter(function (key) {
      return _util2.default.traverse(componentObject.conditionalprops, renderedCompProps)[key];
    }).length && (!componentObject.comparisonorprops || componentObject.comparisonorprops && comparisons.filter(function (comp) {
      return comp === true;
    }).length === 0)) {
      return null;
    } else {

      return (0, _react.createElement)(
      //element component
      getComponentFromMap({ componentObject: componentObject, AppLayoutMap: AppLayoutMap }),
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
      componentObject.children && Array.isArray(componentObject.children) && typeof componentObject.children !== 'string' ? componentObject.children.length === 1 ? getRenderedComponent.call(this, componentObject.bindprops ? (0, _assign2.default)({}, componentObject.children[0], {
        props: (0, _assign2.default)({}, renderedCompProps, componentObject.children[0].thisprops && componentObject.children[0].thisprops.style || // this is to make sure when you bind props, if you've defined props in a dynamic property, to not use bind props to  remove passing down styles
        componentObject.children[0].asyncprops && componentObject.children[0].asyncprops.style || componentObject.children[0].windowprops && componentObject.children[0].windowprops.style ? {} : {
          style: {}
        }, componentObject.children[0].props, { key: renderIndex + Math.random() })
      }) : componentObject.children[0], resources) : componentObject.children.map(function (childComponentObject) {
        return getRenderedComponent.call(_this, componentObject.bindprops ? (0, _assign2.default)({}, childComponentObject, {
          props: (0, _assign2.default)({}, renderedCompProps, childComponentObject.thisprops && childComponentObject.thisprops.style || // this is to make sure when you bind props, if you've defined props in a dynamic property, to not use bind props to  remove passing down styles
          childComponentObject.asyncprops && childComponentObject.asyncprops.style || childComponentObject.windowprops && childComponentObject.windowprops.style ? {} : {
            style: {}
          }, childComponentObject.props, { key: renderIndex + Math.random() })
        }) : childComponentObject, resources);
      }) : typeof componentObject.children === 'undefined' ? renderedCompProps && renderedCompProps.children && typeof renderedCompProps.children === 'string' ? renderedCompProps.children : null : componentObject.children);
    }
  } catch (e) {
    console.error({ componentObject: componentObject, resources: resources }, 'this', this);
    console.error(e, e.stack ? e.stack : 'no stack');
    throw e;
    // return createElement('div', {}, e.toString());
  }
}