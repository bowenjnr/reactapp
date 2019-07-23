import React, { Component, PropTypes, } from 'react';
import { Tabs, TabGroup, Tab, Button, Select, Label, Columns, Column } from 're-bulma';
import styles from '../../styles';
import { getRenderedComponent, } from '../AppLayoutMap';

const propTypes = {
  tabsType: PropTypes.string,
  isFullwidth: PropTypes.bool.isRequired,
  isButton: PropTypes.bool,
  isForm: PropTypes.bool,
  vertical: PropTypes.bool,
  tabgroupProps: PropTypes.object,
  tabsProps: PropTypes.shape({
    tabStyle: PropTypes.oneOf(['isToggle', 'isBoxed', ]),
    alignment: PropTypes.oneOf(['isLeft', 'isCenter', 'isRight', ]),
    size: PropTypes.oneOf(['isSmall', 'isMedium', 'isLarge', ]),
  }),  
};

const defaultProps = {
  tabsType: 'pageToggle',
  isFullwidth: true,
  isButton: true,
  isForm: false,
  vertical: false,
  tabgroupProps: {},
  tabsProps: {
    alignment: 'isCentered',
    size: 'isMedium',
  },  
  tabContainer: {
    isGapless: true,
    style: {
      height:'100%'
    }
  },
  verticalTabTabsContainer: {
    size: 'is2',
    style: {
      // height:'100%',
      flexDirection:'row',
    }
  },
  verticalTabContentContainer: {
    size: 'is10',
    style: {
      height:'100%',
    }
  }
};

class ResponsiveTabs extends Component {
  constructor(props) {
    super(props);
    // console.debug('responsiveTab',{props})
    this.state = {
      tabsType: props.tabsType,
      tabs: props.tabs,
      isButton: props.isButton,
      currentTab: '' || props.tabs[0],
      currentLayout: '',
      tabgroupProps: props.tabgroupProps,
      tabsProps: props.tabsProps,
    };

    this.getRenderedComponent = getRenderedComponent.bind(this);
    this.fetchRenderedComponent = this.fetchRenderedComponent.bind(this);
  }
  fetchRenderedComponent() {
    return (this.props.isForm && this.props.getFormElements)? this.props.getFormElements(...arguments) : this.getRenderedComponent.apply(this, arguments);
  }
  changeTab(tab) {
    if(this.state.tabsType === 'select'){
      tab = this.state.tabs[Number(tab)];
    }
    let currentLayout = (tab.layout && (Object.keys(tab.layout).length >= 1)) ? this.fetchRenderedComponent(tab.layout) : '';
    // window.location.hash = tab.name;
    // console.log({tab})
    this.setState({
      currentTab: tab,
      currentLayout,
    });
    let onChangeFunc = () => { };
    if (typeof this.props.onChange==='string' && this.props.onChange.indexOf('func:this.props') !== -1) {
      onChangeFunc= this.props[ this.props.onChange.replace('func:this.props.', '') ];
    } else if (typeof this.props.onChange==='string' && this.props.onChange.indexOf('func:window') !== -1 && typeof window[ this.props.onChange.replace('func:window.', '') ] ==='function') {
      onChangeFunc= window[ this.props.onChange.replace('func:window.', '') ].bind(this);
    } else if (typeof this.props.onChange === "function") {
      onChangeFunc = this.props.onChange;
    }
    // console.log('this.props.onChange',this.props.onChange)
    // console.log('onChangeFunc',onChangeFunc)
    onChangeFunc(tab);

  } 
  componentWillMount() {
    let defaultLayout = (this.state.currentTab.layout && (Object.keys(this.state.currentTab.layout).length >= 1)) ? this.fetchRenderedComponent(this.state.currentTab.layout) : '';
    this.setState({
      currentLayout: defaultLayout,
    });
    if(this.props.isForm && this.props.onChange){
      this.props.onChange(this.state.currentTab);
    }
  }
  render() {
    let TabSelector = null;
    if (this.props.customTabLayout) {
      TabSelector = this.state.tabs.map((tab, i) => { 
        let active = (tab.name === this.state.currentTab.name) ? true : false;
        let buttonStyle = (tab.name === this.state.currentTab.name) ? styles.activeButton : {};
        let customTab = Object.assign({}, this.props.customTabLayout);
        customTab.props = Object.assign({
          style:buttonStyle
        }, customTab.props, {
          onClick: () => this.changeTab(tab),
          isActive: { active },
          key: `${tab.name}-${i}`,
          tab,
        });
        return this.fetchRenderedComponent(customTab);
      });
    } else if (this.state.tabsType === 'pageToggle') { 
      TabSelector = this.state.tabs.map((tab, i) => {
        let active = (tab.name === this.state.currentTab.name) ? true : false;
        let buttonStyle = (tab.name === this.state.currentTab.name) ? styles.activeButton : {};
        if (this.state.isButton) return (
          <Tab {...tab.tabProps} key={`${tab.name}-${i}`} isActive={active} onClick={() => this.changeTab(tab)}><Button style={buttonStyle}>{tab.name}</Button></Tab>
        );
        return (
          <Tab {...tab.tabProps} key={`${tab.name}-${i}`} isActive={active} onClick={() => this.changeTab(tab)}>{tab.name}</Tab>
        );
      });
    } else if (this.state.tabsType === 'select') { 
      TabSelector = (<Select { ...this.state.tabgroupProps }
        onChange={(e) => { this.changeTab(e.target.value) }}>
        {this.props.tabs.map((tab, idx) => {
          return <option key={idx} value={idx} {...tab.tabProps}>
            {tab.name}
          </option>
        })}
      </Select>);
    } else if (this.state.tabsType === 'navBar') {
      TabSelector = this.state.tabs.map((tab, idx) => {
        let active = (tab.name === this.state.currentTab.name) ? true : false;
        return (
          <Tab {...tab.tabProps} key={idx} isActive={active} onClick={() => this.changeTab(tab)}>{tab.name}</Tab>
        );
      });
    }
    
    return (this.props.vertical)
      ? (
        <Columns {...this.props.tabContainer}>
          <Column {...this.props.verticalTabTabsContainer}>
            <Tabs {...this.state.tabsProps} style={{
              height: '100%',
              flexWrap:'wrap',
            }}>
              {
                (this.props.customTabLayout)
                ? (<div  { ...this.state.tabgroupProps }  style={{
                  flexWrap: 'wrap',
                  flexDirection:'row',
                  flex:1,
                }}>
                  {(this.props.tabLabel)
                    ? <Label {...this.props.tabLabelProps}>{this.props.tabLabel}</Label>
                    : null}  
                  {TabSelector}
                </div>)
                : (<ul  { ...this.state.tabgroupProps }  style={{
                  flexWrap: 'wrap',
                  flexDirection:'row',
                  flex:1,
                }}>
                  {(this.props.tabLabel)
                    ? <Label {...this.props.tabLabelProps}>{this.props.tabLabel}</Label>
                    : null}  
                  {TabSelector}
                </ul>)
              }  
              
            </Tabs>
          </Column>  
          <Column {...this.props.verticalTabContentContainer}>
            {this.state.currentLayout}
          </Column>  
        </Columns>
      )
      : (
        <div {...this.props.tabContainer}>
          <Tabs {...this.state.tabsProps}>
            <TabGroup { ...this.state.tabgroupProps }>
              {(this.props.tabLabel)
                ? <Label {...this.props.tabLabelProps}>{this.props.tabLabel}</Label>
                : null}  
              {TabSelector}
            </TabGroup>
          </Tabs>
          {this.state.currentLayout}
        </div>
      );
  }
}

ResponsiveTabs.propType = propTypes;
ResponsiveTabs.defaultProps = defaultProps;

export default ResponsiveTabs;
