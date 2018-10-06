import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import ReactSVG from 'react-svg'

import * as appActions from '../../actions/index'
import Filter from '../../components/Filter'
import PriceFilter from '../../components/PriceFilter'
import ModalWindow from '../../components/ModalWindow'
import TutorialPage from '../../components/TutorialPage'
import modalWindows from '../../helpers/modalWindows'
import WarningModal from '../../components/WarningModal'
import reactGlobal from '../../helpers/reactGlobal'

import preloader from '../../svg/preloader.svg'

class Modal extends React.Component {

  constructor(props) {
    super(props);
    this.closeModal = this.props.closeModal.bind(this);
    this.getLibraries = this.props.getLibraries.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.handleESCkey = this.handleESCkey.bind(this);
    this.openModal = this.props.openModal.bind(this);
    this.handleBack = this.handleBack.bind(this);
    this.setPreviousPage = this.props.setPreviousPage.bind(this);
    this.clearFilters = this.props.clearFilters.bind(this);
    this.applyFilter = this.applyFilter.bind(this);
    this.setLotFilters = this.props.setLotFilters.bind(this);
    this.clearLotFilters = this.props.clearLotFilters.bind(this);
    this.removeLotFilters = this.props.removeLotFilters.bind(this);
    this.handleFilterClear = this.handleFilterClear.bind(this);
    this.getLots = this.props.getLots.bind(this);
    this.handlePageChange = this.handlePageChange.bind(this);
    this.setModalPage = this.props.setModalPage.bind(this);
    this.handleAccept = this.handleAccept.bind(this);
    this.handleDecline = this.handleDecline.bind(this);
    this.handleApply = this.handleApply.bind(this);
    this.setSelectedFilters = this.props.setSelectedFilters.bind(this);
    this.setCatalogPage = this.props.setCatalogPage.bind(this);
    this.setLastModifedFilter = this.props.setLastModifedFilter.bind(this);
    this.clearSelectedFilters = this.props.clearSelectedFilters.bind(this);
    this.handlePriceOrderChange = this.handlePriceOrderChange.bind(this);
    this.handlePriceOrderReset = this.handlePriceOrderReset.bind(this);
    this.setPriceFilter = this.props.setPriceFilter.bind(this);
  }

  componentDidMount() {
    window.addEventListener('keydown', this.handleESCkey);
    this.getLibraries();
  }

  componentWillUnmount() {
    window.removeEventListener('keydown', this.handleESCkey);
  }

  handleESCkey(e) {
    if (e.keyCode === 27) {
      if (this.props.modal.window === 'catalog' || this.props.modal.window === 'lots') {
        reactGlobal.sendMessage('CATALOG.CLOSE_CATALOG');
      }
      this.closeModal();
    }
  }

  handleClose(e) {
    if (e.target.className === 'modal__wrap') {
      if (this.props.modal.window === 'catalog' || this.props.modal.window === 'lots') {
        reactGlobal.sendMessage('CATALOG.CLOSE_CATALOG');
      }
      this.closeModal();
    }
  }

  applyFilter(filters, id, selected) {
    this.setCatalogPage(0);
    this.setLotFilters(filters);
    this.setLastModifedFilter(id);
    this.setSelectedFilters({ [id]: selected })
    this.getLots();
  }

  handleFilterClear(filters, filterId, noUpdateNeeded) {
    this.removeLotFilters(filters);
    this.clearSelectedFilters(filterId);
    if (!noUpdateNeeded) {
      this.setCatalogPage(0);
      this.getLots();
    }
  }

  handlePriceOrderChange(order) {
    this.setPriceFilter(order);
    this.setCatalogPage(0);
    this.getLots();
  }

  handlePriceOrderReset() {
    this.setPriceFilter(null);
    this.getLots();
  }

  handleBack() {
    this.openModal(this.props.modal.previousPage);
    this.setPreviousPage('');
    this.clearFilters();
  }

  handlePageChange(id) {
    if (id === false) {
      if (this.props.modal.window === 'catalog' || this.props.modal.window === 'lots') {
        reactGlobal.sendMessage('CATALOG.CLOSE_CATALOG');
      }
      this.closeModal();
    } else {
      this.setModalPage(id);
    }
  }

  handleAccept() {
    const pending = this.props.modal.pending
    // console.dir(pending)
    reactGlobal.sendMessage('CATALOG.OBJECT_PICK', { type: pending.type, id: pending.id, name: pending.name, preview: pending.image });
    if (this.props.modal.window === 'catalog' || this.props.modal.window === 'lots') {
      reactGlobal.sendMessage('CATALOG.CLOSE_CATALOG');
    }
    this.closeModal();
  }

  handleDecline() {
    if (this.props.modal.window === 'catalog' || this.props.modal.window === 'lots') {
      reactGlobal.sendMessage('CATALOG.CLOSE_CATALOG');
    }
    this.closeModal()
  }

  handleApply() {
    // console.log(type, id, name, image)
  }

  render() {
    const { modal, children, avaibleFilters, allAvaibleFilters, selectedFilters, priceOrder, lastModifedFilter, lotFilters, fetchingLibrary, fetchingLots } = this.props;
    if (!modal.isOpen) return null;
    const backBtn = (modal.previousPage) ? <div className='modal__back-btn' onClick={this.handleBack}></div> : null
    const filters = avaibleFilters ? avaibleFilters : {};
    const allFilters = allAvaibleFilters ? allAvaibleFilters : {};
    const currentModal = modalWindows[modal.window];
    const priceFilter = currentModal.name === 'lots' ?
      <PriceFilter name='Цена'
        id='price'
        selected={priceOrder}
        handleApply={this.handlePriceOrderChange}
        handleClear={this.handlePriceOrderReset}
      /> :
      null;
    const colorFilter = allFilters[207] ?
      <Filter name='Цвет'
        id='207'
        allFilters={allFilters[207].filters}
        lastModifed={lastModifedFilter}
        lotFilters={lotFilters}
        selected={selectedFilters[207]}
        handleApply={this.applyFilter}
        handleClear={this.handleFilterClear}
        items={filters[207]} /> :
      null;
    const baseFilter = allFilters[208] ?
      <Filter name='Основа'
        id='208'
        allFilters={allFilters[208].filters}
        lastModifed={lastModifedFilter}
        lotFilters={lotFilters}
        selected={selectedFilters[208]}
        handleApply={this.applyFilter}
        handleClear={this.handleFilterClear}
        items={filters[208]} /> :
      null;
    const brandFilter = allFilters[209] ?
      <Filter name='Бренд'
        id='209'
        allFilters={allFilters[209].filters}
        lastModifed={lastModifedFilter}
        lotFilters={lotFilters}
        selected={selectedFilters[209]}
        handleApply={this.applyFilter}
        handleClear={this.handleFilterClear}
        items={filters[209]} /> :
      null;
    const filtersComponents = [{ el: priceFilter, id: 0 }, { el: colorFilter, id: 1 }, { el: baseFilter, id: 2 }, { el: brandFilter, id: 3 }];

    const modalPage = modal.page || 0;
    // console.log(modalPage)
    const page = (currentModal.type === 'tutorial') ? modalWindows[currentModal.pages[modalPage].page] : false;
    let currentModalBody;
    let loader = false;
    if (fetchingLibrary || fetchingLots) {
      loader = <div className='preloader-wrap'><ReactSVG path={preloader} /></div>;
    }
    switch (currentModal.type) {
      case 'catalog':
        currentModalBody = <ModalWindow
          backBtn={backBtn}
          modal={modal}
          filters={filtersComponents}
          children={children}
          handleApply={this.handleApply}
          loader={loader}
        />
        break;
      case 'tutorial':
        currentModalBody = <TutorialPage
          name={page.name}
          image={page.content.image}
          text={page.content.text}
          handlePageChange={this.handlePageChange}
          pages={page.pages}
          page={modal.page || 0}
          next={page.content.next}
        />
        break;
      case 'warning':
        currentModalBody = <WarningModal
          text={currentModal.text}
          accept={currentModal.accept}
          decline={currentModal.decline}
          handleAccept={this.handleAccept}
          handleDecline={this.handleDecline}
        />
    }

    return (
      <div className='modal'>
        <div className='modal__wrap' onClick={this.handleClose}>
          {currentModalBody}
        </div>
      </div>
    )
  }
}


function mapStateToProps(state) {
  return { ...state }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(appActions, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(Modal)
