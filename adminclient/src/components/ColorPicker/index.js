import React from 'react'
import reactCSS from 'reactcss'
import { SketchPicker } from 'react-color'
import { Input, } from 're-bulma';

class ColorPicker extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      displayColorPicker: false,
      color: this.props.color || '#ccc',
    };
    this.handleClick = this.handleClick.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  handleClick() {
    this.setState({ displayColorPicker: !this.state.displayColorPicker })
  };

  handleClose() {
    this.setState({ displayColorPicker: false })
  };

  handleChange(color) {
    this.setState({ color: color.hex });
  };

  componentWillUpdate(nextProps, nextState) {
    if (nextProps.color !== nextState.color) {
      this.setState({ color: nextProps.color });
    }
  }


  render() {
    const colorStyle = this.props.colorStyle || {};
    const swatchStyle = this.props.swatchStyle || {};
    const popoverStyle = this.props.popoverStyle || {};
    const coverStyle = this.props.coverStyle || {};
    const sketchPickerProps = this.props.sketchPickerProps || {};
    const styles = reactCSS({
      'default': {
        color: Object.assign({
          width: '36px',
          height: '14px',
          borderRadius: '2px',
          background: this.state.color,
        }, colorStyle),
        swatch: Object.assign({
          padding: '5px',
          background: this.state.color,
          borderRadius: '1px',
          boxShadow: '0 0 0 1px rgba(0,0,0,.1)',
          display: 'inline-block',
          cursor: 'pointer',
        }, swatchStyle),
        popover: Object.assign({
          // position: 'absolute',
          // zIndex: '2',
        }, popoverStyle),
        cover: Object.assign({
          position: 'fixed',
          top: '0px',
          right: '0px',
          bottom: '0px',
          left: '0px',
        }, coverStyle),
      },
    });

    return (
      <div>
        <div style={styles.swatch} onClick={this.handleClick}>
          <div style={styles.color} />
        </div>
        {this.state.displayColorPicker ? <div style={styles.popover}>
          <div style={styles.cover} onClick={this.handleClose} />
          <SketchPicker color={this.state.color} disableAlpha={true} onChange={this.props.onChange || this.handleChange} {...sketchPickerProps} />
        </div> : null}

      </div>
    )
  }
}

const propTypes = {};

ColorPicker.propTypes = propTypes;
ColorPicker.defaultProps = {};

export default ColorPicker