// 'use strict';
// const utilities = require('../../../utilities');
// const reactapp = utilities.reactapp();

// const dbstatsLayout = require('../../../utilities/detail_views/layouts/dbstats.manifest.layout.js');

// module.exports = {
//   containers: {
//     [`${reactapp.manifest_prefix}settings`]: {
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
//             children: [
//               {
//                 component: 'Title',
//                 children: [
//                   {
//                     component: 'span',
//                     asyncprops: {
//                       children: [
//                         'appsettings','appSettings','name'
//                       ]
//                     },
//                   },
//                   {
//                     component: 'span',
//                     children:' ['
//                   },
//                   {
//                     component: 'span',
//                     asyncprops: {
//                       children: [
//                         'appsettings','appSettings','application','environment'
//                       ]
//                     },
//                   },
//                   {
//                     component: 'span',
//                     children:'] '
//                   },
//                   {
//                     component: 'span',
//                     children:'Settings'
//                   },
//                 ]
//               },
//               {
//                 component: 'div',
//                 props: {
//                   style: {
//                     overflow: 'auto',
//                     backgroundColor: 'white',
//                     border: '1px solid #d3d6db',
//                     borderRadius: 3,
//                     height:'auto',
//                     maxHeight:'30rem',
//                     boxShadow: 'inset 0 1px 2px rgba(17,17,17,.1)',
//                   },
//                 },
//                 children: [
//                   {
//                     component: 'CodeMirror',
//                     asyncprops: {
//                       codeMirrorProps:['appsettings','editorProps']
//                     },
//                   }
//                 ]
//               },
//               {
//                 component: 'Subtitle',
//                 props: {
//                   style: {
//                     padding:'1rem 0'
//                   },
//                 },
//                 children:'Quick help'
//               },
//               {
//                 component: 'code',
//                 props: {
//                   style:utilities.styles.codeSample.code,
//                 },
//                 children: [
//                   {
//                     component: 'em',
//                     props: {
//                       style:utilities.styles.codeSample.codeEm,
//                     },
//                     children:'//example create new application [env(using development as an example)] configuration'
//                   },
//                   {
//                     component:'br'
//                   },
//                   {
//                     component: 'div',
//                     children:'$ periodicjs createConfig application **name-of-my-app** development ~/Desktop/appconfig-development-config.json'
//                   },
//                   {
//                     component:'br'
//                   },
//                   {
//                     component: 'em',
//                     props: {
//                       style:utilities.styles.codeSample.codeEm,
//                     },
//                     children:'//example manually add configuration '
//                   },
//                   {
//                     component:'br'
//                   },
//                   {
//                     component: 'div',
//                     children:'$ periodicjs addConfig ~/Desktop/appconfig-development-config.json '
//                   },
//                   {
//                     component:'br'
//                   }
//                 ]
//               }
//             ]
//             // children:'ok',
//             // children: dbstatsLayout({}),

//           },
//         ],
//       },
//       'resources': {
//         appsettings: `${reactapp.manifest_prefix}contentdata/appsettings?format=json`,
//       },
//       'onFinish': 'render',
//       'pageData': {
//         'title': 'Application Settings',
//         'navLabel': 'Settings',
//       },
//     },
//   },
// };