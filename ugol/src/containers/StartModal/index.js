import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import modalWindows from '../../helpers/modalWindows'

import * as appActions from '../../actions/index'

import planImg from '../../images/pic-plan.jpg'
import drawImg from '../../images/pic-draw.jpg'

class StartModal extends React.Component {

  constructor(props) {
    super(props);

    this.handleClick = this.handleClick.bind(this);
    this.openModal = this.props.openModal.bind(this);
    this.setModalHeader = this.props.setModalHeader.bind(this);
    this.setPreviousPage = this.props.setPreviousPage.bind(this);
    this.closeModal = this.props.closeModal.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.setLibrary = this.props.setLibrary.bind(this);
  }

  componentDidMount() {
    this.setModalHeader(modalWindows[this.props.modal.window].name)
  }


  handleClick() {
    this.setPreviousPage(this.props.modal.window);
    this.setLibrary(modalWindows[modalWindows[this.props.modal.window].nextModal].library);
    this.openModal(modalWindows[this.props.modal.window].nextModal)
  }

  render() {

    return (
      <div className='start-modal'>
        <div className='start-modal__half'>
          <div className='start-modal__image'>
            <img src={drawImg} alt='pic' />
          </div>
          <div className='start-modal__desc'>
            Создайте свою планировку самостоятельно
          </div>
          <div className='start-modal__button'>
            <div className='modal__btn' onClick={this.closeModal}>Нарисовать с нуля</div>
          </div>
        </div>
        <div className='start-modal__half'>
          <div className='start-modal__image'>
            <img src={planImg} alt='pic' />
          </div>
          <div className='start-modal__desc'>
            Сэкономьте время, просто подберите<br /> подходящий тип планировки или отдельной<br /> комнаты и уточните её размеры
          </div>
          <div className='start-modal__button'>
            <div className='modal__btn' onClick={this.handleClick}>Выбрать из каталога</div>
          </div>
        </div>
      </div>
    )
  }
}


function mapStateToProps(state) {
  return { ...state }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(appActions, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(StartModal)
