'use strict';
const periodic = require('periodicjs');
const utilities = require('../../../utilities');
const helpers = require('../../../utilities/manifest/helpers');
const capitalize = require('capitalize');
const pluralize = require('pluralize');
const reactapp = utilities.reactapp();
const extsettings = periodic.settings.extensions['@digifi-los/reactapp'];
// console.log({ extsettings });
// console.log('reactapp.manifest_prefix', reactapp.manifest_prefix)
let navlinks = [{
  component: 'MenuAppLink',
  props: {
    href: `${reactapp.manifest_prefix}data/configurations`,
    label: 'Configurations',
    id: 'system-configurations',
  },
},
{
  component: 'MenuAppLink',
  props: {
    href: `${reactapp.manifest_prefix}dashboard`,
    label: 'Dashboard',
    id: 'system-dashboard',
  },
},
{
  component: 'MenuAppLink',
  props: {
    href: `${reactapp.manifest_prefix}data/extensions`,
    label: 'Extensions',
    id: 'system-extensions',
  },
},
  // {
  //   component: 'MenuAppLink',
  //   props: {
  //     href: `${reactapp.manifest_prefix}files`,
  //     label: 'Files',
  //     id: 'system-files',
  //   },
  // },
{
  component: 'MenuAppLink',
  props: {
    href: `${reactapp.manifest_prefix}settings`,
    label: 'Settings',
    id: 'system-settings',
  },
},
{
  component: 'MenuAppLink',
  props: {
    // href: '/#logout',
    label: 'Logout',
    'onClick': 'func:this.props.logoutUser',
  },
},
];
// console.log('periodic.app.locals.core_data_list', periodic.app.locals.core_data_list);
const datalinks = Object.keys(periodic.app.locals.core_data_list).map(db_name => ({
  component: 'ResponsiveCard',
  props: {
    cardTitle: `${capitalize(db_name)} DB`,
    display: false,
    icon: 'fa fa-angle-right',
    cardStyle: {
      boxShadow: 'none',
    },
    headerStyle: {
      boxShadow: 'none',
      alignSelf: 'center',
      alignItems: 'center',
      minHeight: 'auto',
    },
  },
  children: periodic.app.locals.core_data_list[db_name].map(model => ({
    component: 'MenuAppLink',
    props: {
      href: helpers.getContainerPath({ schemaName: `${db_name}_${model}`, adminRoute: reactapp.manifest_prefix, }),
      label: pluralize(capitalize(model)),
      id: `data-${db_name}-${model}`,
    },
  })),
}));

let ra_nav = [{
  component: 'MenuLabel', //SubMenuLinks',
    // children: [{
    //   component: 'MenuLabel',
    //   'children': 'reactapp',
    // }, ].concat(...navlinks),
  children: 'System',
},
{
  component: 'MenuList',
  children: [].concat(...navlinks),
},
];
if (extsettings.includeCoreData.navigation) {
  ra_nav.push(...[{
    component: 'MenuLabel', //SubMenuLinks',
      // children: [{
      //   component: 'MenuLabel',
      //   'children': 'reactapp',
      // }, ].concat(...navlinks),
    children: 'Data',
  },
  {
    component: 'MenuList',
    children: [].concat(...datalinks),
  },
  ]);
}
module.exports = {
  'wrapper': {
    'style': {},
  },
  'container': {
    'style': {},
  },
  'layout': {
    component: 'Menu',
    props: {
      'style': {
        'paddingBottom': 70,
        'width': '10rem',
      },
    },
    'children': ra_nav,
  },
};