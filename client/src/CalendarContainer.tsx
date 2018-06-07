import * as React from 'react';
import './App.css';
import {fetchCalendar, putCalendarOccurrences} from './calendarRepository';
import buildWeeks from './buildWeeks'

interface Calendar { //@TODO move to separate file. and put "I" in front?
    id: string;
    authorization: string;
    occurrences: Array<string>;
}

interface Props {
    match: { params: { calendarId: string, authorization: string } };
}

function dayToClassNames(day: any) {//@TODO remove any
    const classNames = [];
    if (day.oddMonth) {
        classNames.push('oddMonth');
    }
    if (day.today) {
        classNames.push('today');
    }
    if (day.value === 1) {
        classNames.push('occurrence');
    }
    return classNames.join(' ');
}

class CalendarContainer extends React.Component<Props> {
    public state: {
        occurrences: Array<string>;
        weeks: any;//@todo remove any
    };

    public constructor(props: Props) {
        super(props);
        this.setStateFromCalenderResponse = this.setStateFromCalenderResponse.bind(this);
        this.state = {occurrences: [], weeks: []};
        //@TODO remove "any" and make calendar interface
        const routeParams = props.match.params;
        fetchCalendar(routeParams.calendarId, routeParams.authorization)
            .then(this.setStateFromCalenderResponse);
    }

    public setStateFromCalenderResponse(calendar: Calendar) {
        const weeks = buildWeeks(calendar.occurrences);
        this.setState({occurrences: calendar.occurrences, weeks: weeks})
    }

    public handleDayClick(day: any) {//@todo remove any
        console.log('handleDayClick', day);
        const occurrences = Array.from(this.state.occurrences);
        if (occurrences.indexOf(day.id) !== -1) {
            //If day already in occurrences, remove it
            occurrences.splice(occurrences.indexOf(day.id), 1);
        } else {
            //If day not in occurrences, add it
            occurrences.push(day.id);
        }
        const routeParams = this.props.match.params;
        putCalendarOccurrences(routeParams.calendarId, routeParams.authorization, occurrences)
            .then(this.setStateFromCalenderResponse);
    }

    public render() {
        console.log('render state', this.state);
        return (
            <table>
                <tbody>
                {this.state.weeks.map((days: any, weekIndex: number) => /* @TODO remove any */
                    <tr key={weekIndex}>
                        {days.map((day: any, dayIndex: number) => /* @TODO remove any */
                            <td key={dayIndex}
                                className={dayToClassNames(day)}
                                onClick={() => {
                                    this.handleDayClick(day)
                                }}>
                                {day.dayText}
                            </td>
                        )}
                    </tr>
                )}
                </tbody>
            </table>
        );
    }
}

export default CalendarContainer;
