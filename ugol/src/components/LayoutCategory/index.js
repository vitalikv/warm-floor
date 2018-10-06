import React from 'react'

const LayoutCategory = ({ name, image, handleClick, filters }) => (
  <div className='products__item-wrap--2x'>
    <div className='products__item' onClick={() => handleClick(filters, name, 'Начало работы / Выбрать из каталога')}>
      <div className='product'>
        <div className='product__image-wrap--2x'>
          <div className='product__image--2x'>
            <img src={image} alt={name} />
          </div>
        </div>
        <div className='product__desc'>
          <div className='product__title--2x'>{name}</div>
        </div>
      </div>
    </div>
  </div>
)

export default LayoutCategory;