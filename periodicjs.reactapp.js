'use strict';

module.exports = {
  'periodicjs_ext_reactapp': {
    'manifests': [
      'node_modules/@digifi-los/reactapp/adminclient/src/content/config/manifest.json',
      // 'node_modules/@digifi-los/reactapp/views/reactapp/manifests/',
      // 'node_modules/@digifi-los/reactapp/views/test/',
    ],
    'unauthenticated_manifests': [
      'node_modules/@digifi-los/reactapp/views/public/home/',
    ],
    'navigation': 'node_modules/@digifi-los/reactapp/views/reactapp/components/navigation.manifest.js',
    'components': {
      'main': {
        'footer': 'node_modules/@digifi-los/reactapp/adminclient/src/content/config/footer.js',
      },
      'error': {
        '404': 'node_modules/@digifi-los/reactapp/adminclient/src/content/config/manifests/dynamic404.json',
        '400': 'node_modules/@digifi-los/reactapp/adminclient/src/content/config/manifests/dynamic400.json',
      },
    },
  },
};