import React from 'react'

class RadioSelect extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      selected: ''      
    }
    this.handleClick = this.handleClick.bind(this)
  }
  
  componentDidMount() {
    if (this.props.selected) {
      this.setState({selected: this.props.selected})
    }
  }

  handleClick(value) {
    this.setState({ selected: value })
    this.props.handleChange(value)
  }

  render() {
    var options = this.props.options ? this.props.options : [];
    return (
      <div ref='rselect' className='r-select' data-action='room-type' data-selected=''>
        {options.map(o => <RadioSelectOption active={(this.state.selected == o.value) ? true : false}
            value={o.value}
            name={o.name}
            handleClick={this.handleClick}
            key={o.value}/>
        )}
      </div>
    )
  }
}

function RadioSelectOption({ name, value, handleClick, active }) {
  var cn = active ? 'r-select__option r-select__option_active' : 'r-select__option';
  return <div className={cn} data-value={value} onClick={() => handleClick(value)}>{name}</div>

}

export default RadioSelect