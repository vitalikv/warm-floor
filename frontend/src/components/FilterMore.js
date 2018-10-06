import React from 'react'

function FilterMore({ closeAction }) {
  return (
    <div className='modal__filter filter'>
      <div className='filter__label'>
        Больше фильтов
              </div>
      <div className='filter__group'>
        <div className='filter__btn'>Показать</div>
      </div>
      <div className='filter__close' data-close onClick={closeAction}>

      </div>
    </div>
  )
}

export default FilterMore