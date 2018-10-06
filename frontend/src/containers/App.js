import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import $ from 'jquery'
import ReactSVG from 'react-svg'

import Modal from './Modal'

import Header from '../components/Header'
import FilterRooms from '../components/FilterRooms'
import FilterPrice from '../components/FilterPrice'
import FilterColor from '../components/FilterColor'
import FilterMore from '../components/FilterMore'
import Editor from '../components/Editor'
import reactGlobal from '../utils/page-script.js'

import * as appActions from '../actions/index'

import preloader from '../images/icons/preloader.svg'


class App extends React.Component {
  constructor(props) {
    super(props)

    this.closeModal = this.closeModal.bind(this)
    this.changeName = this.changeName.bind(this)
    this.getProjectInfo = this.props.getProjectInfo.bind(this)
    this.auth = this.props.auth.bind(this)
    this.updateEstimate = this.props.updateEstimate.bind(this)
    this.setFilterValue = this.props.setFilterValue.bind(this)
    this.setCurrentModal = this.props.setCurrentModal.bind(this)
  }

  componentDidMount() {

    if (!this.props.isAuth) {
      let date = new Date();
      if (!localStorage.getItem('tokenExpires') || localStorage.getItem('tokenExpires') <= date.getTime()) {
        this.auth()
      } else {
        this.props.authUser();
      }
    }

    let id = new URL(window.location.href).searchParams.get('id')

    if (process.env.NODE_ENV !== 'production') {
      this.getProjectInfo(id);
    }

    reactGlobal.on('load', () => {
      this.getProjectInfo(id);
    })

    reactGlobal.on('showmodal', (name, page) => {
      if (typeof page !== 'object') page = { category: 0, filter: '' };
      let category = page.category;
      let filter = parseInt(page.filter);
      switch (category) {
        case 'design':
          category = 1;
          break;
        case 'wall-material':
          category = 162;
          break;
        case '':
          category = true;
          break;
      }
      reactGlobal.showModal(name)
      this.setCurrentModal(name)
      if (name == 'products') {
        const setCategory = (category) ? this.refs.modal.getWrappedInstance().setActiveCategory : false;
        if (!this.refs.modal.getWrappedInstance().props.categories) {
          this.refs.modal.getWrappedInstance().props.getCategoryList(setCategory, category, filter)
        } else {
          if (setCategory) { setCategory(category, filter) }
        }
      }
    })

    $('.wrapper').on('click', '.logo', () => {
      reactGlobal.emit('showmodal', 'startPage')
    })

    $('.open-catalog').on('click', function () {
      reactGlobal.emit('showmodal', 'products', '0')
    })

  }

  closeModal() {
    reactGlobal.closeModal();
  }

  changeName(name) {
    console.log('Name changed: ' + name)
  }

  minimizeLoader() {
    this.refs.loader.classList.toggle('loader-small')
  }

  render() {
    const loaderText = (this.props.loaderText) ? this.props.loaderText : 'Авторизация';
    const preLoader = (this.props.authInProcess || this.props.loader) ? <div className='loader' ref='loader' onClick={() => this.minimizeLoader()}><div className='loader__content'><div className='preloader-wrap'><ReactSVG path={preloader} /></div><div className='loader__text'>{loaderText}</div></div></div> : null;
    const openCatalog = <div className='open-catalog'></div>
    return (
      <div className='wrapper'>
        <Header projectName={this.props.project.name} price={this.props.project.price} updateEstimate={this.updateEstimate} changeName={this.changeName} userName={this.props.user.name} isLoading={this.props.loadingEstimate} />
        <Modal ref='modal' currentModal={this.props.currentModal} setCurrentModal={this.setCurrentModal} closeAction={this.closeModal}>
          <FilterRooms
            name='rooms'
            options={[
              { name: 1, value: 'r1' },
              { name: '2', value: 'r2' },
              { name: '3', value: 'r3' },
              { name: '4+', value: 'r4' },
              { name: 'Студии', value: 'studio' },
              { name: 'Команты', value: 'komnaty' }
            ]}
            selected={this.props.filters.roomsFilter} />
          <FilterPrice name='price' />
          <FilterColor name='color' />
          <FilterMore name='more' />
        </Modal>
        {openCatalog}
        <Editor />
        {preLoader}
      </div>
    )
  }
}

function mapStateToProps(state) {
  return { ...state.app }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(appActions, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(App)
