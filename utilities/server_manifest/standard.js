'use strict';

const capitalize = require('capitalize');

const colors = [
  '#6991AC',
  '#314D5F',
  '#B1DCF8',
  '#98D1F8',
  '#5F4827',
  '#292C44',
  '#18CDCA',
  '#3A86BA',
  '#4DB3F8',
  '#4A6679',
];
const sansSerif = '"Helvetica Neue",Helvetica,Arial,sans-serif';// "#f0f0f0"

function getPageWrapper(options = {}) {
  const { children=' ', } = options;
  //tabs={name,layout}
  return {
    component: 'div',
    children: [
      {
        component: 'Hero',
        props: {
          size: 'isFullheight',
          isBold: true,
          color: 'isWhite',
        },
        children: [
          {
            component: 'HeroBody',
            props: {
              style: {
                marginTop: '2rem',
                marginBottom: '2rem',
                alignItems:'flex-start',
              },
            },
            children: [
              {
                component: 'Container',
                props: {},
                children,
              },
            ],
          },
        ],
      },
    ],
  };
}

function getLayout(options = {}) {
  const { rows, } = options;
  return rows.map(row => ({
    component: 'Columns',
    children: row.map(col => ({
      component: 'Column',
      props: col.columnProps,
      children: (Array.isArray(col))
        ? col
        : [col, ],
    })),
    // children:'ok'
  }));
}

function getAreaChart(options = {}) {
  const { x, y, data, i, stacked, labels, } = options;

  return {
    component: 'victory.VictoryArea',
    props: {
      style: {
        data:(stacked===false)?{ stroke:colors[i%colors.length], }:undefined,
        
        // data: {
        //   stroke: 'black',
        //   strokeWidth: 1,
        //   // strokeLinecap: 'round',
        // },
      },
      data,
      x,
      y,
      // labelComponent:true,
    },
    __dangerouslyEvalProps: {
      labels:labels[y],
    },
  };
}

function getLineChart(options = {}) {
  const { x, y, data, i, stacked, labels, } = options;

  return {
    component: 'victory.VictoryLine',
    props: {
      style: {
        data:(stacked===false)?{ stroke:colors[i%colors.length], }:undefined,
      },
      data,
      x,
      y,
      // labelComponent:true,
    },
    __dangerouslyEvalProps: {
      // labels:'"1"'
      labels:labels[y],
    },
    __dangerouslyInsertComponents: {
      labelComponent: {
        component: 'victory.VictoryTooltip',
        // props: {
        //   active:true
        // }
      },      
    },
  };
}

function getVictoryChart(options = {}) {
  const { chartType, data, charts, padding, props, displayXAxis = true, displayLegend = true, legendProps, stacked = true, labels = {}, externalLegend, } = options;
  const chartTypeLookup = {
    'area': (chartType === 'area')
      ? charts.map((chart, i) => getAreaChart({ data, x: chart.x, y: chart.y, i, stacked, labels, }))
      : null,
    'line': (chartType === 'line')
      ? charts.map((chart, i) => getLineChart({ data, x: chart.x, y: chart.y, i, stacked, labels, }))
      : null,
  };
  
  return {
    component: 'div',
    props: {
      style: {
        display:'flex',
      },
    },
    children: [
      {
        component: 'victory.VictoryChart',
        props: Object.assign({
          domainPadding: padding || 20,
          style: {
            fontFamily: sansSerif,
            flex:1,
          },
        }, props),
        children: [
          (displayXAxis) ? {
            component: 'victory.VictoryAxis',
            props: {
              tickValues: (displayXAxis)
            ? data.map(datum => datum.date)
            : undefined,
              label: options.xAxisTitle,
            },
          } : null,
          {
            component: 'victory.VictoryAxis',
            props: {
              dependentAxis: true,
              label: options.yAxisTitle,
            },
          },
          (displayLegend)
            ? {
              component: 'victory.VictoryLegend',
              props: Object.assign({
                title: options.legendTitle,
                centerTitle: true,
                colorScale: colors,
                // gutter:20,
                orientation: 'horizontal',
                style:{ border: { stroke: 'black', }, title: { fontSize: 20, fontFamily:sansSerif, }, },
                data: charts.map(chart => ({ name: chart.y, })),
              }, legendProps),
            }
            : null,
          (stacked)
        ? {
          component: 'victory.VictoryStack',
          props: {
            colorScale: colors,
            style: {
              fontFamily:sansSerif,
            },
          },
          children: chartTypeLookup[ chartType ] || null,
        }
      : null,
        ].concat((stacked===false)?chartTypeLookup[ chartType ]:[]),
      },
      (externalLegend)?{
        component: 'div',
        children: [
          {
            component: 'victory.VictoryLegend',
            props: Object.assign({
              title: options.legendTitle,
              centerTitle: true,
              colorScale: colors,
              standalone:true,
              // gutter:20,
              orientation: 'vertical',
              style:{ border: { stroke: 'black', }, title: { fontSize: 20, fontFamily:sansSerif, }, },
              data: charts.map(chart => ({ name: chart.y, })),
            }, legendProps),
            __dangerouslyInsertComponents: {
              containerComponent: {
                component: 'victory.VictoryContainer',
                props: {
                  responsive:false,
                },
              },      
            },
          },
        ],
      }:null,
    ],
  };
}

function getRechart(options = {}) {
  const { data, charts, minHeight = 300, props, chartType, includeScale, xAxis = true, yAxis = true, legend = true, children = [], tooltipProps = {}, tooltip = true, tooltipEvalProps = {}, containerProps = {}, ignoreReduxProps = true, legendProps = {},} = options;
  const chartComponents = (Array.isArray(charts))
    ? charts.map((chart, i) => ({
      component: `recharts.${capitalize(chart.type)}`,
      props: Object.assign({
        dataKey: chart.dataKey,
        fill: (chart.fill || chart.fillColor) ? chart.fillColor || colors[ i % colors.length ] : undefined,
        stroke: (chart.stroke || chart.strokeColor || chart.type==='line') ? chart.strokeColor || colors[ i % colors.length ] : undefined,
      }, chart.props),
    }))
    : [];
  const rechartType = chartType ||
    (Array.isArray(charts) && charts.length === 1)
    ? charts[ 0 ].type
    : (Array.isArray(charts) && charts.length > 1 && charts.filter(chart=>chart.type!==charts[0].type).length===0)
      ? charts[0].type
      : 'composed';
  // const util = require('util');
  // console.log(util.inspect(chartComponents, {depth:20}),{  rechartType });

  return {
    component: 'recharts.ResponsiveContainer',
    ignoreReduxProps,
    props: Object.assign({
      minHeight,
    },containerProps),
    __dangerouslyInsertComponents: {
      _children: {
        component: `recharts.${capitalize(rechartType)}Chart`,
        props: Object.assign({
          data,
        }, props),
        children: chartComponents.concat([
          (legend)?{
            component: 'recharts.Legend',
            props:Object.assign( {
              align: 'right',
            },legendProps),
          }:null,
          (xAxis)
            ?  {
              component: 'recharts.XAxis',
              props: Object.assign({
                dataKey: 'date',
              }, xAxis.props),
              children: [{
                component: 'recharts.Label',
                props: Object.assign( {
                  // value: 'Sales $',
                  position: 'insideBottom',
                },xAxis.labelProps),
              }, ],
            }
            : null,
          (yAxis)
            ?  {
              component: 'recharts.YAxis',
              props: Object.assign({
              }, yAxis.props),
              
              __dangerouslyEvalProps: Object.assign({
                tickFormatter: '(tick)=> window.__reactapp.__ra_helpers.numeral(tick).format("0.0a")',
              }, yAxis.evalProps),
              children: [{
                component: 'recharts.Label',
                props: Object.assign( {
                  // value: 'Sales $',
                  position: 'insideLeft',
                  angle: -90,
                },yAxis.labelProps),
              }, ],
            }
            : null,
          (tooltip)?{
            component: 'recharts.Tooltip',
            props: Object.assign({
              // dataKey:'actual',
            },tooltipProps),
            __dangerouslyEvalProps: Object.assign({
              formatter: '(tick)=> window.__reactapp.__ra_helpers.numeral(tick).format("$0,0.00")',
            },tooltipEvalProps),
          }:null,
          (includeScale)
            ? {
              component:'recharts.Brush',
            }
            : null,
          
        ]).concat(children),
      },
    },
  };
}

function getLevel(options = {}) {
  const { levelProps, itemProps = { hasTextCentered:true, }, labelProps, valueProps, items=[], } = options;
  return {
    component: 'Level',
    props: levelProps,
    children: items.map(item => ({
      component: 'LevelItem',
      props: itemProps,
      children: [
        {
          component: 'Heading',
          props: labelProps,
          children: item.label,
        },
        {
          component: 'Title',
          props: Object.assign({}, valueProps, item.valueProps),
          children: item.value,
        },
      ],
    })),
  };
}

module.exports = {
  getPageWrapper,
  getLayout,
  getAreaChart,
  getVictoryChart,
  getLineChart,
  getRechart,
  getLevel,
};