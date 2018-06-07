import * as React from 'react';
import {createCalendar} from '../service/calendarRepository';
import ErrorMessageBanner from './ErrorMessageBanner';
import Calendar from '../model/Calendar';

class HomepageContainer extends React.Component {
    public state: {
        errorMessage: string;
    };

    public constructor(props: any) {
        super(props);
        this.handleCreateCalenderClick = this.handleCreateCalenderClick.bind(this);
        this.state = {errorMessage: ''};
    }

    public handleCreateCalenderClick() {
        this.setState({errorMessage: ''});
        createCalendar().then((calendar: Calendar) => {
            window.location.href = '/#/calendar/' + calendar.id + '/' + calendar.authorization;
        }).catch((e) => {
            this.setState({errorMessage: e.toString()});
        });
    }

    public render() {
        return (
            <div>
                <ErrorMessageBanner errorMessage={this.state.errorMessage}/>
                <div className="container-fluid homepage">
                    <div className="row">
                        <h2 className="col-sm-12 text-center">Occurrence Calendar</h2>
                    </div>
                    <div className="row">
                        <div className="col-sm-6 col-sm-offset-3">
                            <div className="panel panel-default">
                                <div className="panel-heading text-center">
                                    <h3 className="panel-title">Create a Secret URL Calendar</h3>
                                </div>
                                <div className="panel-body">
                                    <div>
                                        Anyone with the URL can view and edit the calendar.
                                    </div>
                                    <ul>
                                        <li>Calendar can be shared</li>
                                        <li>No login required</li>
                                    </ul>
                                    <div className="button-container">
                                        <button className="btn btn-primary" onClick={this.handleCreateCalenderClick}>
                                            Create Secret URL Calendar
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-sm-12 text-center">
                            Occurrence Calendar is an <a href="https://github.com/rodmcnew/occurrence-calendar">
                            open source</a> project.
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default HomepageContainer;
