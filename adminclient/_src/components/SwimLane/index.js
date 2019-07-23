'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _typeof2 = require('babel-runtime/helpers/typeof');

var _typeof3 = _interopRequireDefault(_typeof2);

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _stringify = require('babel-runtime/core-js/json/stringify');

var _stringify2 = _interopRequireDefault(_stringify);

var _getPrototypeOf = require('babel-runtime/core-js/object/get-prototype-of');

var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _assign = require('babel-runtime/core-js/object/assign');

var _assign2 = _interopRequireDefault(_assign);

var _slicedToArray2 = require('babel-runtime/helpers/slicedToArray');

var _slicedToArray3 = _interopRequireDefault(_slicedToArray2);

var _from = require('babel-runtime/core-js/array/from');

var _from2 = _interopRequireDefault(_from);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactBeautifulDnd = require('react-beautiful-dnd');

var _ResponsiveCard = require('../ResponsiveCard');

var _ResponsiveCard2 = _interopRequireDefault(_ResponsiveCard);

var _ResponsiveButton = require('../ResponsiveButton');

var _ResponsiveButton2 = _interopRequireDefault(_ResponsiveButton);

var _AppLayoutMap = require('../AppLayoutMap');

var _semanticUiReact = require('semantic-ui-react');

var _util = require('../../util');

var _util2 = _interopRequireDefault(_util);

var _querystring = require('querystring');

var _querystring2 = _interopRequireDefault(_querystring);

var _debounce = require('debounce');

var _debounce2 = _interopRequireDefault(_debounce);

var _reBulma = require('re-bulma');

var rb = _interopRequireWildcard(_reBulma);

var _numeral = require('numeral');

var _numeral2 = _interopRequireDefault(_numeral);

var _reactCountup = require('react-countup');

var _reactCountup2 = _interopRequireDefault(_reactCountup);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// import console = require('console');

// a little function to help us with reordering the result
var reorder = function reorder(list, startIndex, endIndex) {
    var result = (0, _from2.default)(list);

    var _result$splice = result.splice(startIndex, 1),
        _result$splice2 = (0, _slicedToArray3.default)(_result$splice, 1),
        removed = _result$splice2[0];

    result.splice(endIndex, 0, removed);

    return result;
};

/**
 * Moves an item from one list to another list.
 */
var move = function move(prevState, source, destination, droppableSource, droppableDestination) {
    var sourceClone = (0, _from2.default)(source);
    var destClone = (0, _from2.default)(destination);

    var _sourceClone$splice = sourceClone.splice(droppableSource.index, 1),
        _sourceClone$splice2 = (0, _slicedToArray3.default)(_sourceClone$splice, 1),
        removed = _sourceClone$splice2[0];

    destClone.splice(droppableDestination.index, 0, removed);

    var result = prevState;
    result[droppableSource.droppableId].items = sourceClone;
    result[droppableDestination.droppableId].items = destClone;
    return result;
};

var grid = 8;

var getItemStyle = function getItemStyle(isDragging, draggableStyle, styleOptions) {
    // some basic styles to make the items look a bit nicer
    return (0, _assign2.default)({
        userSelect: 'none',
        padding: grid * 2,
        margin: '0 0 ' + grid + 'px 0',
        background: isDragging ? styleOptions.dragBackground : styleOptions.nonDragBackground
    }, styleOptions, draggableStyle);
};

var getListStyle = function getListStyle(isDraggingOver, styleOptions) {
    return (0, _assign2.default)({
        background: isDraggingOver ? styleOptions.dragBackground : styleOptions.nonDragBackground,
        padding: grid,
        width: 250,
        display: 'inline-block'
    }, styleOptions);
};

var SwimLane = function (_Component) {
    (0, _inherits3.default)(SwimLane, _Component);

    function SwimLane(props) {
        (0, _classCallCheck3.default)(this, SwimLane);

        var _this = (0, _possibleConstructorReturn3.default)(this, (SwimLane.__proto__ || (0, _getPrototypeOf2.default)(SwimLane)).call(this, props));

        _this.state = {
            droppableList: _this.props.droppableList,
            searchTextInput: '',
            teamMembers: [],
            startCount: [],
            endCount: []
        };
        _this.getRenderedComponent = _AppLayoutMap.getRenderedComponent.bind(_this);
        _this.getList = _this.getList.bind(_this);
        _this.searchDebounced = (0, _debounce2.default)(_this.searchFetch, 200);
        _this.search = _this.search.bind(_this);
        _this.updateCountState = _this.updateCountState.bind(_this);
        _this.countCurrentListTotals = _this.countCurrentListTotals.bind(_this);
        _this.setChangeClass = _this.setChangeClass.bind(_this);
        _this.onDragEnd = _this.onDragEnd.bind(_this);
        return _this;
    }

    (0, _createClass3.default)(SwimLane, [{
        key: 'getList',
        value: function getList(id) {
            return this.state.droppableList[id].items;
        }
    }, {
        key: 'componentWillMount',
        value: function componentWillMount() {
            this.setState({
                startCount: this.countCurrentListTotals(),
                endCount: this.countCurrentListTotals()
            });
        }
    }, {
        key: 'onDragEnd',
        value: function onDragEnd(result) {
            var _this2 = this;

            var source = result.source,
                destination = result.destination;

            // dropped outside the list

            if (!destination) {
                return;
            }
            if (source.droppableId !== destination.droppableId) {
                var token = localStorage.getItem('Admin Panel_jwt_token');
                var fetchUrl = this.props.fetchOptions && this.props.fetchOptions.url ? this.props.fetchOptions.url : '';
                fetchUrl = fetchUrl.includes('?') ? fetchUrl + '&access_token=' + token : fetchUrl + '?access_token=' + token;
                if (fetchUrl.indexOf(':id') !== -1) fetchUrl = fetchUrl.replace(/:id/, result.draggableId);
                var fetchOptions = this.props.fetchOptions && this.props.fetchOptions.options ? this.props.fetchOptions.options : {};
                var droppableList = move(this.state.droppableList, this.getList(source.droppableId), this.getList(destination.droppableId), source, destination);
                var body = {};
                body['entity_id'] = result.draggableId;
                body['source_idx'] = source.droppableId;
                body['destination_idx'] = destination.droppableId;
                this.setState({
                    droppableList: droppableList,
                    startCount: this.state.endCount
                }, function () {
                    if (fetchUrl) {
                        fetch(fetchUrl, (0, _assign2.default)(fetchOptions, { body: (0, _stringify2.default)(body) }));
                    }
                    setTimeout(_this2.updateCountState, 1);
                });
            }
        }
    }, {
        key: 'countCurrentListTotals',
        value: function countCurrentListTotals() {
            return this.props.droppableList.map(function (listItem) {
                return listItem.items.reduce(function (a, b) {
                    return a + b.amountNum;
                }, 0);
            });
        }
    }, {
        key: 'setChangeClass',
        value: function setChangeClass(idx) {
            return this.state.endCount[idx] > this.state.startCount[idx] ? 'swimlane_increasing' : this.state.endCount[idx] < this.state.startCount[idx] ? 'swimlane_decreasing' : '';
        }
    }, {
        key: 'updateCountState',
        value: function updateCountState() {
            var newEndState = this.countCurrentListTotals();
            this.setState({
                endCount: newEndState
            });
        }
    }, {
        key: 'search',
        value: function search(e) {
            var _this3 = this;

            e.preventDefault();
            this.setState({ searchTextInput: e.target.value }, function () {
                _this3.searchDebounced(_this3.state.searchTextInput);
            });
        }
    }, {
        key: 'searchFetch',
        value: function searchFetch(queryString) {
            var _this4 = this;

            var searchOptions = this.props.searchOptions;
            var token = localStorage.getItem('Admin Panel_jwt_token');
            var fetchUrl = searchOptions && searchOptions.url ? searchOptions.url : '';
            fetchUrl = fetchUrl + '&' + _querystring2.default.stringify({
                headerFilters: 'team_members=' + (this.state.teamMembers.join(',') || ''),
                query: queryString
            });
            var headers = (0, _assign2.default)({
                'x-access-token': token
            });
            _util2.default.fetchComponent(fetchUrl, { headers: headers })().then(function (data) {
                _this4.setState({ droppableList: data.droppableList });
            });
        }
    }, {
        key: 'render',
        value: function render() {
            var _this6 = this;

            var itemStyle = this.props.itemProps && this.props.itemProps.style ? this.props.itemProps.style : {};
            var imageStyle = this.props.imageStyle ? this.props.imageStyle : {};
            var contextStyle = this.props.contextProps && this.props.contextProps.style ? this.props.contextProps.style : {};
            var droppableListStyle = this.props.droppableListProps && this.props.droppableListProps.style ? this.props.droppableListProps.style : {};
            var droppableProps = this.props.droppableListProps ? this.props.droppableListProps : {};
            var draggableStyle = this.props.draggableProps && this.props.draggableProps.style ? this.props.draggableProps.style : {};
            var contextProps = this.props.contexProps ? this.props.contextProps : {};
            var titleTextStyle = this.props.itemTitleProps && this.props.itemTitleProps.style ? this.props.itemTitleProps.style : {};
            var titleButtonProps = this.props.itemTitleProps && this.props.itemTitleProps.buttonProps ? this.props.itemTitleProps.buttonProps : {};
            var filterOptions = this.props.filterOptions || {};
            var labelProps = filterOptions.labelProps ? filterOptions.labelProps : {};
            var dropdownProps = filterOptions.dropdownProps ? filterOptions.dropdownProps : {};
            var searchProps = this.props.searchOptions ? this.props.searchOptions.searchProps : {};
            var filterOnChange = function filterOnChange(event, newvalue) {
                var _this5 = this;

                this.setState({ teamMembers: newvalue.value }, function () {
                    _this5.searchFetch(_this5.state.searchTextInput);
                });
            };
            filterOnChange = filterOnChange.bind(this);

            var droppables = this.state.droppableList.map(function (listItem, idx) {
                return _react2.default.createElement(
                    _reBulma.Card,
                    (0, _extends3.default)({}, listItem.cardProps.cardProps, { isFullwidth: true }),
                    _react2.default.createElement(
                        _reBulma.CardHeader,
                        { style: (0, _assign2.default)({ cursor: 'pointer' }, listItem.cardProps.headerStyle) },
                        _react2.default.createElement(
                            _reBulma.CardHeaderTitle,
                            { style: listItem.cardProps.headerTitleStyle },
                            !listItem.cardProps.cardTitle || typeof listItem.cardProps.cardTitle === 'string' ? listItem.cardProps.cardTitle : _this6.getRenderedComponent(listItem.cardProps.cardTitle),
                            _react2.default.createElement(
                                'div',
                                (0, _extends3.default)({}, listItem.headerInfoProps, {
                                    className: (listItem.headerInfoProps.className ? listItem.headerInfoProps.className : '') + ' ' + _this6.setChangeClass(idx) }),
                                listItem.items.length + ' for $',
                                _react2.default.createElement(_reactCountup2.default, {
                                    start: _this6.state.startCount[idx],
                                    end: _this6.state.endCount[idx]
                                    // {...countUpProps}
                                    , useEasing: true,
                                    duration: 1,
                                    separator: ',' })
                            )
                        )
                    ),
                    _react2.default.createElement(
                        _reBulma.CardContent,
                        listItem.cardProps.cardContentProps,
                        _react2.default.createElement(
                            _reactBeautifulDnd.Droppable,
                            (0, _extends3.default)({}, droppableProps, { droppableId: '' + idx }),
                            function (provided, snapshot) {
                                return _react2.default.createElement(
                                    'div',
                                    {
                                        ref: provided.innerRef,
                                        style: getListStyle(snapshot.isDraggingOver, droppableListStyle) },
                                    listItem.items.map(function (item, index) {
                                        return _react2.default.createElement(
                                            _reactBeautifulDnd.Draggable,
                                            {
                                                key: 'item-' + idx + '-' + index,
                                                draggableId: item.id,
                                                index: index
                                            },
                                            function (provided, snapshot) {
                                                return _react2.default.createElement(
                                                    'div',
                                                    (0, _extends3.default)({
                                                        ref: provided.innerRef
                                                    }, provided.draggableProps, provided.dragHandleProps, {
                                                        style: getItemStyle(snapshot.isDragging, provided.draggableProps.style, draggableStyle) }),
                                                    _react2.default.createElement(
                                                        'div',
                                                        { style: (0, _assign2.default)({ display: 'flex', alignItems: 'center' }) },
                                                        _react2.default.createElement(
                                                            'span',
                                                            { style: { position: 'relative' } },
                                                            _react2.default.createElement('span', { style: (0, _assign2.default)({
                                                                    display: 'block',
                                                                    width: '28px',
                                                                    height: '28px',
                                                                    borderRadius: '100px',
                                                                    background: '#ccc',
                                                                    flex: 'none',
                                                                    backgroundSize: 'cover',
                                                                    backgroundRepeat: 'no-repeat',
                                                                    backgroundImage: item.image ? 'url(' + item.image + ')' : undefined,
                                                                    marginRight: '15px'
                                                                }, imageStyle) }),
                                                            item.teamMemberCount && item.teamMemberCount > 1 ? _react2.default.createElement(
                                                                'span',
                                                                { style: {
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
                                                                        whiteSpace: 'nowrap'
                                                                    } },
                                                                '+' + (item.teamMemberCount - 1)
                                                            ) : null
                                                        ),
                                                        _react2.default.createElement(
                                                            _ResponsiveButton2.default,
                                                            (0, _extends3.default)({}, (0, _assign2.default)({}, _this6.props, titleButtonProps, { onclickPropObject: item }), { style: (0, _assign2.default)({ border: 'none' }, titleTextStyle) }),
                                                            item.itemName
                                                        )
                                                    ),
                                                    _react2.default.createElement(
                                                        'div',
                                                        { style: (0, _assign2.default)({ display: 'flex', justifyContent: 'space-between' }, itemStyle) },
                                                        _react2.default.createElement(
                                                            'span',
                                                            null,
                                                            item.amount
                                                        ),
                                                        _react2.default.createElement(
                                                            'span',
                                                            null,
                                                            item.date
                                                        )
                                                    ),
                                                    item.footer && !Array.isArray(item.footer) && (0, _typeof3.default)(item.footer) === 'object' ? _this6.getRenderedComponent(item.footer) : null
                                                );
                                            }
                                        );
                                    }),
                                    provided.placeholder
                                );
                            }
                        )
                    )
                );
            });
            return _react2.default.createElement(
                _reactBeautifulDnd.DragDropContext,
                (0, _extends3.default)({}, contextProps, { onDragEnd: this.onDragEnd }),
                _react2.default.createElement(
                    'div',
                    { style: (0, _assign2.default)({ display: 'flex' }, contextStyle) },
                    _react2.default.createElement(rb.Input, (0, _extends3.default)({
                        hasIconRight: true,
                        icon: 'fa fa-search'
                    }, searchProps, {
                        onChange: function onChange(data) {
                            return _this6.search(data);
                        },
                        ref: function ref(input) {
                            _this6.searchTextInput = input;
                        }
                    })),
                    droppables,
                    _react2.default.createElement(
                        'div',
                        { className: 'header_filter_button' },
                        _react2.default.createElement(
                            rb.Label,
                            labelProps,
                            dropdownProps.label
                        ),
                        _react2.default.createElement(_semanticUiReact.Dropdown, (0, _extends3.default)({}, dropdownProps, {
                            onChange: filterOnChange
                        }))
                    )
                )
            );
        }
    }]);
    return SwimLane;
}(_react.Component);

var propTypes = {};

SwimLane.propTypes = propTypes;
SwimLane.defaultProps = {};

exports.default = SwimLane;