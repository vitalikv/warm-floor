import React from 'react'
import Category from '../Category/'

const CategoriesList = ({ categories, handleClick }) => (
  <div className='categories'>
    <div className='categories__container'>
      {categories.map(category => (
        <Category name={category.name} subCategories={category.categories} key={category.id} handleClick={handleClick} />
      ))}
    </div>
  </div>
)

export default CategoriesList;