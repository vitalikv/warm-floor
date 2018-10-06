import React from 'react'

function Product({product, applyAction }) {
  var id = product.id,
      img = 'https:'+product.preview,
      name = product.caption,
      price = product.price,
      type = product.lotGroup
  return (
    <div className='products__item-wrap' data-id={id}>
      <div className='products__item'>
        <div className='product'>
          <div className='product__image-wrap'>
            <div className='product__image'>
              <img src={img} alt='' />
              <div className='product__apply' data-close>
                <div className='modal__btn modal__btn_small' onClick={()=>applyAction(type, id, name, img)}>Применить</div>
              </div>
            </div>
          </div>
          <div className='product__desc'>
            <div className='product__title'>{name}</div>
            <div className='product__price'>от {price} <span className='ic-rub'></span>/м<sup>2</sup></div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Product