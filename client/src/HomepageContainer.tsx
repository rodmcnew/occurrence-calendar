import * as React from 'react';
import './App.css';
import {createCalendar} from './CalendarRepository';

class App extends React.Component {
    public handleCreateCalenderClick() {
        createCalendar().then(() => {
            alert(1)
        });
    }

    public render() {
        return (
            <div className="App">
                <button onClick={this.handleCreateCalenderClick}>Create Calender</button>
            </div>
        );
    }
}

export default App;
