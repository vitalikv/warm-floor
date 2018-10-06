import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { Scrollbars } from 'react-custom-scrollbars';

import CategoriesList from '../../components/CategoriesList/'
import LayoutsCategoriesList from '../../components/LayoutsCategoriesList/'

import * as appActions from '../../actions/index'

class CatalogCategories extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      categories: [],
      fetchingLibrary: false
    }

    this.handleClick = this.handleClick.bind(this);
    this.openModal = this.props.openModal.bind(this);
    this.setModalHeader = this.props.setModalHeader.bind(this);
    this.setFilters = this.props.setFilters.bind(this);
    this.setPreviousPage = this.props.setPreviousPage.bind(this);
    this.clearLots = this.props.clearLots.bind(this);
    this.clearFilters = this.props.clearFilters.bind(this);
    this.setCategory = this.props.setCategory.bind(this);
    this.getCategories = this.getCategories.bind(this);
    this.setCatalogPage = this.props.setCatalogPage.bind(this);
    this.setPriceFilter = this.props.setPriceFilter.bind(this);
  }

  componentWillReceiveProps(props) {
    if (this.state.fetchingLibrary === true && props.fetchingLibrary === false) {
      this.getCategories();
    }
    if (this.state.fetchingLibrary !== props.fetchingLibrary) {
      this.setState({ fetchingLibrary: props.fetchingLibrary })
    }
  }

  componentDidMount() {
    if (typeof this.props.libraries !== 'undefined' &&
      typeof this.props.libraries[this.props.library] !== 'undefined') {
      this.getCategories();
    }
    if (this.props.modal.window === 'layouts') {
      this.setModalHeader('Выбрать из каталога', 'Начало работы')
    } else {
      this.setModalHeader('Каталог товаров')
    }
  }

  getCategories() {
    const categories = this.props.libraries[this.props.library].categories;
    this.setState({ categories: categories })
  }

  handleClick(filters, name, subCategoryName, categoryId) {
    this.setPreviousPage(this.props.modal.window)
    this.clearLots();
    this.clearFilters();
    this.setPriceFilter(null);
    this.setCategory(categoryId);
    this.setCatalogPage(0);
    if (this.props.modal.window === 'layouts') {
      this.openModal('layoutLots');
    } else {
      this.openModal('lots');
    }
    this.setFilters(filters, true);
    this.setModalHeader(name, subCategoryName);
  }

  render() {
    const { fetchingLibrary, fetchingLots } = this.props;
    const element = (this.props.modal.window === 'layouts') ?
      <LayoutsCategoriesList loading={(fetchingLibrary || fetchingLots)} categories={this.state.categories} handleClick={this.handleClick} handleApply={this.props.handleApply} /> :
      <CategoriesList loading={(fetchingLibrary || fetchingLots)} categories={this.state.categories} handleClick={this.handleClick} />;
    return (
      <Scrollbars>
        {element}
      </Scrollbars>
    )
  }
}


function mapStateToProps(state) {
  return { ...state }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(appActions, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(CatalogCategories)
