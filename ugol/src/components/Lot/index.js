import React from 'react'
import makeThumbUrl from '../../helpers/makeThumbUrl'

const Lot = ({ image, type, typeOnPlan, lotGroup, id, name, price, caption, handleClick, activeLot, size, modifiers, allModifiers }) => {
  const productPrice = price && parseInt(price) !== 0 ? (<span>от {price} <span className='ic-rub'></span></span>) : 'нет в наличии';
  // const productPrice = null;
  const isActive = (id === activeLot);
  const button = isActive ? <InUse /> : <ApplyBtn />;
  return (
    <div className='products__item-wrap' data-id={id} onClick={() => !isActive && handleClick(type, lotGroup, typeOnPlan, id, name, image, price, caption, size, modifiers, allModifiers)}>
      <div className='products__item'>
        <div className={isActive ? 'product product--active' : 'product'}>
          <div className='product__image-wrap'>
            <div className='product__image'>
              <img src={makeThumbUrl(image, '148x148')} alt='' />
              {button}
            </div>
          </div>
          <div className='product__desc'>
            <div className='product__title'>{name}</div>
            <div className='product__price'>{productPrice}</div>
          </div>
        </div>
      </div>
    </div>
  )
}

const ApplyBtn = () => (
  <div className='product__apply'>
    <div className='modal__btn modal__btn_small modal__btn_apply'>
      Применить
    </div>
  </div>
)

const InUse = () => (
  <div className='product__in-use'>
    Используется
  </div>
)

export default Lot;