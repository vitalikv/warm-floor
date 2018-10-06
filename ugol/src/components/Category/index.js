import React from 'react'

const Category = ({ name, subCategories, handleClick }) => (
  <ul className='category'>
    <span className='category__title'>{name}</span>
    {typeof subCategories === 'object' && subCategories.map(category => {
      if (category.hidden === 'true') { return null }
      return (<li
        className='category__subcategory'
        key={category.id}
        onClick={() => handleClick(category.filters, category.name, name, category.id)}
      >
        <span className='category__subcategory-title'>{category.name}</span>
        <span className='category__lots_count'>{category.lotsCount}</span>
      </li>
      )
    })}
  </ul>
)

export default Category;