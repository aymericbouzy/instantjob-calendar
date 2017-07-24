import React, {Component} from 'react'
import styled, {css} from 'styled-components'
import InfiniteList from 'components/infinite_list'
import auto_bind from 'common/auto_bind'
import moment from 'common/moment'
import event_system from 'common/event_system'
import {range, capitalize_first_letter, debounce} from 'common/utilities'
import {color} from 'common/styles'
import get_week_periods from './get_week_periods'
import Periods from './periods'

function get_periods(periods, index) {
  return []
}

export default class Month extends Component {
  constructor(props) {
    super(props)
    auto_bind(this)
  }

  componentDidMount() {
    this.stop_retrieving_calendar_week = event_system.retrieve(`calendar-week`, (week) => {
      if (week !== this.week) {
        this.ignore_scroll = true
        this.list.scroll_to_item(this.get_index(week))
      }
    })
  }

  componentWillUnmount() {
    this.stop_retrieving_calendar_week()
  }

  render_day(index) {
    return (
      <WeekDay key={index}>
        {capitalize_first_letter(moment().startOf('week').add(index, 'day').format("dddd"))}
      </WeekDay>
    )
  }

  get_index(week) {
    return week.diff(moment().startOf('week'), 'week')
  }

  get_week(index) {
    return moment().startOf('week').add(index, 'weeks')
  }

  render_week(index) {
    const week = this.get_week(index)
    return (
      <Week key={index} week={week}>
        {get_week_periods(week)(this.props)}
      </Week>
    )
  }

  handle_scroll = debounce((scroll_top) => {
    if (this.ignore_scroll && (!this.current_scroll_top || Math.abs(this.current_scroll_top - scroll_top) > 5)) {
      this.current_scroll_top = scroll_top
    } else {
      this.current_scroll_top = null
      this.week = moment().add(scroll_top / week_height, 'week').endOf('week')
      event_system.post(`calendar-week`, this.week)
    }
  })

  render() {
    return (
      <Container>
        <Header>
          {range(7).map(this.render_day)}
        </Header>
        <InfiniteList
          item_height={week_height}
          handle_scroll={this.handle_scroll}
          ref={(list) => this.list = list}
          >
          {this.render_week}
        </InfiniteList>
      </Container>
    )
  }
}

class Week extends Component {
  constructor(props) {
    super(props)
    auto_bind(this)
  }

  get_day_date(index) {
    const day = moment(this.props.week).add(index, 'day')
    if (day.date() == 1) {
      return day.format("D MMMM")
    } else {
      return day.format("D")
    }
  }

  render_day(periods, index) {
    return (
      <DayContainer key={index}>
        <DayDate>
          {this.get_day_date(index)}
        </DayDate>
        <Periods periods={periods} ellipsis={2} />
      </DayContainer>
    )
  }

  render() {
    const {children: days} = this.props
    return (
      <WeekContainer>
        {days.map(this.render_day)}
      </WeekContainer>
    )
  }
}

const week_height = 120
const border = css`solid 1px ${color('black', 'pale')}`

const Container = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: stretch;
`
const Header = styled.div`
  height: 40px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  border-bottom: ${border};
`
const WeekContainer = styled.div`
  height: ${week_height}px;
  background-color: ${color('black', 'translucent')};
  border-bottom: ${border};
  border-left: ${border};
  display: flex;
`
const DayContainer = styled.div`
  width: ${100 / 7}%;
  border-right: ${border};
  display: flex;
  flex-direction: column;
  align-items: stretch;
`
const DayDate = styled.div`
  display: flex;
  justify-content: flex-end;
  padding: 2px 4px;
`
const WeekDay = styled.div`
  flex: 1;
  display: flex;
  justify-content: center;
`
