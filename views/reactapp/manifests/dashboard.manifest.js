// 'use strict';
// const utilities = require('../../../utilities');
// const reactapp = utilities.reactapp();

// const dbstatsLayout = require('../../../utilities/detail_views/layouts/dbstats.manifest.layout.js');

// module.exports = {
//   containers: {
//     [`${reactapp.manifest_prefix}dashboard`]: {
//       layout: {
//         component: 'div',
//         props: {
//           style: {
//             marginTop: '4.5rem',
//           },
//         },
//         children: [
//           // breadcrumbs(['CRM', 'Customers']),
//           // developertabs('data'),
//           {
//             component: 'Container',
//             // children:'ok',
//             children: dbstatsLayout({}),

//           },
//         ],
//       },
//       'resources': {
//         contentstats: `${reactapp.manifest_prefix}contentdata/standard/dbstats?format=json`,
//       },
//       'onFinish': 'render',
//       'pageData': {
//         'title': 'DBs Dashboard',
//         'navLabel': 'Dashboard',
//       },
//     },
//   },
// };