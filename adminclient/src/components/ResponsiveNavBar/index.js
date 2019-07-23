import React, { Component, PropTypes } from 'react';
import { Link, } from 'react-router';
import { getRenderedComponent, } from '../AppLayoutMap';
import { Accordion, Menu } from 'semantic-ui-react';
import ResponsiveButton from '../ResponsiveButton';

const propTypes = {
  activeLinkStyle: PropTypes.object,
  linkProps: PropTypes.object,
  navData: PropTypes.array,
  navSections: PropTypes.array,
  params: PropTypes.array,
  active: PropTypes.boolean,
  navType: PropTypes.string,
  customComponents: PropTypes.array,
  allActive: PropTypes.boolean,
};

const defaultProps = {
  activeLinkStyle: {},
  navData: [],
  navSections: [],
  params: [],
  linkProps: {},
  toggleData: {},
  customComponents: [],
  allActive: false,
};

class ResponsiveNavBar extends Component {
  constructor(props) {
    super(props);
    let navData = props.navData || [];
    let navSections = props.navSections || [];
    let params = props.params || [];
    let linkProps = props.linkProps || {};
    let toggleData = props.toggleData || {};
    let navType = props.navType || '';
    let allActive = props.allActive;
    this.state = {
      activeIndex: [0],
      activeSinglePageIndex: [ 0, 0 ],
    };
    this.getSinglePageNav = this.getSinglePageNav.bind(this);
    this.updateSinglePageIndex = this.updateSinglePageIndex.bind(this);
    this.getMultipageNav = this.getMultipageNav.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.getPropsForOnClick = this.getPropsForOnClick.bind(this);
    this.getButtonLink = this.getButtonLink.bind(this);
    this.getBaseUrl = this.getBaseUrl.bind(this);
    this.getRenderedComponent = getRenderedComponent.bind(this);
  } 

  componentWillMount() {
     let newActiveIndex = this.props.navSections.map((section, idx) => {
        if (this.props.navData && this.props.navData[idx]) {
          this.props.navData[idx].map((link, linkIdx) => {
            let linkURL = this.getBaseUrl(section.baseURL, this.props.params, this.props, linkIdx);
            link.linkURL = linkURL;
          })
        }
        return idx;
      });
    this.setState({
      activeIndex: newActiveIndex,
    })
  }

  getBaseUrl(baseurl, params, prop, index) {
    let returnLink = baseurl;
    if (params && params.length > 0) {
      params.forEach((param) => {
        if (param.key === ":index") {
          returnLink = returnLink.replace(":index", index);
        } else {
          returnLink = returnLink.replace(param.key, prop[ param.val ]);
        }
      });
    }
    return returnLink
  }
  
  handleClick(e, titleProps) {
    const { index } = titleProps;
    const { activeIndex } = this.state;
    if (activeIndex.indexOf(index) === -1) {
      this.setState({ 
        activeIndex: [...activeIndex, index] 
      });
    } else {
      let newIndexArray = activeIndex;
      newIndexArray.splice(newIndexArray.indexOf(index), 1);
      this.setState({
        activeIndex: newIndexArray,
      });
    }
  }

  updateSinglePageIndex(indexArr) {
    this.setState({
      activeSinglePageIndex: indexArr
    });
  }

  getPropsForOnClick(component) {
    return {
      clickprop: component.props.onClick,
      clickThisProp: component.props.onclickThisProp,
      clickAddPropObject: component.props.onclickAddProp,
      clickPropObject: component.props.onclickPropObject,
      clickBaseUrl: component.props.onclickBaseUrl,
      clickLinkParams: component.props.onclickLinkParams,
      clickPassProps: component.props.onclickProps,
      clickFetchProps: component.props.fetchProps,
      clickSuccessProps: component.props.successProps,
      thisDotProp: component.props,
    };
  }
  getButtonLink(baseurl, params, prop) {
    let returnLink = baseurl;
    try {
      if (params && params.length > 0) {
        params.forEach((param) => {
          returnLink = returnLink.replace(param.key, prop[ param.val ]);
        });
      }
    } catch (e) {
      console.debug(e, { baseurl, params, prop, });
    }
    return returnLink;
  }
  getSinglePageNav(section, sectionIdx) {
    let onclickFunction = (data) => {
      console.debug('ResponsiveButton', { data, });
    };

    let itemProps = (this.props.linkProps && this.props.linkProps.className) ? this.props.linkProps.className : '';
    let subMenu = this.props.navData[sectionIdx].map((link, linkIdx) => {
      let itemProps = (this.props.linkProps && this.props.linkProps.className) ? this.props.linkProps.className : '';  
        let activeClass = (this.state.activeSinglePageIndex[ 0 ] === sectionIdx && this.state.activeSinglePageIndex[ 1 ] === linkIdx) ? 'active-nav-link nav-link' + itemProps : 'nav-link' + itemProps;
      let navLink;
      let customComponents;  

     if (link.navButton && link.navButton.component === 'ResponsiveButton') {
      let { thisDotProp, clickThisProp, clickPropObject, clickBaseUrl, clickLinkParams, clickPassProps, clickprop, clickFetchProps, clickSuccessProps, clickAddPropObject } = this.getPropsForOnClick(link.navButton);

      let linkSelectionProp = (clickThisProp)
        ? thisDotProp[clickThisProp]
        : clickPropObject || this.props;
      let onclickProp = (clickBaseUrl)
        ? this.getButtonLink(clickBaseUrl, clickLinkParams, linkSelectionProp)
        : clickPassProps || clickPropObject;

      if (clickAddPropObject && linkSelectionProp) {
        linkSelectionProp[clickAddPropObject] = this.props[clickAddPropObject];
      }
      if (clickAddPropObject && onclickProp) {
        onclickProp[clickAddPropObject] = this.props[clickAddPropObject];
      }

      if (typeof clickprop === 'string' && clickprop.indexOf('func:this.props.reduxRouter') !== -1) {
        onclickFunction = this.props.reduxRouter[clickprop.replace('func:this.props.reduxRouter.', '')];
      } else if (typeof clickprop === 'string' && clickprop.indexOf('func:this.funcs') !== -1) {
        onclickFunction = this.funcs[clickprop.replace('func:this.funcs.', '')];
      } else if (typeof clickprop === 'string' && clickprop.indexOf('func:window') !== -1) {
        onclickFunction = window[clickprop.replace('func:window.', '')].bind(this);
      } else if (typeof clickprop === 'string' && clickprop.indexOf('func:this.props') !== -1) {

        onclickFunction = this.props[clickprop.replace('func:this.props.', '')];
      } else if (typeof clickprop === 'function') {
        onclickFunction = clickprop;
      }

      navLink =  this.getRenderedComponent({
        component: 'ResponsiveButton',
        children: link.navButton.children,
        props: Object.assign({}, {
          onClick: () => {
            this.updateSinglePageIndex([ sectionIdx, linkIdx ]);
            onclickFunction.call(this, onclickProp, clickFetchProps, clickSuccessProps);
          },
          buttonProps: (link.navButton.props && link.navButton.props.buttonProps) ? link.navButton.props.buttonProps : undefined,
          style: link.navButton.style,
          className: link.navButton.className,
        }),
      })
    } else if (link.navButton && link.navButton.component !== 'ResponsiveButton') {
      navLink = this.getRenderedComponent(link.navButton)
    }
      if (link.customComponents && Array.isArray(link.customComponents)) {
      customComponents = (
        <div>
          {link.customComponents.map(component => {
            return this.getRenderedComponent(component)
          })}
        </div>
      )
    }
    
    return (
      <div
        {...this.props.itemProps}
        key={sectionIdx + '-' + linkIdx}
        className={activeClass}>
          {navLink}
          {customComponents}
      </div> )
    });
    return subMenu;
  }

  getMultipageNav(section, sectionIdx) {
    let subMenu = this.props.navData[ sectionIdx ].map((link, linkIdx) => {
      let itemProps = (this.props.linkProps && this.props.linkProps.className) ? this.props.linkProps.className : '';
      let activeClass = (link.linkURL === this.props.location.pathname)
        ? 'active-nav-link nav-link' + itemProps
        : 'nav-link' + itemProps;
      return (
        <div
          {...this.props.itemProps}
          key={sectionIdx + '-' + linkIdx}
          className={activeClass}>
          <Link
            to={link.linkURL}
            {...this.props.linkProps}>
            {link.name}
          </Link>
          {(section.buttons) ? section.buttons.map(button => {
            return this.getRenderedComponent(Object.assign({
              component: 'ResponsiveButton',
              props: Object.assign({
                buttonProps: {},
              }, button.passProps,
              {
                onclickProps: this.getBaseUrl(button.passProps.onclickBaseUrl, button.passProps.onclickLinkParams, this.props, linkIdx),
                onclickBaseUrl: null,
                onclickLinkParams: null,
              }
              ),
            }))
          }) : null}
        </div>
      )
    });
    return subMenu;
  }

  render() {
  const { activeIndex, activeSinglePageIndex } = this.state;
   let navMenu = this.props.navSections.map((section, sectionIdx)=> {
    if (section.toggle && !this.props.toggleData[section.toggle]) { return; }
     let subMenu = (this.props.navType === 'singlePage') ? this.getSinglePageNav(section, sectionIdx) : this.getMultipageNav(section, sectionIdx);
     let activeStatus = (this.props.allActive) 
      ? true 
      : activeIndex.indexOf(sectionIdx) !== -1;
     return (
        <Menu.Item {...this.props.sectionProps}>
          <Accordion.Title
            active={activeStatus} 
            index={sectionIdx} onClick={this.handleClick} 
            content={section.title} 
            {...this.props.titleProps}>
          </Accordion.Title>
          <Accordion.Content
           active={activeStatus}
            {...this.props.contentProps}>
            {subMenu}
          </Accordion.Content>
        </Menu.Item>
     )
    })
    return (
      <Accordion
        as={Menu}
        vertical
        {...this.props.accordionProps}
        >
       {navMenu}
      </Accordion>
    );
  }
}

ResponsiveNavBar.propType = propTypes;
ResponsiveNavBar.defaultProps = defaultProps;

export default ResponsiveNavBar;