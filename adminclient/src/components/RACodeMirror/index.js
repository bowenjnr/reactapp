import React, { Component, PropTypes, } from 'react';
import CodeMirror from 'react-codemirror';
import 'codemirror/lib/codemirror.css';
import 'codemirror/addon/fold/foldcode';
import 'codemirror/addon/fold/foldgutter';
import 'codemirror/addon/fold/foldgutter.css';
import 'codemirror/addon/fold/xml-fold';
import 'codemirror/mode/javascript/javascript';
import 'codemirror/mode/htmlmixed/htmlmixed';
import 'codemirror/mode/sql/sql';
import 'codemirror/mode/css/css';
import 'codemirror/mode/xml/xml';
import 'codemirror/mode/markdown/markdown';
import 'codemirror/mode/clojure/clojure';
import 'codemirror/mode/coffeescript/coffeescript';
import 'codemirror/mode/commonlisp/commonlisp';
import 'codemirror/mode/django/django';
import 'codemirror/mode/elm/elm';
import 'codemirror/mode/erlang/erlang';
import 'codemirror/mode/go/go';
import 'codemirror/mode/groovy/groovy';
import 'codemirror/mode/perl/perl';
import 'codemirror/mode/php/php';
import 'codemirror/mode/python/python';
import 'codemirror/mode/ruby/ruby';

import 'codemirror/addon/edit/matchbrackets';
import 'codemirror/addon/hint/css-hint';
import 'codemirror/addon/hint/html-hint';
import 'codemirror/addon/hint/javascript-hint';
import 'codemirror/addon/hint/show-hint';
import 'codemirror/addon/lint/css-lint';
import 'codemirror/addon/lint/javascript-lint';
import 'codemirror/addon/lint/lint';
import 'codemirror/addon/comment/comment';
import 'codemirror/addon/comment/continuecomment';
import 'codemirror/addon/fold/foldcode';
import 'codemirror/addon/fold/comment-fold';
import 'codemirror/addon/fold/indent-fold';
import 'codemirror/addon/fold/brace-fold';
import 'codemirror/addon/fold/foldgutter';
import 'codemirror/mode/css/css';
import 'codemirror/mode/htmlembedded/htmlembedded';

const propTypes = {
  editorType: PropTypes.string,
};
const defaultProps = {
  editorType:'code',
  codeMirrorProps: {
    options: {
      mode:'javascript',
      lineNumbers: true,
      lineWrapping: true,
      foldGutter: true,
      gutters: ['CodeMirror-linenumbers', 'CodeMirror-foldgutter', ],
    },
  },
};

class RACodeMirror extends Component {
  render() {
    let options = Object.assign({},
      this.props.codeMirrorProps,
      (this.props.useCMDynamicProps && this.props.dynamicCMProp)
        ? { value: this.props.dynamic[ this.props.dynamicCMProp ] }
        : {},
      (this.props.value)
        ? {
          value: (typeof this.props.value !== 'string')
            ? (this.props.stringify)?JSON.stringify(this.props.value,null,2):this.props.value.toString()
            : this.props.value
        }
        : {},
      {
        options: Object.assign({}, {
          lineNumbers: true,
          mode: 'javascript',
          lineWrapping: true,
          foldGutter: true,
          gutters: [ 'CodeMirror-linenumbers', 'CodeMirror-foldgutter', ],
        },
          this.props.codeMirrorPropsOptions, this.props.codeMirrorProps.options),
      });
      if (options.onChange && typeof options.onChange === 'string') {
        if (options.onChange.indexOf('func:this.props') !== -1) {
          options.onChange = this.props[ options.onChange.replace('func:this.props.', '') ];
        } else if (options.onChange.indexOf('func:window') !== -1 && typeof window[ options.onChange.replace('func:window.', '') ] === 'function') {
          options.onChange = window[ options.onChange.replace('func:window.', '') ].bind(this);
        }
      }
      // console.warn('RACodeMirror',{ options, });
    if (this.props.editorType === 'editor') {
      options.options.mode = 'application/x-ejs';
      return (<div {...this.props.wrapperProps}>
        <CodeMirror {...options}>{this.props.children}</CodeMirror>
        </div>);
    } else {
      return <div {...this.props.wrapperProps}><CodeMirror {...options}>{this.props.children}</CodeMirror></div>;
    }
  }
}
/*
class RACodeMirrorStateful extends Component {
  constructor(props) {
    super(props);
    this.state = props;
  }
  setValue(value) {
    this.setState({ codeMirrorProps: Object.assign({}, this.state.codeMirrorProps, { value, }) });
    // this.state.codeMirrorProps.value = value;
  }
  render() {
    let options = Object.assign({},
      this.state.codeMirrorProps,
      {
        options: Object.assign({}, {
          lineNumbers: true,
          // mode:'application/x-ejs',
          lineWrapping: true,
          foldGutter: true,
          gutters: ['CodeMirror-linenumbers', 'CodeMirror-foldgutter', ],
        },
          this.state.codeMirrorPropsOptions, this.state.codeMirrorProps.options),
      });
    if (this.props.editorType === 'editor') {
      options.options.mode = 'application/x-ejs';
      console.debug({ options, });
      return (<div {...this.props.wrapperProps}>
        <CodeMirror {...options}>{this.props.children}</CodeMirror>
        </div>);
    } else {
      return <div {...this.props.wrapperProps}><CodeMirror {...options}>{this.props.children}</CodeMirror></div>;
    }
  }
}
*/

RACodeMirror.propTypes = propTypes;
RACodeMirror.defaultProps = defaultProps;

export default RACodeMirror;
