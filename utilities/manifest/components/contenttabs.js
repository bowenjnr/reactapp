'use strict';
const pluralize = require('pluralize');
const capitalize = require('capitalize');
const helpers = require('../helpers');

module.exports = function(options) {
  const { adminRoute, schema, schemaName, indexOptions, allSchemas } = options;
  const manifestPrefix = helpers.getManifestPathPrefix(options.adminRoute);
  const ignoreTabs = (options && options.extsettings && options.extsettings.extension_overrides && options.extsettings.extension_overrides.ignoreContentTabs) ?
    options.extsettings.extension_overrides.ignoreContentTabs : [];
  const allSchems = Object.keys(allSchemas);
  // console.log({ allSchems })
  const filteredContentTabs = allSchems.filter(schema => ignoreTabs.indexOf(schema) === -1);
  // console.log({ ignoreTabs,allSchems,filteredContentTabs });
  const tabs = filteredContentTabs.map(key => {
    return {
      label: pluralize(capitalize(key)),
      location: helpers.getContainerPath({ adminRoute, schemaName: key, }),
    };
  });
  // console.log({ tabs });

  function getTabComponent(tab, tabname) {
    return {
      component: 'Tab',
      props: {
        isActive: (tab.label === pluralize(capitalize(tabname))),
        style: {},
      },
      children: [{
        // component: 'ResponsiveLink',
        component: 'ResponsiveButton',
        props: {
          onClick: 'func:this.props.reduxRouter.push',
          onclickProps: `${tab.location}`,
          style: {
            border: 'none',
            fontSize: 14,
          },
        },
        children: tab.label,
      }, ],
    };
  }

  return {
    component: 'div',
    props: {},
    children: [{
      component: 'Container',
      children: [{
        component: 'Tabs',
        props: {
          style: {
            border: 'none',
            fontSize: 14,
          },
        },
        children: [{
          component: 'TabGroup',
          children: tabs.map(tab => {
            return getTabComponent(tab, schemaName);
          }),
        }, ],
      }, ],
    }, ],
  };
};