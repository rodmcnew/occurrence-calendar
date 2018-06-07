import * as React from 'react';
import './App.css';
import HomepageContainer from './HomepageContainer'
import CalendarContainer from './CalendarContainer'
import {HashRouter, Route} from 'react-router-dom'

class App extends React.Component {
    public render() {
        return (
            <div className="App">
                <HashRouter>
                    <div>
                        <Route exact={true} path="/" component={HomepageContainer}/>
                        <Route exact={true} path="/calendar/:calendarId/:authorization" component={CalendarContainer}/>
                    </div>
                </HashRouter>
            </div>
        );
    }
}

export default App;
