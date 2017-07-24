import React, {Component} from 'react'
import styled, {css} from 'styled-components'
import {connect} from 'react-redux'
import {MdKeyboardArrowLeft, MdKeyboardArrowRight} from 'react-icons/lib/md'
import FilterableList from 'components/filterable_list/filterable_list'
import {get_filters_and_deals} from 'components/deals_list'
import Filters from 'components/filterable_list/filters'
import FiltersTitle from 'components/filterable_list/filters_title'
import SidePanel from 'components/utils/side_panel'
import Button from 'components/utils/button'
import {get_initial_state} from 'components/deals_list'
import Month from './month'
import Week from './week'
import auto_bind from 'common/auto_bind'
import persistent_state from 'common/persistent_state'
import {color, link} from 'common/styles'
import event_system from 'common/event_system'
import moment from 'common/moment'
import {capitalize_first_letter} from 'common/utilities'
import {get_missions_fields} from 'selectors/fields'
import {get_recruiters} from 'selectors/recruiters'

class Calendar extends Component {
  constructor(props) {
    super(props)
    this.state = persistent_state.get(props.persistent_state_key, {
      ...FilterableList.initial_state,
      ...get_initial_state(props),
      month_view: true,
    })
    auto_bind(this)
  }

  componentDidMount() {
    this.unregister_show_week = event_system.register('calendar-show-week', this.show_week)
  }

  componentWillUnmount() {
    this.unregister_show_week()
    persistent_state.store(this.props.persistent_state_key, this.state)
  }

  static defaultProps = {
    missions: [],
    other_eventables: [],
    get_mission_elements() {
      return {
        icon: '!',
        color: 'pink',
      }
    },
  }

  set_state(arg) {
    this.setState(arg)
  }

  get_filters_and_missions() {
    const {missions, fields, workplaces, recruiters, get_mission_elements} = this.props
    const {deals: filtered_missions, filters} = get_filters_and_deals({
      deals: missions,
      fields,
      workplaces,
      recruiters,
      state: this.state,
      setState: this.set_state,
    })
    return {
      missions: filtered_missions.map((mission) => ({
        ...mission,
        ...get_mission_elements(mission),
      })),
      filters,
    }
  }

  open_filters() {
    this.filters.open()
  }

  show_month() {
    this.setState({month_view: true})
  }

  show_week() {
    this.setState({month_view: false})
  }

  render() {
    const {action, other_eventables} = this.props
    const {missions, filters} = this.get_filters_and_missions()
    const {month_view} = this.state
    const View = month_view ? Month : Week
    return (
      <Container>
        <Filters component={SidePanel} componentRef={(filters) => this.filters = filters}>
          {filters}
        </Filters>
        <Header>
          <ToggleFilters onClick={this.open_filters}>
            <FiltersTitle />
          </ToggleFilters>
          <Side>
            <Action onClick={this.show_month} selected={month_view}>
              Mois
            </Action>
            <Action onClick={this.show_week} selected={!month_view}>
              Semaine
            </Action>
            <Navigation month_view={month_view}/>
            <Button {...action} />
          </Side>
        </Header>
        <View>
          {[
            ...missions,
            ...other_eventables,
          ]}
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
    const {week} = this.state
    if (this.props.month_view) {
      return capitalize_first_letter(week.format("MMMM"))
    } else {
      const start = moment(week).startOf('week'), end = moment(week).endOf('week')
      return `${start.format("D MMM")} - ${end.format("D MMM")}`
    }
  }

  componentDidMount() {
    this.stop_retrieving_calendar_week = event_system.retrieve(
      `calendar-week`,
      (week) => this.setState({week})
    )
  }

  componentWillUnmount() {
    this.stop_retrieving_calendar_week()
  }

  navigate_to(day) {
    event_system.post(`calendar-week`, moment(day).startOf('week'))
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

export default connect(
  (state) => ({
    fields: get_missions_fields(state),
    workplaces: state.missions.workplaces,
    recruiters: get_recruiters(state),
  })
)(Calendar)

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
  justify-content: space-between;
`
const Side = styled.div`
  display: flex;
  align-items: center;
  font-weight: 500;
  color: ${color('black', 'light')};
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
