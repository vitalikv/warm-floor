import React from 'react'
import ReactSVG from 'react-svg'

import ProjectName from './ProjectName'

import backBtn from '../images/icons/back-btn.svg'
import refreshBtnSVG from '../images/icons/refresh-btn.svg'
import logo from '../images/pop-logo.svg'

function Header({ projectName, price, updateEstimate, changeName, userName, isLoading }) {
  function historyBack() {
    if (window.history.length > 1) {
      window.history.back();
    } else {
      window.location.href = 'https://planoplan.com/ru/projects/?ssl=1';
    }
  }
  return (<div className='header'>
    <div className='header__logo-wrap header__section'>
      <div className='header__logo'>
        <a href='#'>
          <div className='logo'><ReactSVG path={logo} /></div>
        </a>
      </div>
      <div className='header__back-btn' onClick={historyBack}>
        <ReactSVG path={backBtn} />
      </div>
    </div>
    <div className='header__main header__section'>
      <ProjectName value={projectName} changeName={changeName} />
      <HeaderPrice value={price} updateEstimate={updateEstimate} isLoading={isLoading} />
    </div>
    <div className='header__user-info header__section'>
      <div className='user'>
        <div className='user__ava'>
        </div>
        <div className='user__name'>{userName}</div>
        <div className='user__arrow'></div>
      </div>
    </div>
  </div>)
}

function HeaderPrice({ value, updateEstimate, isLoading }) {
  const price = (value) ? value.toString().replace(/(\d)(?=(\d\d\d)+([^\d]|$))/g, '$1 ') : '';
  const priceClassName = (!isLoading) ? 'price__refresh' : 'price__refresh price__loading'

  const refreshBtn = (<div className={priceClassName} onClick={() => updateEstimate()}>
    <ReactSVG path={refreshBtnSVG} />
  </div>)
  return (
    <div className='header__price' >
      <div className='price'>
        {refreshBtn}
        <div className='price__value'>
          {price} <span className='ic-rur'></span>
        </div>
      </div>
    </div >
  )
}

export default Header