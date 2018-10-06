import React from 'react'
import $ from 'jquery'

class ProjectName extends React.Component {

  constructor(props) {
    super(props)

    this.text = '';
    this.input = '';

    this.state = {
      value: this.props.value,
      editing: false,
      el: '',
      in: ''
    }
  }

  editText() {
    this.setState({ editing: true })
    let length = this.input.value.toString().length
    this.input.setSelectionRange(length, length)
  }

  onBlur() {
    if (!this.state.editing) return;
    this.setState({ editing: false })
    this.props.changeName(this.state.value);
  }

  componentDidUpdate() {
    if (!this.state.editing) {
      this.input.style.height = this.text.offsetHeight - 1 + 'px';
      this.input.style.width = this.text.offsetWidth - 38 + 'px';
    }
    if (this.state.editing) {
      this.input.focus();
    }
    this.state.in.css({ width: parseInt(this.state.el.css('width')) + 5 + 'px' })
  }

  componentWillReceiveProps(nextProps) {
    if (this.state.value != nextProps.value) {
      this.setState({ value: nextProps.value })
    }
  }

  handleChange(e) {
    this.setState({ value: e.target.value })
  }

  onKeyDown(e) {
    if (e.keyCode == 8 || e.keyCode == 46) {
      this.state.in.css({ width: parseInt(this.state.el.css('width')) + 'px' })
      return
    }
    if (e.key.length > 1) return;
    let k = ''
    if (e.keyCode == 32) { k = '_' }
    this.text.innerHTML = e.target.value + e.key + k;
    this.state.in.css({ width: parseInt(this.state.el.css('width')) + 5 + 'px' })
  }

  onKeyPress(e) {
    if (e.key == 'Enter') {
      this.onBlur();
    }
  }

  componentDidMount() {
    $('.editable__input').css({ width: parseInt($('.editable__text').css('width')) + 'px' })
    this.setState({ el: $('.editable__text'), in: $('.editable__input') })
  }

  render() {
    let input = (!this.state.editing) ? 'none' : 'block';
    let span = (this.state.editing) ? 'none' : 'inline-block';
    return (
      <h1 className='editable'>
        <span
          ref={text => this.text = text}
          className='editable__text'
          style={{ display: span }}
          onClick={() => this.editText()}
          title={this.state.value}>
          {this.state.value}
        </span>
        <input
          className='editable__input'
          type='text'
          ref={input => this.input = input}
          style={{ display: input }}
          value={this.state.value}
          onBlur={() => this.onBlur()}
          onChange={(e) => this.handleChange(e)}
          onKeyDown={(e) => this.onKeyDown(e)}
          onKeyPress={(e) => this.onKeyPress(e)}
        />
      </h1>
    )
  }
}

export default ProjectName