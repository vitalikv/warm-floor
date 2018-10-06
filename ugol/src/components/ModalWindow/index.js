import React from 'react'

const ModalWindow = ({ backBtn, modal, filters, children, loader }) => {

  return (
    <div className='modal__window'>
      <div className='modal__header'>
        {backBtn}
        <div className='modal__title'>
          <div className='modal__category'>
            {modal.subTitle}
          </div>
          <div className='modal__name'>
            {modal.title}
          </div>
        </div>
        <div className='modal__header-body'>
          {filters.map(filter => filter.el ? <div key={filter.id}>{filter.el}</div> : null)}
        </div>
      </div>
      <div className='modal__body'>
          {loader}
        {children}
      </div>
    </div>
  )
}

export default ModalWindow