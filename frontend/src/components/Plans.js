import React from 'react'

import SimpleBar from 'simplebar'

class Plans extends React.Component {
  
  constructor(props) {
    super(props)

    this.state= {
      plans: []
    }
  }

  componentDidMount() {
    new SimpleBar(document.querySelector('.plans'));

    document.querySelector('.simplebar-track.vertical').style.visibility = 'visible';

    this.loadPlans()
  }

  loadPlans() {
    let newPlans = [];
    for (let i = 0; i < 21; i++) {
      newPlans.push({ ...plan, id: i })
    }
    this.setState({ plans: newPlans });
  }

  render() {
    return (
      <div className='plans'>
        <div className='plans__container'>
          {(this.state.plans) ? this.state.plans.map(p => <PlanItem key={p.id} image={p.image} area={p.area} applyAction={this.props.applyAction} />) : null}
        </div>
        <div className='plans__btn'>
          <div className='modal__btn modal__btn_shadow' data-close onClick={()=>this.props.closeAction()}>Создать свою</div>
        </div>
      </div >
    )
  }
}

function PlanItem({ image, area, applyAction }) {
  return (
    <div className='plans__item-wrap' onClick={()=>applyAction()}>
      <div className='plans__item'>{image}
          <div className='plans__area'>{area}</div>
      </div>
    </div>
  )
}

const plan = {
  'image': '...',
  'area': 15.56
}

export default Plans