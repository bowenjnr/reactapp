'use strict';

const capitalize = require('capitalize');
const helpers = require('../helpers');
// // const pluralize = require('pluralize');
// const DICTIONARY = require('../dictionary');
const publishOptions = require('../detail_tabs/publish_options');
// pluralize.addIrregularRule('data', 'datas');

function buildAdvancedDetail(options) {
  const { schemaName, newEntity, } = options;
  let customCardProps = helpers.getCustomSchemaOverrideProperty(Object.assign({ field: 'customCardProps', }, options)) || helpers.getCustomOverrideProperty(Object.assign({ field: 'customCardProps', }, options));
  // let usablePrefix = helpers.getDataPrefix(options.prefix, undefined, schema, label, options);
  let dataRoutePrefix = helpers.getDataRoute(options);

  // let manifestPrefix = helpers.getManifestPathPrefix(options.prefix);
  let top = {
    component: 'ResponsiveForm',
    thisprops: {
      formdata: ['formdata',],
    },
    props: {
      stringyFormData: true,
      marginBottom: 30,
      onSubmit: {
        url: (newEntity) ?
          `${dataRoutePrefix}/?format=json&unflatten=true` : `${dataRoutePrefix}/:id?format=json&unflatten=true`,
        params: (newEntity) ?
          undefined : [
            { 'key': ':id', 'val': '_id', },
          ],
        options: {
          method: (newEntity) ?
            'POST' : 'PUT',
        },
        success: true,
      },
      'hiddenFields': [
        {
          'form_name': '_id',
          'form_val': '_id',
        },
        {
          form_val: '$loki',
          form_name: '$loki',
        },
        {
          form_val: 'meta',
          form_name: 'meta',
        },
      ],
      footergroups: [],
      formgroups: [{
        gridProps: {
          isMultiline: false,
        },
        card: {
          doubleCard: true,
          leftDoubleCardColumn: {
            size: 'isTwoThirds',
          },
          rightDoubleCardColumn: {
            size: 'isOneThird',
          },
          leftCardProps: Object.assign({}, customCardProps, {
            cardTitle: `${ capitalize(schemaName) }`,
          }),
          rightCardProps: Object.assign({}, customCardProps, {
            cardTitle: 'Publish Options',
          }),
        },
        formElements: [{
          formGroupCardLeft: [{
            type: 'code',
            name: 'genericdocjson',
          },],
          formGroupCardRight: [
            publishOptions.id(),
            publishOptions.createdat(),
            publishOptions.updatedat(),
            publishOptions.publishButtons(options),
          ],
        },],
      },],
    },
  };
  // let formElements = top.props.formgroups[0].formElements;
  let result = [
    top,
  ];
  return result;
}

module.exports = buildAdvancedDetail;