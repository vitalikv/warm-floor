import React from 'react'

import warnImg from '../../svg/grey-600.svg';

const WarningModal = ({ text, accept, decline, handleAccept, handleDecline }) => (
  <div className='warning'>
    <div className='warning__body'>
      <div className='warning__image'><img src={warnImg} alt='warning' /></div>
      <div className='warning__text'>{text}</div>
    </div>
    <div className='warning__buttons'>
      <div className='modal__btn warning__decline warning__btn' onClick={handleDecline}>{decline}</div>
      <div className='modal__btn warning__accept warning__btn' onClick={handleAccept}>{accept}</div>
    </div>
  </div>
)

export default WarningModal