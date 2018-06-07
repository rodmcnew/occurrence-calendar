import * as React from 'react';
import Day from '../model/Day';

interface CalendarDayProps {
    onDayClick: (dayId: string) => void;
    day: Day;
    key: number;
}

function dayToClassNames(day: Day) {
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

class CalendarDay extends React.Component<CalendarDayProps> {
    public handleDayClick(dayId: string) {
        this.props.onDayClick(dayId);
    }

    public render() {
        return (
            <td key={this.props.key}
                className={dayToClassNames(this.props.day)}
                onClick={this.handleDayClick.bind(this, this.props.day.id)}>
                {this.props.day.dayText}
            </td>
        );
    }
}

export default CalendarDay;
