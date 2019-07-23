'use strict';

function getTabs(options) {
  const { tabs = [], type, props, componentProps = {}, bindprops,  } = options;
  //tabs={name,layout}
  return Object.assign({
    component: 'ResponsiveTabs',
    bindprops,
    props: Object.assign({
      isButton: false,
      tabContainer: {
        className:'__rep_tab',
      },
      tabsProps: {
        tabStyle:'isBoxed',
      },
      tabsType: type || 'navBar',
      tabs,
    }, props),
  }, componentProps);
}

module.exports = {
  getTabs,
};