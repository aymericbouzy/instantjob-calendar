import React, {Component} from 'react'
import styled, {css} from 'styled-components'
import Periods from './periods'
import get_week_periods from './get_week_periods'
import auto_bind from 'common/auto_bind'
import moment from 'moment'
import event_system from 'common/event_system'
import {capitalize_first_letter} from 'common/utilities'
import {color} from 'common/styles'

export default class Week extends Component {
  constructor(props) {
    super(props)
    this.state = {
      week: moment(),
    }
    auto_bind(this)
  }

  componentDidMount() {
    this.stop_retrieving_calendar_week = event_system.retrieve('calendar-week', (week) => {
      this.setState({week})
      this.props.load_between({start: this.start(), end: this.end()})
    })
  }

  componentWillUnmount() {
    this.stop_retrieving_calendar_week()
  }

  start() {
    return moment(this.state.week).startOf('week')
  }

  end() {
    return moment(this.state.week).endOf('week')
  }

  get_days() {
    const start = this.start()
    return get_week_periods(start)(this.props).map((periods, index) => ({
      periods,
      date: moment(start).add(index, 'day'),
    }))
  }

  render_day(day, index) {
    return <Day key={index} {...day} />
  }

  render() {
    return (
      <Container>
        {this.get_days().map(this.render_day)}
      </Container>
    )
  }
}

class Day extends Component {
  constructor(props) {
    super(props)
    auto_bind(this)
  }

  render() {
    const {date, periods} = this.props
    return (
      <DayContainer>
        <Header>
          <WeekDay>
            {capitalize_first_letter(date.format('dddd'))}
          </WeekDay>
          <FullDate>
            {date.format('D/M')}
          </FullDate>
        </Header>
        <Content>
          <Periods periods={periods} extended/>
        </Content>
      </DayContainer>
    )
  }
}

const border = css`solid 1px ${color('black', 'pale')}`

const Container = styled.div`
  flex: 1;
  display: flex;
  align-items: stretch;
`
const DayContainer = styled.div`
  flex: 1;
  display: flex;
  align-items: stretch;
  flex-direction: column;
`
const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  border-bottom: ${border};
`
const WeekDay = styled.div``
const FullDate = styled.div`
  font-size: 12px;
`
const Content = styled.div`
  border-left: ${border};
  background-color: ${color('black', 'translucent')};
  flex: 1;
  overflow-x: hidden;
  overflow-y: auto;

  &:last-of-type {
    border-right: ${border};
  }
`
