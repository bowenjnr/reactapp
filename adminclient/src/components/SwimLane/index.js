import React, { Component, PropTypes, } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import ResponsiveCard from '../ResponsiveCard';
import ResponsiveButton from '../ResponsiveButton';
import { getRenderedComponent, } from '../AppLayoutMap';
import { Dropdown } from 'semantic-ui-react';
import utilities from '../../util';
import qs from 'querystring';
import debounce from 'debounce';
import * as rb from 're-bulma';
import numeral from 'numeral';
import CountUp from 'react-countup';
import { Card, CardHeader, CardHeaderIcon, CardContent, CardHeaderTitle, Image } from 're-bulma';
// import console = require('console');

// a little function to help us with reordering the result
const reorder = (list, startIndex, endIndex) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);

    return result;
};

/**
 * Moves an item from one list to another list.
 */
const move = (prevState, source, destination, droppableSource, droppableDestination) => {
    const sourceClone = Array.from(source);
    const destClone = Array.from(destination);
    const [removed] = sourceClone.splice(droppableSource.index, 1);

    destClone.splice(droppableDestination.index, 0, removed);

    const result = prevState;
    result[droppableSource.droppableId].items = sourceClone;
    result[droppableDestination.droppableId].items = destClone;
    return result;
};

const grid = 8;

const getItemStyle = (isDragging, draggableStyle, styleOptions) => {
    // some basic styles to make the items look a bit nicer
    return Object.assign({
        userSelect: 'none',
        padding: grid * 2,
        margin: `0 0 ${grid}px 0`,
        background: isDragging ? styleOptions.dragBackground : styleOptions.nonDragBackground,
    }, styleOptions, draggableStyle)
};

const getListStyle = (isDraggingOver, styleOptions) => {
    return Object.assign({
        background: isDraggingOver ? styleOptions.dragBackground : styleOptions.nonDragBackground,
        padding: grid,
        width: 250,
        display: 'inline-block',
    }, styleOptions)
};

class SwimLane extends Component {
    constructor(props) {
        super(props);
        this.state = {
            droppableList: this.props.droppableList,
            searchTextInput: '',
            teamMembers: [],
            startCount: [],
            endCount: []
        };
        this.getRenderedComponent = getRenderedComponent.bind(this);
        this.getList = this.getList.bind(this);
        this.searchDebounced = debounce(this.searchFetch, 200);
        this.search = this.search.bind(this);
        this.updateCountState = this.updateCountState.bind(this);
        this.countCurrentListTotals = this.countCurrentListTotals.bind(this);
        this.setChangeClass = this.setChangeClass.bind(this);
        this.onDragEnd = this.onDragEnd.bind(this);
    }

    getList(id) {
        return this.state.droppableList[id].items;
    } 

    componentWillMount() {
        this.setState({
            startCount: this.countCurrentListTotals(),
            endCount: this.countCurrentListTotals()
        })
    }

    onDragEnd(result) {
        const { source, destination } = result;

        // dropped outside the list
        if (!destination) {
            return;
        }
        if (source.droppableId !== destination.droppableId) {
            const token = localStorage.getItem('Admin Panel_jwt_token');
            let fetchUrl = this.props.fetchOptions && this.props.fetchOptions.url ? this.props.fetchOptions.url : '';
            fetchUrl = fetchUrl.includes('?')
                ? `${fetchUrl}&access_token=${token}`
                : `${fetchUrl}?access_token=${token}`;
            if (fetchUrl.indexOf(':id') !== -1) fetchUrl = fetchUrl.replace(/:id/, result.draggableId)
            const fetchOptions = this.props.fetchOptions && this.props.fetchOptions.options ? this.props.fetchOptions.options : {};
            const droppableList = move(
                this.state.droppableList,
                this.getList(source.droppableId),
                this.getList(destination.droppableId),
                source,
                destination
            );
            let body = {};
            body[ 'entity_id' ] = result.draggableId;
            body[ 'source_idx' ] = source.droppableId;
            body[ 'destination_idx' ] = destination.droppableId;
            this.setState({
                droppableList,
                startCount: this.state.endCount,
            }, () => {
                if (fetchUrl) {
                    fetch(fetchUrl, Object.assign(fetchOptions, { body: JSON.stringify(body) }))
                }
                setTimeout(this.updateCountState, 1)
                
            });
        }
    };
    
    countCurrentListTotals() {
        return this.props.droppableList.map(listItem => {
            return listItem.items.reduce(function (a, b) {
                return a + b.amountNum;
            }, 0)
        });
    }

    setChangeClass(idx){
        return (this.state.endCount[idx] > this.state.startCount[idx]) 
            ? 'swimlane_increasing' 
                :(this.state.endCount[idx] < this.state.startCount[idx]) 
                ?'swimlane_decreasing' 
                : '';
    }

    updateCountState() {
        let newEndState = this.countCurrentListTotals();
        this.setState({
            endCount: newEndState,
        })
    }

    search(e) {
        e.preventDefault();
        this.setState({ searchTextInput: e.target.value }, () => {
            this.searchDebounced(this.state.searchTextInput);
        });
    }
    
    searchFetch(queryString) { 
        const searchOptions = this.props.searchOptions;
        const token = localStorage.getItem('Admin Panel_jwt_token');
        let fetchUrl = searchOptions && searchOptions.url ? searchOptions.url : '';
        fetchUrl = `${fetchUrl}&${qs.stringify({
            headerFilters: 'team_members=' + (this.state.teamMembers.join(',') || ''),
            query: queryString,
        })}`;
        let headers = Object.assign({
            'x-access-token': token,
        });
        utilities.fetchComponent(fetchUrl, { headers, })()
            .then(data => {
                this.setState({ droppableList: data.droppableList })
            })
    }

    render() {
        const itemStyle = this.props.itemProps && this.props.itemProps.style ? this.props.itemProps.style : {};
        const imageStyle = this.props.imageStyle ? this.props.imageStyle : {};
        const contextStyle = this.props.contextProps && this.props.contextProps.style ? this.props.contextProps.style : {};
        const droppableListStyle = this.props.droppableListProps && this.props.droppableListProps.style ? this.props.droppableListProps.style : {};
        const droppableProps = this.props.droppableListProps ? this.props.droppableListProps : {};
        const draggableStyle = this.props.draggableProps && this.props.draggableProps.style ? this.props.draggableProps.style : {};
        const contextProps = this.props.contexProps ? this.props.contextProps : {};
        const titleTextStyle = this.props.itemTitleProps && this.props.itemTitleProps.style ? this.props.itemTitleProps.style : {};
        const titleButtonProps = this.props.itemTitleProps && this.props.itemTitleProps.buttonProps ? this.props.itemTitleProps.buttonProps : {};
        const filterOptions = this.props.filterOptions || {};
        const labelProps = filterOptions.labelProps ? filterOptions.labelProps : {};
        const dropdownProps = filterOptions.dropdownProps ? filterOptions.dropdownProps : {};
        const searchProps = this.props.searchOptions ? this.props.searchOptions.searchProps : {};
        let filterOnChange = function (event, newvalue) {
            this.setState({ teamMembers: newvalue.value }, () => {
                this.searchFetch(this.state.searchTextInput);
            });
        };
        filterOnChange = filterOnChange.bind(this);
        
        const droppables = this.state.droppableList.map((listItem, idx) =>
            <Card {...listItem.cardProps.cardProps} isFullwidth>
            <CardHeader style={Object.assign({ cursor:'pointer', }, listItem.cardProps.headerStyle)}>
            <CardHeaderTitle style={listItem.cardProps.headerTitleStyle}>
                {(!listItem.cardProps.cardTitle || typeof listItem.cardProps.cardTitle ==='string')? listItem.cardProps.cardTitle
                : this.getRenderedComponent(listItem.cardProps.cardTitle)}
                    <div {...listItem.headerInfoProps} 
                    className = {
                        `${(listItem.headerInfoProps.className) ? listItem.headerInfoProps.className : ''} ${this.setChangeClass(idx)}`
                    }>{`${listItem.items.length} for $`}
                    <CountUp
                        start={this.state.startCount[idx]}
                        end={this.state.endCount[idx]}
                        // {...countUpProps}
                        useEasing={true}
                        duration={1}
                        separator=","/>
                </div>
            </CardHeaderTitle>
            </CardHeader>
            <CardContent {...listItem.cardProps.cardContentProps}>
                <Droppable {...droppableProps} droppableId={`${idx}`}>
                {(provided, snapshot) => <div
                    ref={provided.innerRef}
                    style={getListStyle(snapshot.isDraggingOver, droppableListStyle)}>
                    {listItem.items.map((item, index) => {
                        return (<Draggable
                            key={`item-${idx}-${index}`}
                            draggableId={item.id}
                            index={index}
                            >
                            {(provided, snapshot) => (
                                <div
                                    ref={provided.innerRef}
                                    {...provided.draggableProps}
                                    {...provided.dragHandleProps}
                                    style={getItemStyle(
                                        snapshot.isDragging,
                                        provided.draggableProps.style,
                                        draggableStyle
                                    )}>
                                    <div style={Object.assign({display:'flex', alignItems: 'center'},)}>
                                        <span style={{position: 'relative'}}>
                                            <span style={Object.assign({
                                                display: 'block',
                                                width: '28px', 
                                                height: '28px', 
                                                borderRadius: '100px', 
                                                background: '#ccc', 
                                                flex:'none', 
                                                backgroundSize: 'cover',
                                                backgroundRepeat: 'no-repeat',
                                                backgroundImage: (item.image) ? `url(${item.image})` : undefined,
                                                marginRight: '15px'
                                                }, imageStyle)}>
                                            </span>
                                            {(item.teamMemberCount && item.teamMemberCount > 1)
                                                ? <span style={{
                                                    position: 'absolute',
                                                    backgroundColor: 'rgb(0, 122, 255)',
                                                    color: 'white',
                                                    fontSize: '10px',
                                                    right: '10px',
                                                    bottom: '-2px',
                                                    lineHeight: '17px',
                                                    height: '17px',
                                                    width: '17px',
                                                    borderRadius: '100%',
                                                    textAlign: 'center',
                                                    fontWeight: 'bold',
                                                    boxShadow: 'rgba(17, 17, 17, 0.2) 0px 0px 0px 1px',
                                                    whiteSpace: 'nowrap',
                                                }}>{`+${item.teamMemberCount-1}`}</span>
                                                : null}
                                        </span>
                                        <ResponsiveButton {...Object.assign({}, this.props, titleButtonProps, { onclickPropObject: item } )} style={Object.assign({border:'none'}, titleTextStyle)}>{item.itemName}</ResponsiveButton>
                                    </div>
                                    <div style={Object.assign({display:'flex',justifyContent: 'space-between'}, itemStyle)}>
                                        <span>{item.amount}</span>
                                        <span>{item.date}</span>
                                    </div>
                                    {(item.footer && !Array.isArray(item.footer) && typeof item.footer === 'object') ? this.getRenderedComponent(item.footer) : null}
                                </div>
                            )}
                        </Draggable>)
                    })}
                    {provided.placeholder}
                    </div>}
                </Droppable>
            </CardContent>
        </Card>)
        return (
            <DragDropContext {...contextProps} onDragEnd={this.onDragEnd}>
                <div style={Object.assign({ display: 'flex' }, contextStyle)}>    
                <rb.Input
                    hasIconRight
                    icon="fa fa-search"
                    {...searchProps}
                    onChange={(data) => this.search(data)}
                    ref={(input) => {
                        this.searchTextInput = input;
                    }}
                />
                {droppables}
                <div className="header_filter_button" >
                    <rb.Label {...labelProps}>{dropdownProps.label}</rb.Label>
                    <Dropdown {...dropdownProps}
                        onChange={filterOnChange}
                    />
                </div>
                </div>
            </DragDropContext>
        );
    }
}

const propTypes = {};

SwimLane.propTypes = propTypes;
SwimLane.defaultProps = {};

export default SwimLane;