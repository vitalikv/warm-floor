import React from 'react'
import { Scrollbars } from 'react-custom-scrollbars';

import declOfNum from '../../helpers/declOfNum'

class Filter extends React.Component {

  constructor(props) {
    super(props);
    let items = [];
    if (typeof this.props.items !== 'undefined') {
      for (let i in this.props.items.filters) {
        items.push(this.props.items.filters[i])
      }
    }
    if (typeof this.props.allFilters !== 'undefined' && typeof this.props.allFilters[0].disabled !== 'undefined') {
      items = [...this.props.allFilters];
    }
    let lotFilters = {};
    for (let f in this.props.lotFilters) {
      lotFilters[this.props.lotFilters[f]] = true;
    }
    lotFilters = this.removeWrongValues(items, lotFilters);
    this.state = {
      open: false,
      values: { ...lotFilters },
      items: items,
      selected: this.props.selected || false,
      lastValues: {}
    }

    this.handleClick = this.handleClick.bind(this);
    this.handleReset = this.handleReset.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleOutsideClick = this.handleOutsideClick.bind(this);
    this.removeLotFilters = this.props.handleClear.bind(this);
    this.resortItems = this.resortItems.bind(this);
    this.removeWrongValues = this.removeWrongValues.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    const newFilters = (typeof nextProps.items !== 'undefined') ? nextProps.items.filters.slice() : [];
    const allFilters = (typeof nextProps.allFilters !== 'undefined') ? nextProps.allFilters.slice() : [];
    const values = this.removeWrongValues(allFilters, this.state.lotFilters);
    for (let o in allFilters) {
      allFilters[o].disabled = true;
      for (let n in newFilters) {
        if (newFilters[n].id === allFilters[o].id) {
          allFilters[o].disabled = false;
        }
      }
      for (let v in values) {
        if (values[v] === true && parseInt(v) === parseInt(allFilters[o].id)) {
          allFilters[o].disabled = false;
        }
      }
      if (this.state.values[allFilters[o].id] === true) {
        allFilters[o].disabled = false;
      }
    }

    this.setState({ items: [...this.resortItems(allFilters)]});
  }

  removeWrongValues(items, values) {
    const hasValues = {};
    // console.log('values', values)
    for (let i in items) {
      for (let v in values) {
        if (parseInt(v) === parseInt(items[i].id)) hasValues[v] = values[v];
      }
    }
    return hasValues;
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
    const colors = ['Цвет', 'Цвета', 'Цветов'];
    const base = ['Основа', 'Основы', 'Основ'];
    const brands = ['Бренд', 'Бренда', 'Брендов'];
    let name;
    switch (this.props.name) {
      case 'Цвет':
        name = colors;
        break;
      case 'Основа':
        name = base;
        break;
      case 'Бренд':
        name = brands;
        break;
    }
    const filters = [];
    const filtersToRemove = [];
    let filtersLength = 0;
    let doubleCounter = 0;
    for (let i in this.state.values) {
      filtersLength++;
      if (this.state.values[i] === true) {
        filters.push(i);
        if (typeof this.state.lastValues[i] !== 'undefined' && this.state.lastValues[i] === true) {
          doubleCounter++;
        }
      } else {
        filtersToRemove.push(i);
      }

    }

    const lastValues = [];
    for (let i in this.state.lastValues) {
      lastValues.push(i)
    }

    this.handleClick();
    if (lastValues.length > 0 && doubleCounter === lastValues.length && lastValues.length === filtersLength) {
      return;
    }

    let selected = '';
    if (filters.length === 1) {
      selected = this.getFilterName(filters[0]);
      this.setState({
        selected: selected
      })
    } else if (filters.length > 1) {
      selected = filters.length + ' ' + declOfNum(filters.length, name);
      this.setState({
        selected: selected
      })
    }

    if (filtersToRemove.length === filtersLength) {
      this.setState({ selected: false })
    }

    this.setState(prevState => ({
      lastValues: { ...prevState.values }
    }))

    this.removeLotFilters(filtersToRemove, this.props.id, true);
    this.props.handleApply(filters, this.props.id, selected);
  }

  resortItems(items) {
    const sorted = [];
    // console.log(items);
    for (let i in items) {
      items[i].disabled ? sorted.push(items[i]) : sorted.unshift(items[i]);
    }
    return sorted;
  }

  getFilterName(id) {
    if (typeof this.props.items === 'undefined') return;

    for (let i = 0; i < this.props.items.filters.length; i++) {
      if (this.props.items.filters[i].id === parseInt(id)) {
        return this.props.items.filters[i].name
      }
    }
  }

  handleReset() {
    const filters = [];
    for (let i in this.state.values) {
      if (this.state.values[i] === true) {
        filters.push(i);
      }
    }
    this.setState({ selected: false, values: {}, lastValues: {} });

    this.removeLotFilters(filters, this.props.id)
  }

  handleChange(event) {
    event.persist();
    this.setState(prevState => {
      const values = prevState.values;
      values[event.target.id] = event.target.checked;
      return {
        values: values
      }
    })
  }

  render() {
    const { name, items } = this.props;
    const filterReset = (this.state.selected) ? <span className='filter__reset' onClick={this.handleReset}></span> : null;
    const filterItems = this.state.items;
    return (
      <div className={(!items && !this.state.selected) ? 'modal__filter filter--disabled' : 'modal__filter'} ref={node => { this.node = node; }}>
        <div className='filter' >
          <div className={(this.state.selected) ? 'filter__button filter__button--selected' : 'filter__button'}
            onClick={this.handleClick}>
            <span className='filter__name'>{this.state.selected ? this.state.selected : name}</span>
            {filterReset}
          </div>
          {this.state.open && filterItems && <div className='filter__dropdown'>
            <div className='filter__list'>
              <Scrollbars style={{ height: 250 }}>
                <ul className='filter__scroll'>
                  {filterItems.map(item => (
                    <li className={item.disabled ? 'filter__item filter__item--disabled' : 'filter__item'} key={item.id}>
                      <input type='checkbox' onChange={this.handleChange} className='filter__checkbox' id={item.id} checked={this.state.values[item.id] || false} />
                      <label htmlFor={item.id} >{item.name}
                        <span className='filter__items-count'>{item.count}</span>
                      </label>
                    </li>
                  ))}
                </ul>
              </Scrollbars>
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

export default Filter;