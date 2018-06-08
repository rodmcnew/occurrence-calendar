/// <reference path="../typings/react-meta-tags.d.ts" />

import * as React from 'react';
import {fetchCalendar, putCalendarOccurrences} from '../service/calendarRepository';
import buildWeeks from '../service/buildWeeks'
import CalendarWelcomeBanner from './CalendarWelcomeBanner';
import ErrorMessageBanner from './ErrorMessageBanner';
import CalendarDay from "./CalendarDay";
import Day from '../model/Day';
import Calendar from '../model/Calendar';
import MetaTags from 'react-meta-tags';

interface CalendarContainerProps {
    match: { params: { calendarId: string, authorization: string } };
}

class CalendarContainer extends React.Component<CalendarContainerProps> {
    public state: {
        occurrences: Array<string>;
        weeks: Array<Array<Day>>;
        errorMessage: string;
        loading: boolean;
    };

    public bottomElementRef: HTMLDivElement | null;

    public constructor(props: CalendarContainerProps) {
        super(props);
        this.setStateFromCalenderResponse = this.setStateFromCalenderResponse.bind(this);
        this.setStateFromErrorResponse = this.setStateFromErrorResponse.bind(this);
        this.handleDayClick = this.handleDayClick.bind(this);
        this.state = {occurrences: [], weeks: [], errorMessage: '', loading: true};

        fetchCalendar(this.props.match.params.calendarId, this.props.match.params.authorization)
            .then(this.setStateFromCalenderResponse).catch(this.setStateFromErrorResponse);
    }

    public setStateFromErrorResponse(error: any) {
        this.setState({errorMessage: error.toString(), loading: false});
    }

    public setStateFromCalenderResponse(calendar: Calendar) {
        const weeks = buildWeeks(calendar.occurrences);
        this.setState({occurrences: calendar.occurrences, weeks: weeks, loading: false})
    }

    public handleDayClick(dayId: string) {
        const occurrences = Array.from(this.state.occurrences);
        if (occurrences.indexOf(dayId) !== -1) {
            //If day already in occurrences, remove it
            occurrences.splice(occurrences.indexOf(dayId), 1);
        } else {
            //If day not in occurrences, add it
            occurrences.push(dayId);
        }
        const routeParams = this.props.match.params;
        this.setState({errorMessage: '', loading: true});
        putCalendarOccurrences(routeParams.calendarId, routeParams.authorization, occurrences)
            .then(this.setStateFromCalenderResponse).catch(this.setStateFromErrorResponse);
    }

    public scrollToBottom() {
        if (this.bottomElementRef !== null) {
            this.bottomElementRef.scrollIntoView({behavior: 'smooth'});
        }
    }

    componentDidMount() {
        setTimeout(() => this.scrollToBottom(), 500);//would be nice to find way to remove timeout
    }

    public render() {
        return (
            <div className="calendar">
                <MetaTags>
                    <meta name="viewport" content="user-scalable=0"/>
                </MetaTags>
                {!this.state.loading && this.state.errorMessage.length === 0 && this.state.occurrences.length === 0 &&
                <CalendarWelcomeBanner/>
                }
                <ErrorMessageBanner errorMessage={this.state.errorMessage}/>
                <table>
                    <tbody>
                    {this.state.weeks.map((days: Array<Day>, weekIndex: number) =>
                        <tr key={weekIndex}>
                            {days.map((day: Day, dayIndex: number) =>
                                <CalendarDay key={dayIndex} day={day} onDayClick={this.handleDayClick}/>
                            )}
                        </tr>
                    )}
                    </tbody>
                </table>
                <div ref={element => this.bottomElementRef = element}/>
            </div>
        );
    }
}

export default CalendarContainer;
