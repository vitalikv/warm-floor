import React from 'react'
import Lot from '../Lot/'
import withTooltip from '../withTooltip'
class Products extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      page: 0,
      pageBreakpoints: {
        0: {
          start: 0,
          end: false,
          page: 0
        }
      }
    }
  }

  componentDidMount() {
    this.scrollContainer = this.elements.parentNode;
    this.scrollContainer.addEventListener('scroll', this.onScroll.bind(this))
    this.scrollContainer.addEventListener('mousewheel', this.onWheel.bind(this))
    this.page = this.props.page;
    this.lastPage = this.props.page;
  }

  componentWillUnmount() {
    this.scrollContainer.removeEventListener('scroll', this.onScroll.bind(this))
    this.scrollContainer.removeEventListener('mousewheel', this.onWheel.bind(this))
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.lots.length < this.props.lots.length) {
      this.scrollContainer.scrollTop = 0;
      this.setState({
        pageBreakpoints: {
          0: {
            start: 0,
            end: false,
            page: 0
          }
        }
      });
    }
    this.page = nextProps.page;
  }

  onWheel(e) {
    if (e.deltaY > 0) {
      this.onScroll();
    }
  }

  onScroll() {
    let scrollHeight = this.scrollContainer.scrollHeight;
    let height = this.scrollContainer.clientHeight;
    let scrollTop = this.scrollContainer.scrollTop;

    if (Object.keys(this.state.pageBreakpoints).length === 1 &&
      !this.state.pageBreakpoints[this.props.page]) {
      let newPage = {};
      let page = this.props.page;
      newPage[page] = {
        start: 0,
        end: false,
        page: page
      }
      this.setState({
        pageBreakpoints: { ...newPage }
      });
      return;
    }

    for (let i in this.state.pageBreakpoints) {
      let bp = this.state.pageBreakpoints[i];
      if (((bp.start < scrollTop && bp.end > scrollTop) ||
        (bp.start < scrollTop && !bp.end)) && bp.page !== this.props.page) {
        this.props.setPage(bp.page);
      }
    }

    if (scrollHeight - height <= scrollTop && !this.props.fetchingLots && this.props.page !== this.props.pages) {
      // this.pageDist = scrollTop;
      let page = this.props.page || 0;
      if (!this.state.pageBreakpoints[page].end) {
        this.setState(prevState => {
          prevState.pageBreakpoints[page].end = scrollTop;
          return {
            pageBreakpoints: { ...prevState.pageBreakpoints }
          }
        })
      }
      ++page;
      const newPoint = {};
      newPoint[page] = {};
      newPoint[page].start = scrollTop;
      newPoint[page].page = page;
      this.setState(prevState => ({ pageBreakpoints: { ...prevState.pageBreakpoints, ...newPoint } }));
      this.props.loadMore();
    }

  }

  render() {
    const { lots, activeLot, handleClick } = this.props;
    return (
      <div className='products' ref={(elements) => this.elements = elements}>
        <div className='products__container'>
          {lots && lots.map(lot => (
            <LotWithHover
              id={lot.id}
              key={lot.id}
              price={lot.price}
              image={lot.preview}
              caption={lot.caption}
              handleClick={handleClick}
              name={lot.shortName || lot.caption || lot.name}
              lotGroup={lot.lotGroup}
              type={lot.type}
              typeOnPlan={lot.typeOnPlan}
              size={lot.size}
              modifiers={lot.modifiers}
              allModifiers={lot.allModifiers}
              activeLot={activeLot}
              element={this.tooltip}
            />
          ))}
        </div>
        <div ref={tooltip => this.tooltip = tooltip} id='product-tooltip' className='product__tooltip'></div>
      </div>
    )
  }
}

const LotWithHover = withTooltip(Lot);

export default Products