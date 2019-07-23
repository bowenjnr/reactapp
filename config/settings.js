'use strict';
const periodic = require('periodicjs');
// const index_data_tables = require('../utilities/index_data_tables.js');
// console.log({ index_data_tables })
module.exports = {
  settings: {
    encryption_key_path: periodic.settings.application.server.https.ssl.private_key,
    'server_side_react': true,
    'hot_reload': true,
    'custom_css_stylesheet': false,
    'basename': 'http://localhost:8786',
    'default_user_image': '/favicon.png',
    'skip_catch_all_route': false,
    'adminPath': '/r-admin',
    'name': 'Admin Panel',
    'title': 'Admin Panel',
    include_index_route: true,
    'includeCoreData': {
      'manifest': true,
      'navigation': true,
    },
    'navigationLayout': {
      'wrapper': {
        'style': {},
      },
      'container': {
        'style': {},
      },
    },
    'routerHistory': 'browserHistory',
    'application': {
      'environment': 'development',
      'use_offline_cache': false,
    },
    'ui': {
      'initialization': {
        'show_header': false,
        'show_footer': false,
        'show_sidebar_overlay': true,
        'refresh_manifests': false,
        'refresh_navigation': false,
        'refresh_components': false,
      },
      'notifications': {
        'error_timeout': 10000,
        'timed_timeout': 10000,
        'hide_login_notification': false,
        'supressResourceErrors': false,
      },
      'fixedSidebar': true,
      'sidebarBG': '#ffffff',
      'header': {
        'isBold': false,
        'color': 'isBlack',
        'buttonColor': 'isWhite',
        'useGlobalSearch': false,
        'useHeaderLogout': false,
        'productHeader': {
          'layout': false,
          'productLinks': []
        },
        'customButton': {},
        'navLabelStyle': {},
        'containerStyle': {},
        'userNameStyle': {},
      },
      'footer': {
        'navStyle': {},
      },
      'sidebar': {
        'containerStyle': {},
        'use_floating_nav': false,
      },
    },
    'login': {
      'url': 'http://localhost:8786/api/jwt/token',
      'options': {
        'method': 'POST',
        'headers': {
          'Accept': 'application/json',
          'clientid': 'CLIENT**ID**NEEDED',
          'entitytype': 'account',
        },
      },
    },
    'userprofile': {
      'url': 'http://localhost:8786/api/jwt/profile',
      'options': {
        'method': 'POST',
        'headers': {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'clientid': 'CLIENT**ID**NEEDED',
          'entitytype': 'account',
        },
      },
    },
    data_tables: {
      // standard: index_data_tables,
      /*
        standard_user:{
      custom header
        }
      */
    },
    auth: {
      logged_in_homepage: '/r-admin/dashboard',
      logged_out_path: '/r-admin/auth/account/login',
    },
    default_manifests: {
      include_core_data:true,
      include_settings: true,
    },
    default_navigation: {
      include_settings: true,
      // include_
    },
    extension_overrides: {
      // customDataPrefix
      // customDataRoute
      customCardProps: {
        // leftIcon: true, // you can set global overrides
        standard_account: {
          // leftIcon: true, // or overrides by core data
        },
      },
      // customFormgroups
      // ignoreEntityFields
      customIndexTableProps: {
        standard_asset: {
          flattenRowDataOptions: {
            maxDepth: 2,
          },
        },
      },
      // customIndexTableAsyncpropsRows
      // customIndexTableAsyncpropsNumItems
      // customIndexTableAsyncpropsNumPages
      // customIndexTableDatamapRows
      // customIndexTableDatamapNumItems
      // customIndexTableDatamapNumPages
      // customIndexPageData
      // customIndexTabs
      // customIndexHeader
      customIndexButton: {
        standard_asset: {
          onClick: 'func:this.props.createModal',
          onclickProps: {
            title: 'Upload new assets',
            pathname: '/r-admin/standard_assets/newmodal',
          },
        },
      },
      // customDetailPageData
      // customDetailTabs
      // customDetailHeader
      // customDetailEditor
      // customEntitytypeElements
      // customIndexPageComponents
      // customDetailPageComponents
    },      
  },
  databases: {},
};