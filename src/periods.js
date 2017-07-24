import React, {Component} from 'react'
import styled from 'styled-components'
import auto_bind from 'common/auto_bind'
import {color, link, card, circle, ellipsis} from 'common/styles'
import moment from 'common/moment'
import event_system from 'common/event_system'

export default class Periods extends Component {
  constructor(props) {
    super(props)
    auto_bind(this)
  }

  render_periods(periods) {
    return (
      <Content>
        {periods.map((period, id) => <Period {...period} key={id} />)}
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

const Period = ({start, end, onClick, color, icon, title, information}) => (
  <PeriodContainer onClick={onClick}>
    <Status>
      <Badge color={color}>
        {icon}
      </Badge>
    </Status>
    <Main>
      <Title>
        {title}
      </Title>
      <More>
        <Time>
          {display_period(start, end)}
        </Time>
        {information}
      </More>
    </Main>
  </PeriodContainer>
)

const period_height = 48
const status_radius = 40
function display_period(start, end) {
  if (end.diff(start, 'hour') == 24) {
    return 'Toute la journée'
  }
  end = moment(end).add(1, 'second').startOf('minute')
  const start_hour = start.hours()
  const end_hour = end.hours() + 24 * end.diff(moment(start).startOf('day'), 'days')
  const start_minutes = start.minutes() ? start.format('mm') : ''
  const end_minutes = end.minutes() ? end.format('mm') : ''
  return `${start_hour}h${start_minutes} - ${end_hour}h${end_minutes}`
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
const PeriodContainer = styled.div`
  ${({onClick}) => onClick ? link : ''}
  height: ${period_height}px;
  border-bottom: solid 1px ${color('black', 'translucent')};
  display: flex;
  align-items: stretch;

  &:last-of-type {
    border-bottom-style: none;
  }
`
const Main = styled.div`
  flex-grow: 1;
  flex-shrink: 1;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  justify-content: space-between;
  padding: 5px 0;
  margin-right: 10px;
  position: relative;
`
const Title = styled.div`
  ${ellipsis('100%')}
`
const More = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`
const Status = styled.div`
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  width: ${period_height}px;
`
const Badge = styled.div`
  ${circle(status_radius)}
  background-color: ${({color}) => color};
  color: white;
  font-size: ${status_radius * 0.6}px;
  display: flex;
  align-items: center;
  justify-content: center;
`
const Time = styled.div`
  font-size: 10px;
  color: ${color('black', 'light')};
`
