import React, { Component, PropTypes, } from 'react';
import { Link, } from 'react-router';
// import flatten from 'flat';
import qs from 'querystring';
import * as rb from 're-bulma';
import debounce from 'debounce';
import utilities from '../../util';
import pluralize from 'pluralize';

const propTypes = {
  returnProperty: PropTypes.any, //false or string property value
  disabled: PropTypes.bool,
  returnFormOptionsValue: PropTypes.bool,
  selector: PropTypes.string,
  displayfield: PropTypes.string,
  displayProps: PropTypes.object,
  dbname: PropTypes.string,
  multi: PropTypes.bool,
  createable: PropTypes.bool,
  flattenDataList: PropTypes.bool,
  flattenDataListOptions: PropTypes.any,
  selectedData: PropTypes.any,
  resourceUrl: PropTypes.string,
  createResourceUrl: PropTypes.string,
  data: PropTypes.array,
  value: PropTypes.any,
  onChange: PropTypes.func,
  onFocus: PropTypes.func,
  onBlur: PropTypes.func,
  limit: PropTypes.number,
  datalistdata: PropTypes.array,
};

const defaultProps = {
  disabled: false,
  returnProperty: false,
  returnFormOptionsValue: false,
  data: false,
  createable: false,
  value: undefined,
  displayProps: {},
  selectData: [],
  flattenDataList: true,
  flattenDataListOptions: {},
  selector: '_id',
  displayField: 'title',
  dbname: 'periodic',
  limit: 10,
  datalistdata: [],
  onChange: (data) => {
    console.debug('ResponsiveDatalist onChange', { data, });
  },
  onFocus: (data) => {
    console.debug('ResponsiveDatalist onFocus', { data, });
  },
  onBlur: (data) => {
    console.debug('ResponsiveDatalist onBlur', { data, });
  },
};

function getDatumValue(datum) {
  const returnProperty = (this.props.returnFormOptionsValue || (Object.keys(datum).length === 2 && typeof datum.label !== 'undefined' && typeof datum.value !== 'undefined')) ? 'value' : this.props.returnProperty;

  return (returnProperty) ? datum[ returnProperty ] : datum;
}

class ResponsiveDatalist extends Component {
  constructor(props) {
    super(props);
    this.state = {
      disabled: props.disabled,
      data: props.data,
      value: props.value,
      selectedData: props.selectedData,
      isSearching: false,
    };
    this.inputProps = Object.assign({}, this.props.passableProps);
    this.searchFunction = debounce(this.updateDataList, 200);
    this.filterStaticData = this.filterStaticData.bind(this);
    this.getDatum = getDatumValue.bind(this);
  }
  componentWillReceiveProps(nextProps) {
    // console.debug({ nextProps });
    // this.setState(Object.assign({}, nextProps, this.props.getState()));
    // // console.log('this.state', this.state);
  }

  filterStaticData(options) {
    if (this.props.returnFormOptionsValue) {
      return this.props.datalistdata.filter(item => (item.label.indexOf(options.search) > -1));
    } else if (options.search) {
      return this.props.datalistdata.filter(item => (item[ this.props.field ].indexOf(options.search) > -1));
    } else {
      return this.props.datalistdata;
    }
  }

  updateDataList(options) {
      // console.log('this.props.resourceUrl', this.props.resourceUrl);
      if (this.props.resourceUrl) {
        this.setState({ isSearching: true, });
        let stateProps = this.props.getState();
        let fetchURL = `${this.props.resourceUrl}&${qs.stringify({
        limit: this.props.limit,
        // sort: (newSortOptions.sortProp)
        //   ? `${newSortOptions.sortOrder}${newSortOptions.sortProp}`
        //   : undefined,
        query: options.search,
        allowSpecialCharacters: true,
        // pagenum: options.pagenum || 1,
      })}`;
      let headers = Object.assign({
        'x-access-token': stateProps.user.jwt_token,
      }, stateProps.settings.userprofile.options.headers);
      utilities.fetchComponent(fetchURL, { headers, })()
        .then(response => { 
          if (response.data && response.result && response.status) {
            response = response.data;
          }
          // console.debug('this.state.value',this.state.value);
          
          let updatedState = {};
          updatedState.selectedData = response[pluralize(this.props.entity)];
          updatedState.isSearching = false;
          this.setState(updatedState);
        }, e => {
          this.props.errorNotification(e);
        });
    } else if (this.props.staticSearch) {
      this.setState({ isSearching: true, });
      //options.search is the actual content
      let updatedState = {};
      updatedState.selectedData = this.filterStaticData(options);
      updatedState.isSearching = false;
      // console.debug({updatedState,response});
      this.setState(updatedState);
      //value is the array of selected values
      //selectedData is the filtered list that changes everytime user types
    } else{
      console.debug({ options,  });
    }
  }
  onChangeHandler(event) {
    const search = (event && event.target && event.target.value) ? event.target.value : '';
    this.searchFunction({ search, });
  }
  onBlurHandler() {
    setTimeout(() => {
      this.setState({ selectedData: [] });
    }, 400);
  }
  getDatalistDisplay(options){
    let { displayField, selector, datum, } = options;
    // console.debug('getDatalistDisplay', { options });
    let displayText = datum[ displayField ] || datum.title || datum.name || datum.username || datum.email || datum[ selector ] || ((datum && typeof datum === 'string') ? datum : '');
    return (<span style={{
      wordBreak: 'break-all',
      textOverflow: 'ellipsis',
      overflow: 'hidden',
      whiteSpace: 'pre-wrap',
      wordWrap: 'break-word',
    }}>
      {
        (datum && datum.fileurl && datum.transform && datum.transform.preview)
          ?<rb.Image src={datum.transform.preview} size="is24X24" style={{ float:'left', marginRight:'5px',  }}/>
          :null
      }
      {
        (this.props.resourcePreview)
          ? <Link title={datum.title||displayText} to={`${this.props.resourcePreview}/${datum[selector]||datum}`}>{displayText}</Link>
          : displayText
      }
      {
        (this.props.resourceDescription)
          ? <rb.Content><p>{datum.description}</p></rb.Content>
          : null
      }
    </span>);
  }
  removeDatalistItem(index) {
    // console.debug('clicked datalist',{index});
    // console.debug('clicked onclick',this.props);
    // console.debug('this.state.value',this.state.value);
    if (this.props.multi) {
      let newValue = Object.assign([], [].concat(this.state.value));
      newValue.splice(index, 1);
      // let oldValue = this.state.value;
      this.setState({
        // value: [],
        value: newValue,
        selectedData: [],
        update: new Date()
      }, () => {
        // this.props.onChange([]);
        this.props.onChange(newValue);
      });
    } else {
      let datum = undefined;
      this.setState({
        value:datum,
        selectedData: [],
      });
      this.props.onChange(datum);
    }
  }
  render() {
    let notificationStyle={
      marginBottom: '5px', 
      padding:'5px', 
      border:'1px solid lightgrey',
    };
    let notificationCloseStyle={
      margin: '0px 0px 0px 20px',
      borderRadius: '19px',
    };
    let selectData = (this.props.multi) 
      ? (this.state.value && this.state.value.length ) 
        ? (this.state.value.map((selected, k)=>{
          return (<rb.Notification
          key={k}
            enableCloseButton
            closeButtonProps={{ 
              onClick: this.removeDatalistItem.bind(this, k),
              style: notificationCloseStyle,
            }}
            style={notificationStyle}
          >
            {this.getDatalistDisplay({
              datum:selected,
              displayField: this.props.displayField,
              selector: this.props.selector,
            })}
          </rb.Notification>);
        }))
        : null
      : (this.state.value)
        ?(<rb.Notification
            enableCloseButton
            closeButtonProps={{ 
              onClick: this.removeDatalistItem.bind(this),
              style: notificationCloseStyle,
            }}
            style={notificationStyle}
          >

            {this.getDatalistDisplay({
              datum:this.state.value,
              displayField: this.props.displayField,
              selector: this.props.selector,
            })}
          </rb.Notification>)
        : null;
    let displayOptions = (Array.isArray(this.state.selectedData) && this.state.selectedData && this.state.selectedData.length)
      ? this.state.selectedData.map((datum, k)=>{
        return (
          <rb.Notification
            key={k}
            color="isWhite"
            style={notificationStyle}
          >
            <rb.Button 
              icon="fa fa-plus" 
              size="isSmall" 
              style={{
                alignSelf:'flex-end',
                borderRadius:'20px',
                float: 'right',
                paddingRight: '0px',
              }}
              onClick={()=>{
                // console.debug('clicked onclick',this.props);
                if(this.props.multi){
                  let newValue = (this.state.value && Array.isArray(this.state.value) && this.state.value.length)
                    ? this.state.value.concat([ datum, ])
                    : [ datum, ];
                  this.setState({
                    value:newValue,
                    selectedData: [],
                  });
                  this.props.onChange(newValue);
                } else {
                  this.setState({
                    value: datum,
                    selectedData: [],
                  });
                  this.props.onChange(datum);
                }
              }}/>
            {this.getDatalistDisplay({
              datum,
              displayField: this.props.displayField,
              selector: this.props.selector,
            })}
          </rb.Notification>);
      })
      : null;
    return(<div {...this.props.wrapperProps}>
      <div style={{ width:'100%', }}>
        <rb.Input {...this.inputProps}
          state={this.state.isSearching || undefined}
          onChange={this.onChangeHandler.bind(this)}
          onBlur={this.onBlurHandler.bind(this)}
          onFocus={this.onChangeHandler.bind(this)}
          ref={(input)=>{
            this.textInput = input; 
          }}
        />
      </div>
      <div {...this.props.displayProps}> { displayOptions }</div>
      <div>{ selectData }</div>
    </div>);
  }
}
ResponsiveDatalist.propType = propTypes;
ResponsiveDatalist.defaultProps = defaultProps;

export default ResponsiveDatalist;