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
    };

    public bottomElementRef: HTMLDivElement | null;

    public constructor(props: CalendarContainerProps) {
        super(props);
        this.setStateFromCalenderResponse = this.setStateFromCalenderResponse.bind(this);
        this.handleDayClick = this.handleDayClick.bind(this);
        this.state = {occurrences: [], weeks: [], errorMessage: ''};

        fetchCalendar(this.props.match.params.calendarId, this.props.match.params.authorization)
            .then(this.setStateFromCalenderResponse).catch((e) => {
            this.setState({errorMessage: e.toString()});
        });
    }

    public setStateFromCalenderResponse(calendar: Calendar) {
        const weeks = buildWeeks(calendar.occurrences);
        this.setState({occurrences: calendar.occurrences, weeks: weeks})
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
        this.setState({errorMessage: ''});
        putCalendarOccurrences(routeParams.calendarId, routeParams.authorization, occurrences)
            .then(this.setStateFromCalenderResponse)
            .catch((e) => {
                this.setState({errorMessage: e.toString()});
            });
    }

    public scrollToBottom() {
        if (this.bottomElementRef !== null) {
            this.bottomElementRef.scrollIntoView({behavior: 'smooth'});
        }
    }

    componentDidMount() {
        setTimeout(() => this.scrollToBottom(), 100);//would be nice to find way to remove timeout
    }

    public render() {
        return (
            <div className="calendar">
                <MetaTags>
                    <meta name="viewport" content="user-scalable=0"/>
                </MetaTags>
                {this.state.errorMessage.length === 0 && this.state.occurrences.length === 0 &&
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
