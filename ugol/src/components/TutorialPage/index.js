import React from 'react'

const TutorialPage = ({ name, image, text, next, pages, page, handlePageChange }) => {
  let nextPage = (page < pages.length-1) ? page+1 : false;
  return (
    <div className='tutorial'>
      <div className='tutorial__body'>
        <div className='tutorial__header'>{name}</div>
        <div className='tutorial__text'>{text}</div>
        <div className='tutorial__image'><img src={image} alt={name} /></div>
        <ul className='tutorial__pages'>
          {pages.map(p => (
            <li
              key={p.id}
              className={(p.id == page) ? 'tutorial__page tutorial__page--active' : 'tutorial__page'}
              onClick={() => handlePageChange(p.id)}
            ></li>
          ))}
        </ul>
        <div className='tutorial__action'>
          <div className='modal__btn tutorial__action-btn' onClick={() => handlePageChange(nextPage)}>{next}</div>
        </div>
      </div>
    </div>)
}

export default TutorialPage