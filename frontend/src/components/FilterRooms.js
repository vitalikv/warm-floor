import React from 'react'

import RadioSelect from './RadioSelect'

function FilterRooms({closeAction, options, selected, handleChange, data, filterData}) {
  return (
    <div className='modal__filter filter'>
      <div className='filter__label'>
        Комнатность
      </div>
      <div className='rooms'>
        <RadioSelect options={options} selected={selected} handleChange={handleChange} filterData={filterData} data={data}/>
      </div>
      <div className='filter__close' data-close onClick={closeAction}> </div>
    </div>
  )
}

export default FilterRooms