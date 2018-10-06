import React from 'react'
import LayoutCategory from '../LayoutCategory/'

import pic1 from '../../svg/pic-1.svg';
import pic2 from '../../svg/pic-2.svg';
import pic3 from '../../svg/pic-3.svg';
import pic4 from '../../svg/pic-4.svg';
// import picRoom from '../../svg/pic-room.svg';
import picStudio from '../../svg/pic-studio.svg';

const LayoutsCategoriesList = ({ categories, handleClick }) =>  {
  let pic = {
    4012: pic1,
    4016: pic2,
    4015: pic3,
    4034: pic4,
    4035: picStudio
  }
return(
  <div className='products'>
    <div className='products__container'>
      {categories[0] && categories[0].categories.map(category => (
        <LayoutCategory
          key={category.id}
          id={category.id}
          filters={category.filters}
          name={category.name}
          image={category.preview || pic[category.id]}
          handleClick={handleClick}
        />
      ))}
    </div>
  </div>)
}

export default LayoutsCategoriesList;