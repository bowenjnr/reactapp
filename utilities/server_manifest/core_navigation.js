'use strict';

function getSidebarNav(options) {
  const { title, links, } = options;
  return {
    component: 'ResponsiveCard',
    props: {
      cardTitle: title,
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
    children: links.map(link => ({
      component: 'MenuAppLink',
      props: {
        href: link.href,
        label: link.label,
        id: link.id,
      },
    })),
  };
}

module.exports = {
  getSidebarNav,
};