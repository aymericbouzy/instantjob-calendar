import React, {Component} from 'react'
import styled from 'styled-components'
import {color, link, card, circle, ellipsis} from 'common/styles'
import moment from 'common/moment'

export default ({start, end, onClick, color, icon, title, information}) => (
  <PeriodContainer onClick={onClick}>
    <Status>
      <Badge color={color || 'pink'}>
        {icon || '!'}
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

export const period_height = 60
const status_radius = 40
export function display_period(start, end) {
  if (end.diff(start, 'hour') == 24) {
    return 'Toute la journée'
  }
  function format_time(time) {
    const hours = time.hours()
    const result = `${hours}h`
    if (time.minutes()) {
      return `${result}${time.format('mm')}`
    }
    if (hours == 0) {
      return 'minuit'
    }
    return result
  }
  end = moment(end).add(1, 'second').startOf('minute')
  return `${format_time(start)} - ${format_time(end)}`
}

const PeriodContainer = styled.div`
  ${ellipsis('calc(100% - 10px)')}
  ${({onClick}) => onClick ? link : ''}
  height: ${period_height}px;
  display: flex;
  align-items: stretch;
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
