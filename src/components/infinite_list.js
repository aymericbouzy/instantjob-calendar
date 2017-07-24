import React, {Component} from 'react'
import List from 'components/list'
import auto_bind from 'common/auto_bind'
import {range} from 'common/utilities'

const count = 100

export default class InfiniteList extends Component {
  constructor(props) {
    super(props)
    this.state = {
      offset: -10,
      loading: false,
    }
    auto_bind(this)
  }

  static defaultProps = {
    handle_scroll() {},
  }

  componentDidMount() {
    this.scroll_to_item(0)
  }

  componentDidUpdate() {
    if (this.should_run_after_updating) {
      this.should_run_after_updating()
      this.should_run_after_updating = false
    }
  }

  add_items_bottom() {
    this.setState({loading: true})
    this.should_run_after_updating = () => {
      this.setState(({offset}) => ({offset: offset + 1, loading: false}))
    }
  }

  add_items_top() {
    this.setState({loading: true})
    this.should_run_after_updating = () => {
      this.setState(({offset}) => ({offset: offset - 1, loading: false}))
    }
  }

  add_items_top_if_necessary(node) {
    const {scrollTop} = node
    const {item_height} = this.props
    if (scrollTop < 10 * item_height) {
      this.add_items_top()
      setTimeout(() => {
        this.add_items_top_if_necessary(node)
      }, 50)
    }
  }

  scroll_to_item(index) {
    this.setState({offset: index - 10})
    this.should_run_after_updating = () => this.list.scroll_to(10 * this.props.item_height)
  }

  render_item(index) {
    const {item_height, children: render_item} = this.props
    return (
      <div key={index} style={{height: item_height}}>
        {render_item(index)}
      </div>
    )
  }

  handle_scroll(node) {
    this.add_items_top_if_necessary(node)
    const {handle_scroll, item_height} = this.props
    handle_scroll(node.scrollTop + this.state.offset * item_height)
  }

  render() {
    const {item_height} = this.props
    const {loading, offset} = this.state
    return (
      <List
        item_height={item_height}
        handle_scroll={this.handle_scroll}
        onInfiniteLoad={this.add_items_bottom}
        isInfiniteLoading={loading}
        ref={(list) => this.list = list}
        >
        {range(offset, count + offset).map(this.render_item)}
      </List>
    )
  }
}
