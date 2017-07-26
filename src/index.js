import React, {Component} from 'react'
import styled, {css} from 'styled-components'
import {MdKeyboardArrowLeft, MdKeyboardArrowRight} from 'react-icons/lib/md'
import moment from 'common/moment'
import Month from './month'
import Week from './week'
import auto_bind from 'common/auto_bind'
import {color, link} from 'common/styles'
import event_system from 'common/event_system'
import {capitalize_first_letter, property_getter} from 'common/utilities'
import tolerant_selector from 'common/tolerant_selector'

const get_missions = tolerant_selector(
  [property_getter('missions'), property_getter('get_mission_elements')],
  (missions, get_mission_elements) => missions.map((mission) => ({
    ...mission,
    ...get_mission_elements(mission),
  }))
)

export default class Calendar extends Component {
  constructor(props) {
    super(props)
    this.state = {
      month_view: props.initial_view == 'month',
    }
    auto_bind(this)
  }

  componentDidMount() {
    this.unregister_show_week = event_system.register('calendar-show-week', this.show_week)
  }

  componentWillUnmount() {
    this.unregister_show_week()
  }

  static defaultProps = {
    missions: [],
    other_eventables: [],
    get_mission_elements() {
      return {}
    },
    initial_view: 'month',
  }

  show_month() {
    this.setState({month_view: true})
  }

  show_week() {
    this.setState({month_view: false})
  }

  render() {
    const {children, className, style, render_shift} = this.props
    const {month_view} = this.state
    const View = month_view ? Month : Week
    return (
      <Container className={className} style={style}>
        <Header>
          <Action onClick={this.show_month} selected={month_view}>
            Mois
          </Action>
          <Action onClick={this.show_week} selected={!month_view}>
            Semaine
          </Action>
          <Navigation month_view={month_view}/>
          {children}
        </Header>
        <View render_shift={render_shift}>
          {get_missions(this.props)}
        </View>
      </Container>
    )
  }
}

class Navigation extends Component {
  constructor(props) {
    super(props)
    this.state = {
      week: moment()
    }
    auto_bind(this)
  }

  translate(by) {
    const unit = this.props.month_view ? 'month' : 'week'
    this.navigate_to(moment(this.state.week).startOf(unit).add(by, unit))
  }

  show_previous() {
    this.translate(-1)
  }

  show_next() {
    this.translate(1)
  }

  show_today() {
    this.navigate_to(moment())
  }

  get_time() {
    let {week} = this.state
    if (!week) {
      week = moment()
    }
    if (this.props.month_view) {
      return capitalize_first_letter(week.format('MMMM'))
    }
    const start = moment(week).startOf('week'), end = moment(week).endOf('week')
    return `${start.format('D MMM')} - ${end.format('D MMM')}`
  }

  componentDidMount() {
    this.stop_retrieving_calendar_week = event_system.retrieve(
      'calendar-week',
      (week) => this.setState({week})
    )
  }

  componentWillUnmount() {
    this.stop_retrieving_calendar_week()
  }

  navigate_to(day) {
    event_system.post('calendar-week', moment(day).startOf('week'))
  }

  render() {
    return (
      <NavigationContainer>
        <Arrow onClick={this.show_previous}>
          <MdKeyboardArrowLeft />
        </Arrow>
        <Time month_view={this.props.month_view}>
          {this.get_time()}
        </Time>
        <Arrow onClick={this.show_next}>
          <MdKeyboardArrowRight />
        </Arrow>
        <Action onClick={this.show_today}>
          Aujourd'hui
        </Action>
      </NavigationContainer>
    )
  }
}

const Container = styled.div`
  flex: 1;
  position: relative;
  display: flex;
  align-items: stretch;
  flex-direction: column;
  padding: 0 10px;
`
const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  font-weight: 500;
  color: ${color('black', 'light')};
  min-height: 65px;
  font-size: 16px;
`
const Action = styled.div`
  ${link}
  margin: 0 20px;
  ${({selected}) => selected ? css`
    color: ${color('action')};
  ` : ''}
`
const Arrow = styled.div`
  ${link}
  margin: 0 10px;
  font-size: 20px;
`
const Time = styled.div`
  width: 120px;
  display: flex;
  justify-content: center;
  font-size: ${({month_view}) => month_view ? '18px' : '14px'};
`
const ToggleFilters = styled.div`
  ${link}
`
const NavigationContainer = styled.div`
  display: flex;
  align-items: center;
`
