import React from 'react'
import ReactSVG from 'react-svg'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import Plans from '../components/Plans'
import Products from '../components/Products'
import StartPage from '../components/StartPage'
import reactGlobal from '../utils/page-script.js'

import * as appActions from '../actions/index'

import preloader from '../images/icons/preloader.svg'

class Modal extends React.Component {

  constructor(props) {
    super(props)

    this.state = {
      filters: []
    }

    this.initModal = this.initModal.bind(this)
    this.apply = this.apply.bind(this)
    this.filterData = this.filterData.bind(this)
    this.handleFilterChange = this.handleFilterChange.bind(this)
    this.getLot = this.props.getLot.bind(this)
    this.getLotsBySearch = this.props.getLotsBySearch.bind(this)
    this.setFilterValue = this.props.setFilterValue.bind(this)
    this.setCategoryName = this.props.setCategoryName.bind(this)
    this.getCategoryList = this.props.getCategoryList.bind(this)
    this.setActiveCategoryId = this.props.setActiveCategoryId.bind(this)
    this.setActiveCategory = this.setActiveCategory.bind(this)
    this.closeAction = this.props.closeAction.bind(this)
  }

  componentDidMount() {
    var self = this;
    document.querySelector('.modal__wrap').addEventListener('click', function (e) {
      if (e.target.className === 'modal__wrap') {
        self.closeAction();
      }
    })
  }


  initModal(props) {

    let filters = [];
    if (props.modal.filters) {
      this.props.children.map((filter) => {
        if (props.modal.filters.indexOf(filter.props.name) >= 0) {
          let p = {
            props: {
              ...filter.props,
              closeAction: this.closeAction,
              data: this.state.products,
              filterData: this.filterData,
              handleChange: this.handleFilterChange
            }
          }
          let f = { ...filter, ...p }
          filters.push(f)
        }
      })
    }
  }

  apply(type, id, name, preview) {
    reactGlobal.sendMessage('object', { type: type, id: id, name: name, preview: preview });
    this.closeAction();
  }

  filterData(data) {
    this.setState({ products: data })
  }

  handleFilterChange(value) {
    console.log(value)
  }

  componentDidUpdate(prevProps) {
    if (prevProps.modal !== this.props.modal) {
      this.initModal(this.props)
    }


    if (this.props.currentModal == 'startPage') {
      this.setCategoryName('Выбор шаблона планировки', 'Начало работы');
    } else if (this.props.categoryId == 0) {
      this.setCategoryName(' ', 'Каталог')
    }

  }

  setActiveCategory(id, filter) {
    console.log(id, filter)
    if (filter) id = this.getCategoryByFilter(filter)
    if (typeof(id) === 'undefined') return;
    this.setActiveCategoryId(id)
    if (id != 0) {
      const lots = this.props.categories[id].filter_lots;
      if (lots.length > 0) {
        const pp = Math.round(20 / lots.length)
        lots.map(category => {
          this.getLotsBySearch({ 'filters[]': category, 'count': pp, offset: '0', 'lang': 'ru' })
        })
        this.setCategoryName(this.props.categories[id].caption.ru, '')
      } else {
        this.setCategoryName(' ', this.props.categories[id].caption.ru)
      }
    } else {
      this.setCategoryName(' ', 'Каталог')
    }
  }

  getCategoryByFilter(filter) {
    const cats = this.props.categories;
    for (var k in cats) {
      if (cats[k].filter_lots.indexOf(filter) != -1) {
        return cats[k]['id'];
      }
    }
  }

  render() {
    // console.log(this.props)
    let currentModal = '';
    switch (this.props.currentModal) {
      case 'startPage':
        currentModal = <StartPage name='start' filters={this.filters} handleChange={this.setFilterValue} setCurrentModal={this.props.setCurrentModal} setCategoryName={this.setCategoryName} />
        break;
      case 'plans':
        currentModal = <Plans filters={this.filters} setCategory={this.setCategory} applyAction={this.apply} closeAction={this.closeAction} />
        break;
      case 'products':
        currentModal = <Products products={this.props.lots} categoryId={this.props.categoryId} categories={this.props.categories} chooseCategory={this.setActiveCategory} applyAction={this.apply} closeAction={this.closeAction} />
        break;
      case 'category':
        currentModal = <Products applyAction={this.apply} closeAction={this.closeAction} />
        break;
      default:
      // currentModal = <StartPage name='start' filters={this.filters} handleChange={this.setFilterValue} setCategoryName={this.setCategoryName} />
    }
    if (this.props.loadingData) {
      currentModal = <div className='preloader-wrap'><ReactSVG path={preloader} /></div>
    }
    const prev = (this.props.categoryId != 0) ? this.props.categories[this.props.categoryId].catalog_categories_id : 0;
    const backBtn = (this.props.currentModal === 'products' && prev != this.props.categoryId) ? <div className='modal__back-btn' onClick={() => this.setActiveCategory(prev)}></div> : null
    return (
      <div className='modal'>
        <div className='modal__wrap'>
          <div className='modal__window'>
            <div className='modal__header'>
              {backBtn}
              <div className='modal__title'>
                <div className='modal__category'>
                  {this.props.subCategory}
                </div>
                <div className='modal__name'>
                  {this.props.category}
                </div>
              </div>
              <div className='modal__header-body'>
                {this.state.filters.map(f => f)}
              </div>
            </div>
            <div className='modal__body'>
              {currentModal}
            </div>
          </div>
        </div>
      </div>
    )
  }
}


function mapStateToProps(state) {
  return { ...state.modals, currentModal: state.app.currentModal }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(appActions, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps, null, { withRef: true })(Modal)
