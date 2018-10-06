import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { Scrollbars } from 'react-custom-scrollbars';

import Products from '../../components/Products/'
import LayoutsList from '../../components/LayoutsList/'
import reactGlobal from '../../helpers/reactGlobal'
import ReactPaginate from 'react-paginate'
import * as appActions from '../../actions/index'

class CatalogLots extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      lots: [],
      fetchingLots: false
    }

    this.handleClick = this.handleClick.bind(this);
    this.openModal = this.props.openModal.bind(this);
    this.setModalHeader = this.props.setModalHeader.bind(this);
    this.getLots = this.props.getLots.bind(this);
    this.closeModal = this.props.closeModal.bind(this);
    this.handlePageClick = this.handlePageClick.bind(this);
    this.handleApply = this.handleApply.bind(this);
    this.setCatalogPage = this.props.setCatalogPage.bind(this);
    this.loadMore = this.loadMore.bind(this);
    this.needToUpdateFilters = this.props.needToUpdateFilters.bind(this);
  }

  handleClick(type, lotGroup, typeOnPlan, id, name, preview, price, caption, size, modifiers, allModifiers) {
    const source = {
      category: this.props.category,
      page: this.props.pages.current,
      filters: this.props.filters,
      categoryFilters: this.props.lotFilters,
      allFilters: this.props.allAvaibleFilters,
      selectedFilters: this.props.selectedFilters,
      priceOrder: this.props.priceOrder,
      caption: caption,
      activeLot: {
        id: id,
        preview: preview,
        name: name,
        price: price,
        page: this.props.pages.current,
      },
    }
    reactGlobal.sendMessage('CATALOG.OBJECT_PICK', { type: type, lotGroup: lotGroup, size: size, modifiers: modifiers, allModifiers: allModifiers, typeOnPlan: typeOnPlan, id: id, name: name, preview: preview, source: source });
    reactGlobal.sendMessage('CATALOG.CLOSE_CATALOG');
    this.closeModal();
  }

  cleanFilters(filters, lotFilters) {
    for (let f in filters) {
      for (let lf in lotFilters) {
        if (lotFilters[lf] === filters[f]) {
          filters.splice(f, 1)
        }
      }
    }
    return filters;
  }

  handlePageClick(data) {
    this.setCatalogPage(data.selected);
    this.needToUpdateFilters(false);
    this.getLots(false, this.props.filters, data.selected);
  }

  handleApply(type, lotGroup, typeOnPlan, id, name, image) {
    // console.log(type, id, name, image)
    this.openModal('layoutAlert', { type: type, id: id, name: name, image: image })
  }

  loadNext() {
    console.log('loading')
  }


  componentDidMount() {
    this.getLots(false, this.props.filters, 0, true);
    this.scroll.addEventListener('scroll', this.onScroll)
  }


  componentWillUnmount() {
    this.scroll.removeEventListener('scroll', this.onScroll)
  }

  loadMore() {
    this.setCatalogPage(++this.props.pages.current);
    this.needToUpdateFilters(false);    
    this.getLots(false, this.props.filters, this.props.pages.current, false, 1);
  }

  render() {
    const { count, current } = this.props.pages;
    const activeLotId = this.props.activeLot && this.props.activeLot.id;
    const pages = Math.ceil(this.props.totalLots / this.props.pages.perPage) - 1;
    const element = (this.props.modal.window === 'layoutLots') ?
      <LayoutsList lots={this.props.lots} handleClick={this.handleClick} handleApply={this.handleApply} /> :
      <Products lots={this.props.lots} activeLot={activeLotId} pages={pages} fetchingLots={this.props.fetchingLots} page={this.props.pages.current} setPage={this.props.setCatalogPage} loadMore={this.loadMore} handleClick={this.handleClick} />;
    return (
      <div className='modal__scroll-wrap' ref={(scroll) => this.scroll = scroll}>
        <Scrollbars>
          {element}
        </Scrollbars>
        <ReactPaginate previousLabel={'prev'}
          nextLabel={'next'}
          breakLabel={'...'}
          breakClassName={'pagination__break'}
          pageCount={count}
          initialPage={current}
          forcePage={current}
          marginPagesDisplayed={1}
          pageRangeDisplayed={2}
          onPageChange={this.handlePageClick}
          containerClassName={'pagination'}
          subContainerClassName={'pagination__pages'}
          activeClassName={'pagination__active'}
          previousClassName={'pagination__next'}
          nextClassName={'pagination__next'}
          pageClassName={'pagination__page'}
          disableInitialCallback={true} />
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

export default connect(mapStateToProps, mapDispatchToProps)(CatalogLots)
