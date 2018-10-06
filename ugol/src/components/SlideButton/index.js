import React from 'react'
import ReactSVG from 'react-svg'

const SlideButton = ({ handleClick, icon, caption }) => (
  <div className='slide-button' onClick={handleClick}>
    <div className='slide-button__icon'><ReactSVG path={icon} /></div>
    <div className='slide-button__caption'>{caption}</div>
  </div>
)

export default SlideButton