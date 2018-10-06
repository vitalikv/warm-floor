import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import Modal from '../Modal/'
import CatalogButtons from '../CatalogButtons'
import modalWindows from '../../helpers/modalWindows'
import Editor from '../../components/Editor/'
import reactGlobal from '../../helpers/reactGlobal'

import * as appActions from '../../actions/'
import { LOTS_CATEGORY, PLINTH_CATEGORY, HANDLE_CATEGORY } from '../../constants/'

const mapStateToProps = (state) => {
  return { ...state }
};

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators(appActions, dispatch)
};

class App extends Component {

  constructor(props) {
    super(props)
    this.setModalHeader = this.props.setModalHeader.bind(this);
    this.openModal = this.props.openModal.bind(this);
    this.setFilters = this.props.setFilters.bind(this);
    this.setLibrary = this.props.setLibrary.bind(this);
    this.setPreviousPage = this.props.setPreviousPage.bind(this);
    this.clearLots = this.props.clearLots.bind(this);
    this.setLotFilters = this.props.setLotFilters.bind(this);
    this.setCatalogPage = this.props.setCatalogPage.bind(this);
    this.clearLotFilters = this.props.clearLotFilters.bind(this);
    this.setOldAvaibleFilters = this.props.setOldAvaibleFilters.bind(this);
    this.setSelectedFilters = this.props.setSelectedFilters.bind(this);
    this.setModalPage = this.props.setModalPage.bind(this);
    this.clearFilters = this.props.clearFilters.bind(this);
    this.getCategoryByFilters = this.props.getCategoryByFilters.bind(this);
    this.setActiveLot = this.props.setActiveLot.bind(this);
    this.clearActiveLot = this.props.clearActiveLot.bind(this);
    this.setPriceFilter = this.props.setPriceFilter.bind(this);
    this.setCategory = this.props.setCategory.bind(this);
  }

  componentDidMount() {
    reactGlobal.on('showmodal', (name, page) => {
      if (name !== 'catalog' && name !== 'tutorial') return;
      if (name === 'tutorial') {
        this.clearFilters();
        this.setModalPage(0);
        this.openModal('tutorialPage1');
        this.setPreviousPage('');
        return;
      }
      // console.log(LOTS_CATEGORY)
      this.setLibrary(LOTS_CATEGORY);
      this.clearLots();
      this.clearFilters();
      const category = page.category || false;
      let objectFilters;
      // const filters = (page.filter && page.filter != 1039) ? page.filter : false;
      let source;
      if (page.source) {
        if (category === 'plinths-select') {
          source = page.source.plinthSource
        } else if (category === 'handle-select') {
          source = page.source.handleSource
        } else {
          source = page.source;
        }
      }
      console.log(page);
      if (source && typeof source.filters !== 'undefined') {
        // console.log(source)
        if (category === 'plinths-select') { source.category = PLINTH_CATEGORY.toString() }
        if (category === 'handle-select') { source.category = HANDLE_CATEGORY.toString() }
        this.setPreviousPage('catalog');
        if (!source.category) {
          source.category = this.getCategoryByFilters(source.filters);
          this.setModalHeader(source.category.subCatName, source.category.catName);
        } else {
          const pos = this.getFiltersByCategory(source.category);
          this.setModalHeader(pos.category.name, pos.parent);
        }
        this.setCatalogPage(source.page);
        this.setOldAvaibleFilters(source.allFilters);
        this.setSelectedFilters(source.selectedFilters);
        // console.log('source filters', source.filters)
        this.setFilters(source.filters, true, source.allFilters);
        this.setCategory(source.category);
        // console.log('categoryFilteres', source.categoryFilters)
        this.setLotFilters(source.categoryFilters);
        this.setActiveLot({ ...source.activeLot });
        this.setPriceFilter(source.priceOrder);
        this.openModal('lots');
      } else {
        // let filter;
        const plinth = this.getFiltersByCategory(4240);
        const handle = this.getFiltersByCategory(4670);
        this.setCatalogPage(0);
        if (page.lotInfo) {
          console.log(page.lotInfo);
          this.setActiveLot({ ...page.lotInfo });
        } else {
          this.setActiveLot();
        }
        switch (category) {
          case 'plinths-select':
            this.setPreviousPage('catalog');
            this.setPriceFilter(null);
            this.setCategory(PLINTH_CATEGORY);
            this.setFilters(plinth.category.filters, true);
            this.setModalHeader(plinth.category.name, plinth.parent);
            this.openModal('lots');
            break;
          case 'handle-select':
            this.setPreviousPage('catalog');
            this.setPriceFilter(null);
            this.setCategory(HANDLE_CATEGORY);            
            this.setFilters(handle.category.filters, true);
            this.setModalHeader(handle.category.name, handle.parent);
            this.openModal('lots');
            break;
          default:
            if (page.filter && page.filter != 1039) {
              objectFilters = this.getCategoryByFilters(page.filter);
            }
            if (objectFilters) {
              this.setPriceFilter(null);
              this.clearLotFilters();
              this.setPreviousPage('catalog');
              this.setCatalogPage(0);
              this.setFilters(objectFilters.filters, true);
              this.setModalHeader(objectFilters.subCatName, objectFilters.catName);
              this.openModal('lots');
            } else {
              this.clearLotFilters();
              this.setModalHeader(modalWindows['catalog'].name);
              this.openModal('catalog');
            }
        }
        // if (filters) {
        //   switch (category) {
        //     case 'wall-material':
        //       filter = filters;
        //       this.setFilters(filter, true);
        //       this.openModal('lots');
        //       break;
        //     case 'doors':
        //       filter = filters;
        //       this.setFilters(filter, true);
        //       this.openModal('lots');
        //       break;
        //     case 'plinths-select':
        //       console.log(plinth)
        //       this.setFilters(plinth.category.filters, true);
        //       this.setModalHeader(plinth.category.name, plinth.parent.name)
        //       this.openModal('lots');
        //       break;
        //     default:
        //       this.setLibrary(LOTS_CATEGORY);
        //       this.setFilters(filters, true);
        //       (filters) ? this.openModal('lots') : this.openModal('catalog');
        //       this.setModalHeader(modalWindows['catalog'].name)
        //   }
        // } else {
        //   this.openModal('catalog');
        //   this.setModalHeader(modalWindows['catalog'].name)
        // }
      }
    })
    // const secondStart = localStorage.getItem('turorial');
    // if (secondStart != 'true') {
    //   this.setModalPage(0);
    //   this.openModal('tutorialPage1');
    //   localStorage.setItem('turorial', 'true')
    // }
  }

  getFiltersByCategory(id) {
    const categories = this.props.libraries[this.props.library].categories;
    for (let i in categories) {
      for (let c in categories[i].categories) {
        if (parseInt(categories[i].categories[c].id) === parseInt(id)) {
          return { category: categories[i].categories[c], parent: categories[i].name }
        }
      }
    }
  }

  render() {
    return (
      <div className='wrapper'>
        <CatalogButtons />
        <Modal>
          {this.props.modal.window && modalWindows[this.props.modal.window].el}
        </Modal>
        <Editor />
      </div>
    )
  }
}


export default connect(mapStateToProps, mapDispatchToProps)(App)
