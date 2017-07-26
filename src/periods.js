import React, {Component} from 'react'
import styled from 'styled-components'
import auto_bind from 'common/auto_bind'
import {color, card, link} from 'common/styles'
import moment from 'common/moment'
import event_system from 'common/event_system'
import {period_height} from './period'

export default class Periods extends Component {
  constructor(props) {
    super(props)
    auto_bind(this)
  }

  render_period(period, id) {
    return (
      <PeriodWrapper key={id}>
        {period.render()}
      </PeriodWrapper>
    )
  }

  render_periods(periods) {
    return (
      <Content>
        {periods.map(this.render_period)}
      </Content>
    )
  }

  show_week() {
    const week = moment(this.props.periods[0].start).startOf('week')
    event_system.post('calendar-week', week)
    event_system.trigger('calendar-show-week')
  }

  render() {
    const {ellipsis, periods} = this.props
    if (periods.length == 0) {
      return null
    }
    if (ellipsis && periods.length > ellipsis) {
      return (
        <Container>
          {this.render_periods(periods.slice(0, ellipsis - 1))}
          <Ellipsis onClick={this.show_week}>
            + {periods.length - ellipsis + 1}
          </Ellipsis>
        </Container>
      )
    }
    return this.render_periods(periods)
  }
}


const Container = styled.div`
`
const Content = styled.div`
  margin: 3px;
  ${card}
  padding: 0;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  position: relative;
`
const Ellipsis = styled.div`
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  ${link}
  color: ${color('action')};
  font-size: 18px;
`
const PeriodWrapper = styled.div`
  height: ${period_height}px;
  position: relative;
  border-bottom: solid 1px ${color('black', 'translucent')};

  &:last-of-type {
    border-bottom-style: none;
  }
`
