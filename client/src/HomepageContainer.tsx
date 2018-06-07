import * as React from 'react';
import './App.css';
import {createCalendar} from './calendarRepository';

class HomepageContainer extends React.Component {
    public handleCreateCalenderClick() {
        createCalendar().then((calendar: any) => { //@TODO remove ANY
            window.location.href = '/#/calendar/' + calendar.id + '/' + calendar.authorization;
        });
    }

    public render() {
        return (
            <div className="container">
                <br/>
                <button className="btn btn-primary" onClick={this.handleCreateCalenderClick}>Create Calender</button>
            </div>
        );
    }
}

export default HomepageContainer;
