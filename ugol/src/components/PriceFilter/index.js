import React from 'react'

class PriceFilter extends React.Component {

  constructor(props) {
    super(props);

    let order = parseInt(this.props.selected);

    const items = [
      {
        id: 0,
        value: 'asc',
        name: 'По возрастанию цены'
      },
      {
        id: 1,
        value: 'desc',
        name: 'По убыванию цены'
      }
    ]

    const selected = items[order] ? items[order].name : null;

    this.state = {
      selected: selected,
      open: false,
      items: items,
      current: order
    }

    this.handleClick = this.handleClick.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleReset = this.handleReset.bind(this);
    this.handleOutsideClick = this.handleOutsideClick.bind(this);
  }

  handleClick(e) {
    if (e && e.target.classList.contains('filter__reset')) return;
    if (!this.state.open) {
      document.addEventListener('click', this.handleOutsideClick, false);
    } else {
      document.removeEventListener('click', this.handleOutsideClick, false);
    }

    this.setState(prevState => ({
      open: !prevState.open,
    }));
  }

  handleOutsideClick(e) {
    if (this.node && this.node.contains(e.target)) {
      return;
    }
    this.handleClick();
  }

  handleSubmit() {
    const value = this.state.current;
    const selected = this.state.items[value].name;

    this.handleClick();

    this.setState({
      selected: selected,
    })

    this.props.handleApply(this.state.current);
  }

  handleChange(event) {
    const value = event.target.value;

    this.setState({
      current: value
    })

  }

  handleReset() {
    this.setState({
      selected: '',
      current: null
    })

    this.props.handleClear();
  }


  render() {
    const name = this.props.name;
    const filterReset = (this.state.selected) ? <span className='filter__reset' onClick={this.handleReset}></span> : null;

    return (
      <div className='modal__filter' ref={node => { this.node = node; }}>
        <div className='filter' >
          <div
            className={(this.state.selected) ? 'filter__button filter__button--selected' : 'filter__button'}
            onClick={this.handleClick}>
            <span className='filter__name'>{this.state.selected ? this.state.selected : name}</span>
            {filterReset}
          </div>
          {this.state.open && <div className='filter__dropdown'>
            <div className='filter__list'>
              <ul className='filter__scroll'>
                {this.state.items.map(item => (
                  <li className='filter__item' key={item.id}>
                    <input
                      className='filter__radio'
                      type='radio'
                      name='price-fitler'
                      value={item.id}
                      id={item.value}
                      onChange={this.handleChange}
                      checked={item.id == this.state.current}
                    />
                    <label htmlFor={item.value}>{item.name}</label>
                  </li>
                ))}
              </ul>
            </div>
            <div className='filter__action'>
              <div className='modal__btn modal__btn_small filter__action-btn' onClick={this.handleSubmit}>Применить</div>
            </div>
          </div>}
        </div>
      </div>
    )
  }
}

export default PriceFilter;