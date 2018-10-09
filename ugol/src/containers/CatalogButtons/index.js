import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import SlideButton from '../../components/SlideButton/'
import reactGlobal from '../../helpers/reactGlobal'


import * as appActions from '../../actions/'

import catalogIcon from '../../svg/ic-chair.svg'
import layoutsIcon from '../../svg/ic-plan.svg'

import { LOTS_CATEGORY, LAYOUT_CATEGORY } from '../../constants';

const mapStateToProps = (state) => {
  return { ...state }
};

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators(appActions, dispatch)
};

class CatalogButtons extends Component {

  constructor(props) {
    super(props);
    this.openModal = this.props.openModal.bind(this);
    this.setLibrary = this.props.setLibrary.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.setPreviousPage = this.props.setPreviousPage.bind(this);
    this.setModalPage = this.props.setModalPage.bind(this);
    this.clearFilters = this.props.clearFilters.bind(this);
    this.clearActiveLot = this.props.clearActiveLot.bind(this);
    this.needToUpdateFilters = this.props.needToUpdateFilters.bind(this);
  }

  handleClick(name, id) {
    if ((this.props.modal.window == 'catalog' ||
      this.props.modal.window == 'lots' ||
      this.props.modal.window == 'layouts') &&
      this.props.library === id) {
      this.clearActiveLot();
      this.needToUpdateFilters(false);
      this.openModal(this.props.modal.window);
    } else {
      this.clearFilters();
      this.setLibrary(id);
      this.setModalPage(0);
      this.clearActiveLot();
      this.setPreviousPage('');
      this.openModal(name);
    }
    if (name === 'catalog') {
      reactGlobal.sendMessage('CATALOG.OPEN_CATALOG');
    }
  }


}

export default connect(mapStateToProps, mapDispatchToProps)(CatalogButtons)