import React from 'react'

import Product from './Product'
import Category from './Category'
import SimpleBar from 'simplebar'

class Products extends React.Component {
  componentDidMount() {
    if (this.props.products || this.props.categories) {
      new SimpleBar(document.querySelector('.products-scroll-wrap'));
      document.querySelector('.simplebar-track.vertical').style.visibility = 'visible';
    }
  }
  componentDidUpdate() {
    if (this.props.products || this.props.categories) {
      new SimpleBar(document.querySelector('.products-scroll-wrap'));
      document.querySelector('.simplebar-track.vertical').style.visibility = 'visible';
    }
  }
  render() {
    // console.log(this.props.categories)
    let products = []
    let categories = []


    for (let i in this.props.categories) {
      if ((this.props.categories[i].catalog_categories_id == this.props.categoryId) && !this.props.categories[i].hidden) {
        categories.push(this.props.categories[i])
      }
    }

    if (this.props.products.length > 0) {
      products = [...this.props.products];
    }

    // console.log(this.props.products)
    return (
      <div className='products-scroll-wrap'>
        <div className='products'>
          <div className='products__container'>
            {categories.map(p => <Category key={p.id} category={p} chooseCategory={this.props.chooseCategory} />)}
            {products.map(p => <Product key={p.id} product={p} applyAction={this.props.applyAction} />)}
          </div>
        </div>
      </div>
    )
  }
}

export default Products