import React from 'react'

const Layout = ({ image, type, typeOnPlan, lotGroup, id, name, handleApply }) => (
  <div className='products__item-wrap--2x' data-id={id}>
    <div className='products__item' onClick={() => handleApply(type, typeOnPlan, lotGroup, id, name, image)}>
      <div className='product'>
        <div className='product__image-wrap--layout'>
          <div className='product__image--layout'>
            <img src={image} alt='' />
          </div>
        </div>
        <div className='product__desc--layout'>
          <div className='product__title'>{name}</div>
        </div>
      </div>
    </div>
  </div>
)

export default Layout;