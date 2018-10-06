import React from 'react'
import Layout from '../Layout/'

const LayoutsList = ({ lots, handleClick, handleApply }) => (
  <div className='products'>
    <div className='products__container'>
      {lots && lots.map(lot => (
        <Layout
          key={lot.id}
          image={lot.preview}
          id={lot.id}
          name={lot.shortName || lot.caption}
          caption={lot.caption}
          handleClick={handleClick}
          lotGroup={lot.lotGroup}
          type={lot.lotGroup}
          typeOnPlan={lot.typeOnPlan}
          handleApply={handleApply}
        />
      ))}
    </div>
  </div>
)

export default LayoutsList;