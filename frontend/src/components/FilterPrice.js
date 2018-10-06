import React from 'react'

function FilterPrice() {
  return (
    <div className='modal__filter filter'>
      <div className='filter__label'>
        Цена <span className='ic-rub'></span>/м<sup>2</sup>
      </div>
      <div className='filter__group' data-action='price'>
        <div className='input-field'>
          <div className='input-field__label'>от</div>
          <input type='text' className='input-field__input' placeholder='0' />
        </div>
        <div className='input-field'>
          <div className='input-field__label'>до</div>
          <input type='text' className='input-field__input' placeholder='3490' />
        </div>
      </div>
      <div className='filter__close'>

      </div>
    </div>
  )
}

export default FilterPrice