import React from 'react'

function FilterColor() {
  return (
    <div className='modal__filter filter'>
      <div className='filter__label'>
        Цвет
              </div>
      <div className='colors'>
        <div className='filter__group r-select' data-action='color' data-selected=''>
          <div className='r-select__option'><span className='filter__color color_red'></span></div>
          <div className='r-select__option'><span className='filter__color color_orange'></span></div>
          <div className='r-select__option'><span className='filter__color color_yellow'></span></div>
          <div className='r-select__option'><span className='filter__color color_green'></span></div>
          <div className='r-select__option'><span className='filter__color color_blue'></span></div>
          <div className='r-select__option'><span className='filter__color color_purple'></span></div>
          <div className='r-select__option'><span className='filter__color color_circle'></span></div>
        </div>
      </div>
      <div className='filter__close'>

      </div>
    </div>
  )
}

export default FilterColor;