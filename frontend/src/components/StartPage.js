import React from 'react'

import RadioSelect from './RadioSelect'

function StartPage({ handleChange, setCurrentModal }) {
  return (
    <div className='sp-cont'>
      <div className='sp-cont__header'>
        Сэкономьте время!
            </div>
      <div className='sp-cont__text'>
        Теперь можно не рисовать с нуля, просто<br />выберите подходящий тип планировки<br />или отдельной компанты и
              уточните её размеры.
            </div>
      <div className='sp-cont__filter'>
        <div className='filter__label'>
          Комнатность
              </div>
        <div className='rooms'>
          <RadioSelect options={[
            { name: 1, value: 'r1' },
            { name: '2', value: 'r2' },
            { name: '3', value: 'r3' },
            { name: '4+', value: 'r4' },
            { name: 'Студии', value: 'studio' },
            { name: 'Команты', value: 'komnaty' }
          ]} selected='' handleChange={handleChange} />
        </div>
      </div>
      <div className='sp-cont__btn'>
        <div className='modal__btn btn-icon-plan' data-group='room' data-nextpage='start-page-2' onClick={() => setCurrentModal('plans')}>
          Показать тип
              </div>
      </div>
    </div>
  )
}


export default StartPage