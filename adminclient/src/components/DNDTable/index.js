import React, { Component, PropTypes, } from 'react';
import { getRenderedComponent, } from '../AppLayoutMap';
import {render} from 'react-dom';
import {SortableContainer, SortableElement, arrayMove} from '@digifi/react-sortable-hoc';
import { Table, List, Column,  } from 'react-virtualized';
import defaultTableRowRenderer from './tableHelpers';
import classNames from 'classnames';
import range from 'lodash/range';
import random from 'lodash/random';
import ReactDOM from 'react-dom';
import * as rb from 're-bulma';
import moment from 'moment';
import numeral from 'numeral';
/*
 * Important note:
 * To access the ref of a component that has been wrapped with the SortableContainer HOC,
 * you *must* pass in {withRef: true} as the second param. Refs are opt-in.
 */



const LWpropTypes = {
    rows: PropTypes.array,
    className: PropTypes.string,
    itemClass: PropTypes.string,
    width: PropTypes.number,
    height: PropTypes.number,
    onSortStart: PropTypes.func,
    onSortEnd: PropTypes.func,
    shouldCancelStart: PropTypes.func,
    component: PropTypes.func,
    shouldUseDragHandle: PropTypes.bool,
    headers: PropTypes.array,
    handleRowUpdate: PropTypes.func,
    toggleRowKeys: PropTypes.array,
    toggleRowClass: PropTypes.object,
  };
const LWdefaultProps = {
  className: 'list',
  itemClass: 'item',
  width: 400,
  headers: [],
  toggleRowClass: {},
  toggleRowKeys: [],
};

class ListWrapper extends Component {
  constructor(props) {
    super(props);
    this.onSortEnd = this.onSortEnd.bind(this);
    this.shouldCancelStart = this.shouldCancelStart.bind(this);
    this.state = {
      rows: props.rows,
      className: props.className,
      itemClass: props.itemClass,
      width: props.width,
      height: props.itemHeight * (props.rows.length + 1),
      onSortStart: props.onSortStart,
      onSortEnd: props.onSortEnd,
      shouldCancelStart: props.shouldCancelStart,
      component: props.component,
      shouldUseDragHandle: props.shouldUseDragHandle,
      headers: props.headers,
      handleRowUpdate: props.handleRowUpdate,
      isSorting: false,
      toggleRowClass: props.toggleRowClass || '',
      toggleRowKeys: props.toggleRowKeys || [],
    };
  }
  
  onSortStart(){
    const {onSortStart} = this.props;
    this.setState({isSorting: true});

    if (onSortStart) {
      onSortStart(this.refs.component);
    }
  };
  
  onSortEnd({ oldIndex, newIndex }) {
    const {onSortEnd} = this.props;
    const {rows} = this.state;
    let newRows = arrayMove(rows, oldIndex, newIndex);
    this.setState(Object.assign({}, { rows: newRows }, { isSorting: false }), () => {
      this.props.handleRowUpdate(newRows);
    });
    if (onSortEnd) {
      onSortEnd(this.refs.component);
    }
  };
  shouldCancelStart(e){
    const disabledElements = ['input', 'textarea', 'select', 'option', 'button', 'a'];
    const disabledClass = '__ra_rb';
    if (disabledElements.indexOf(e.target.tagName.toLowerCase()) !== -1 || disabledElements.indexOf(e.target.parentNode.tagName.toLowerCase()) !== -1 || e.target.classList.contains(disabledClass) ) {
      return true; // Return true to cancel sorting
    }
  }
  render() {
    const Component = this.props.component;
    let { rows, isSorting, height } = this.state;
    const props = {
      isSorting,
      rows,
      height,
      onSortEnd: this.onSortEnd,
      shouldCancelStart: this.shouldCancelStart,
      onSortStart: this.onSortStart,
      ref: 'component',
      useDragHandle: this.props.shouldUseDragHandle,
    };

    return <Component {...this.props} {...props} />;
  }
}

ListWrapper.propTypes = LWpropTypes;
ListWrapper.defaultProps = LWdefaultProps;

const TWpropTypes = {
  rows: PropTypes.array,
  className: PropTypes.string,
  helperClass: PropTypes.string,
  itemClass: PropTypes.string,
  width: PropTypes.number,
  height: PropTypes.number,
  itemHeight: PropTypes.number,
  onSortEnd: PropTypes.func,
  shouldCancelStart: PropTypes.func,
  headers: PropTypes.array,
  toggleRowKeys: PropTypes.array,
  toggleRowClass: PropTypes.object,
};

class TableWrapper extends Component {
  constructor(props) {
    super(props);
    this.getRenderedComponent = getRenderedComponent.bind(this);
    this.cellRenderer = this.cellRenderer.bind(this);
    this.state = {
      rows: props.rows,
      className: props.className,
      helperClass: props.helperClass,
      itemClass: props.itemClass,
      width: props.width,
      height: props.height,
      itemHeight: props.itemHeight,
      onSortEnd: props.onSortEnd,
      shouldCancelStart: props.shouldCancelStart,
      headers: props.headers,
      toggleRowClass: props.toggleRowClass || {},
      toggleRowKeys: props.toggleRowKeys || [],
    }
  }

  cellRenderer({ cellData, index }) {
    if (typeof cellData === 'string') return String(cellData);
    if (Array.isArray(cellData)) {
      return cellData.map(celldata => this.cellRenderer({ cellData: celldata }))
    }
    if (typeof cellData === 'object') return this.getRenderedComponent(cellData);
  }
  
  render() {
    let {
      className,
      height,
      helperClass,
      itemClass,
      itemHeight,
      rows,
      headers,
      onSortEnd,
      shouldCancelStart,
      width,
      toggleRowKeys,
      toggleRowClass
    } = this.props;
    const SortableTable = SortableContainer(Table, { withRef: true, });
    const SortableRowRenderer = SortableElement(defaultTableRowRenderer);
    let tableheaders = headers.map((header, idx) => (
      <Column content={idx}
        cellRenderer={this.cellRenderer}
        label = {(!Array.isArray(header.label) && typeof header.label === 'object') 
          ? this.getRenderedComponent(header.label) 
          : header.label}
        key={idx}
        dataKey={header.sortid}
        width={width}
        headerStyle={(header.columnProps && header.columnProps.style)? header.columnProps.style : null}/>))
    return (
      <SortableTable
        getContainer={wrappedInstance => ReactDOM.findDOMNode(wrappedInstance.Grid)}
        gridClassName={className}
        headerHeight={itemHeight}
        height={height}
        helperClass={helperClass}
        onSortEnd={onSortEnd}
        shouldCancelStart={shouldCancelStart}
        transitionDuration={0}
        rowClassName={itemClass}
        rowCount={rows.length}
        rowGetter={({index}) => rows[index]}
        rowHeight={itemHeight}
        rowRenderer={props => {
          return <SortableRowRenderer 
            {...props}
            toggleRowKeys={toggleRowKeys} 
            toggleRowClass={toggleRowClass} 
            indexCopy={props.index} 
            headers={this.props.headers}/>
        }}
        width={width}
      > 
      {tableheaders}
      </SortableTable>
    );
  }
}
TableWrapper.propTypes = TWpropTypes;

const DNDTabledefaultProps = {
  itemHeight: 50,
};
class DNDTable extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className={'root'}>
        <ListWrapper
          component={TableWrapper}
          rows={this.props.rows}
          handleRowUpdate={this.props.handleRowUpdate}
          // updateDNDRows={updateRows}
          itemHeight={this.props.itemHeight}
          helperClass={'helper'}
          headers={this.props.headers}
          {...this.props}
        />
      </div>
    );
  }
}

DNDTable.defaultProps = DNDTabledefaultProps;

export default DNDTable;