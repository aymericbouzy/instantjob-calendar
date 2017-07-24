import React, {Component} from 'react'
import ReactDOM from 'react-dom'
import Infinite from 'react-infinite'
// import {List, AutoSizer} from 'react-virtualized'
// import auto_bind from 'common/auto_bind'

export default class InfiniteList extends Component {
  constructor(props) {
    super(props)
    this.state = {
      height: 100,
    }
    this.update_dimensions = this.update_dimensions.bind(this)
    this.get_scroll_top = this.get_scroll_top.bind(this)
    this.scroll_to = this.scroll_to.bind(this)
    this.infinite_dom = null
  }

  static defaultProps = {
    item_height: 50,
  }

  componentDidMount() {
    this.update_dimensions()
    window.addEventListener('resize', this.update_dimensions)
    this.infinite_dom = ReactDOM.findDOMNode(this.infinite_list)
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.update_dimensions)
  }

  componentDidUpdate() {
    this.update_dimensions()
  }

  update_dimensions() {
    let height = this.wrapper.height
    if (height !== this.state.height) {
      this.setState({height})
    }
  }

  scroll_to(index) {
    this.infinite_dom.scrollTop = index
  }

  get_scroll_top() {
    return this.infinite_dom.scrollTop
  }

  render() {
    const {className, item_height, onInfiniteLoad, isInfiniteLoading, handle_scroll, children} = this.props
    return (
      <div ref={(wrapper) => this.wrapper = wrapper} className={className} style={{flex: 1, overflow: 'hidden'}}>
        <Infinite
          ref={(infinite_list) => this.infinite_list = infinite_list}
          containerHeight={this.state.height || 1}
          elementHeight={item_height}
          timeScrollStateLastsForAfterUserScrolls={200}
          onInfiniteLoad={onInfiniteLoad}
          isInfiniteLoading={isInfiniteLoading}
          infiniteLoadBeginEdgeOffset={200}
          handleScroll={handle_scroll}
        >
          {children}
        </Infinite>
      </div>
    )
  }

}

//
// export default class BetterList extends Component {
//   constructor(props) {
//     super(props)
//     auto_bind(this)
//   }
//
//   render_row({index, key, style}) {
//     const {children} = this.props
//     return (
//       <div key={key} style={style}>
//         {children[index]}
//       </div>
//     )
//   }
//
//   render() {
//     const {children, item_height, className} = this.props
//     return (
//       <AutoSizer>
//         {({height, width}) => (
//           <List
//             className={className}
//             height={height}
//             width={width}
//             rowCount={children.length}
//             rowHeight={item_height || 50}
//             rowRenderer={this.render_row}
//           />
//         )}
//       </AutoSizer>
//     )
//   }
// }
