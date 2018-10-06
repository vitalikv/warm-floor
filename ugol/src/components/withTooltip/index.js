import React from 'react'
import ReactDOM from 'react-dom'

function withTooltip(WrappedComponent) {
  return class extends React.Component {

    constructor(props) {
      super(props);
      this.state = {
        tooltip: false,
        tooltipElement: this.props.element
      }
    }

    componentDidMount() {
      ReactDOM.findDOMNode(this).addEventListener('mouseenter', this.onMouseEnter.bind(this));
      ReactDOM.findDOMNode(this).addEventListener('mouseleave', this.onMouseLeave.bind(this));
      ReactDOM.findDOMNode(this).addEventListener('mousemove', this.onMouseMove.bind(this));
    }

    componentWillUnmount() {
      ReactDOM.findDOMNode(this).removeEventListener('mouseenter', this.onMouseEnter.bind(this));
      ReactDOM.findDOMNode(this).removeEventListener('mouseleave', this.onMouseLeave.bind(this));
      ReactDOM.findDOMNode(this).removeEventListener('mousemove', this.onMouseMove.bind(this));
      clearTimeout(this.timer);
    }

    onMouseEnter() {
      if (!this.state.tooltipElement) return;
      this.setState({ tooltip: true });
      this.state.tooltipElement.innerHTML = this.props.caption;
      this.timer = setTimeout(() => { this.state.tooltipElement.style.opacity = 1; }, 500);
    }

    onMouseLeave() {
      if (!this.state.tooltipElement) return;
      this.setState({ tooltip: false })
      this.state.tooltipElement.style.opacity = 0;
      clearTimeout(this.timer);
    }

    onMouseMove(e) {
      if (this.state.tooltip && this.state.tooltipElement) {
        if (e.clientX + this.state.tooltipElement.clientWidth < window.innerWidth) {
          this.state.tooltipElement.style.left = e.clientX + 'px';
        } else {
          this.state.tooltipElement.style.left = window.innerWidth - this.state.tooltipElement.clientWidth + 'px';
        }
        this.state.tooltipElement.style.top = e.clientY + 25 + 'px';
      }
    }

    render() {
      return <WrappedComponent {...this.props} />
    }
  }

}


export default withTooltip