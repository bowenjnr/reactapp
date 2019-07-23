import React from 'react';
import type {RowRendererParams} from 'react-virtualized';

export default function defaultRowRenderer({
  headers,
  columns,
  className,
  indexCopy,
  key,
  onRowClick,
  onRowDoubleClick,
  onRowMouseOut,
  onRowMouseOver,
  onRowRightClick,
  rowData,
  style,
  toggleRowKeys,
  toggleRowClass,
}: RowRendererParams) {
  const a11yProps = {};

  if (
    onRowClick ||
    onRowDoubleClick ||
    onRowMouseOut ||
    onRowMouseOver ||
    onRowRightClick
  ) {
    a11yProps['aria-label'] = 'row';
    a11yProps.tabIndex = 0;

    if (onRowClick) {
      a11yProps.onClick = event => onRowClick({event, indexCopy, rowData});
    }
    if (onRowDoubleClick) {
      a11yProps.onDoubleClick = event =>
        onRowDoubleClick({event, indexCopy, rowData});
    }
    if (onRowMouseOut) {
      a11yProps.onMouseOut = event => onRowMouseOut({event, indexCopy, rowData});
    }
    if (onRowMouseOver) {
      a11yProps.onMouseOver = event => onRowMouseOver({event, indexCopy, rowData});
    }
    if (onRowRightClick) {
      a11yProps.onContextMenu = event =>
        onRowRightClick({event, indexCopy, rowData});
    }
  }

let rowToggleClass = '';

let columnData = columns.map((column, colIdx) => {
      return (
        <div {...column.props} key={`Row${indexCopy}-Col${colIdx}`}
          {...(headers[colIdx]) ? headers[colIdx].columnProps : {} }></div>
      )
  })
  
  toggleRowKeys.map(key => {
    if (rowData.hasOwnProperty(key) && toggleRowClass[key] && typeof toggleRowClass[key][rowData[key]] === "string" ) {
      rowToggleClass =  rowToggleClass + ' ' + toggleRowClass[key][rowData[key]];
    }
  })

  return (
    <div
      {...a11yProps}
      className={className + rowToggleClass }
      key={indexCopy}
      role="row"
      style={style}
      >
      {columnData}
    </div>
  );
}