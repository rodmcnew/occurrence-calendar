import * as React from 'react';
import CalendarContainer from './CalendarContainer';
import HomepageContainer from './HomepageContainer';
import {HashRouter, Route} from 'react-router-dom';

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
