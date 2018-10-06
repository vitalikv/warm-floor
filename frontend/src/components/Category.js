import React from 'react'

function Category({category, chooseCategory }) {
  var id = category.id,
      img = category.image,
      name = category.caption.ru
  return (
    <div className='products__item-wrap' data-id={id}>
      <div className='products__item'>
        <div className='product'>
          <div className='product__image-wrap'>
            <div className='product__image'>
              <img src={img} alt='' />
              <div className='product__apply' data-close>
                <div className='modal__btn modal__btn_small' onClick={()=>chooseCategory(id)}>Выбрать</div>
              </div>
            </div>
          </div>
          <div className='product__desc'>
            <div className='product__title'>{name}</div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Category