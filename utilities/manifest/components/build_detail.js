'use strict';

const flatten = require('flat');
const capitalize = require('capitalize');
const helpers = require('../helpers');
const pluralize = require('pluralize');
const DICTIONARY = require('../schema/dictionary');
const autoFormElements = require('../detail_tabs/auto_form_elements');
const publishOptions = require('../detail_tabs/publish_options');
// pluralize.addIrregularRule('data', 'datas');

const buildDetail = function(options) {
  const { schema, schemaName, newEntity } = options;
    // if (schemaName === 'sor_applicantdata') {
    //   console.log({ schemaName, schema, });
    // }
  let customCardProps = helpers.getCustomSchemaOverrideProperty(Object.assign({ field: 'customCardProps', }, options)) || helpers.getCustomOverrideProperty(Object.assign({ field: 'customCardProps', }, options));
  let customFormGroups = helpers.getCustomSchemaOverrideProperty(Object.assign({ field: 'customFormgroups', }, options)) || helpers.getCustomOverrideProperty(Object.assign({ field: 'customFormgroups', }, options));
  let customIgnoreFields = helpers.getCustomSchemaOverrideProperty(Object.assign({ field: 'ignoreEntityFields', }, options)) || helpers.getCustomOverrideProperty(Object.assign({ field: 'ignoreEntityFields', }, options)) || [];
  let elems = [];
  // let usablePrefix = helpers.getDataPrefix(options.prefix);
  // let usablePrefix = helpers.getDataPrefix(options.prefix, undefined, schema, label, options);

  let manifestPrefix = helpers.getManifestPathPrefix(options.prefix);
  let dataRoutePrefix = helpers.getDataRoute(options);
  let schemaNameIndex = helpers.getContainerPath(options);
  let top = {
    component: 'ResponsiveForm',
    asyncprops: {
      // formdata2: [helpers.getDetailLabel(label), label, ],
    },
    props: {
      onSubmit: {
        url: (newEntity) ?
          `${dataRoutePrefix}?format=json` : `${dataRoutePrefix}/:id?format=json&unflatten=true`,
        params: (newEntity) ? undefined : [
          { 'key': ':id', 'val': '_id', },
        ],
        options: {
          method: (newEntity) ? 'POST' : 'PUT',
        },
        success: true,
        successCallback: (newEntity) ? 'func:this.props.reduxRouter.push' : undefined,
        successProps: (newEntity) ? `${schemaNameIndex}` : undefined,
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
      flattenFormData: true,
      flattenDataOptions: {
        maxDepth: 2,
      },
      marginBottom: 30,
      footergroups: [],
      formgroups: [{
        card: {
          twoColumns: true,
          props: Object.assign({}, customCardProps, {
            cardTitle: `${ capitalize(schemaName) } Details`,
          }),
        },
        formElements: [{
          formGroupElementsLeft: [],
          formGroupElementsRight: [],
        }, ],
      }, ],
    },
  };
  let formElements = top.props.formgroups[0].formElements;
  let result = [top, ];
  let index = 0;
  let flattenedSchema = flatten(schema, { maxDepth: 2, });
  // if (schemaName === 'sor_applicantdata') {
  //   // console.log({ key, data, type,  });
  //   console.log({ schemaName, schema, });
  // }
  for (let key in schema) {
    let data = (schema[key] && schema[key].type && DICTIONARY[Symbol.for(schema[key].type)]) ?
      schema[key].type :
      schema[key];
    let type = DICTIONARY[Symbol.for(data)] || DICTIONARY[(data && Object.keys(data).length && data.type)? data.type: data];
    // if (label === 'creditengine') {
      //   console.log({ key, data, type, });
      // }
    // if (schemaName === 'sor_applicantdata') {
    //   console.log({ key, data, type,  });
    //   // console.log({ schemaName, schema, });
    // }
    elems.push({ key, schemaName, type, data, });
    if (['_id', 'id', 'content', 'title', 'name', 'authors', 'primaryauthor', 'status', 'description', 'changes', 'tags', 'categories', 'contenttypes', 'assets', 'primaryasset','attributes' ].concat(customIgnoreFields).indexOf(key) !== -1) {
      // console.log({ key, schema });
    } else if (type || (data && Array.isArray(data)) && customIgnoreFields.indexOf(key) === -1) {
      if (data && Array.isArray(data)) {
        type = 'array';
      }
      formElements[0][
        (index++ % 2 === 0) ?
        'formGroupElementsLeft' :
        'formGroupElementsRight'
      ].push(autoFormElements.buildInputComponent(key, type, schema, options));
    } else if (data && typeof data === 'object' && customIgnoreFields.indexOf(key) === -1 /*&& !Array.isArray(data)*/ ) {
      top.props.formgroups.push(autoFormElements.buildFormGroup(key, data, true, schema, options));
    } else if (Array.isArray(data) && customIgnoreFields.indexOf(key) !== -1) {
      result.push(autoFormElements.handleTable(key, data));
    }
  }
  result[0].props.formgroups.splice(0, 0, publishOptions.publishBasic(options));
  if (customFormGroups) {
    if (typeof customFormGroups === 'function') {
      result[0].props.formgroups.push(...customFormGroups(schema, schemaName, options, newEntity));
    } else {
      result[0].props.formgroups.push(...customFormGroups);
    }
  }
  result[0].props.formgroups.push(publishOptions.publishAttributes(schema, schemaName, options));


  //   result.push(
  //     // {
  //     //   component: 'pre',
  //     //   props: {
  //     //     style: {
  //     //       border: '1px solid black',
  //     //     },
  //     //   },
  //     //   children: 'label: '+JSON.stringify(label, null, 2),
  //     // },
  //     {
  //       component: 'pre',
  //       props: {
  //         style: {
  //           border: '1px solid black',
  //         },
  //       },
  //       children: 'schema: '+JSON.stringify(schema, null, 2),
  //     }
  //     // {
  //     //   component: 'pre',
  //     //   props: {
  //     //     style: {
  //     //       border: '1px solid black',
  //     //     },
  //     //   },
  //     //   children: 'elems: '+JSON.stringify(elems, null, 2),
  //     // }
  //   );

  return result;
};

module.exports = buildDetail;