import * as React from 'react';

class CalendarWelcomeBanner extends React.Component {
    public render() {
        return (
            <div className="welcome-banner">
                <div className="alert alert-info">
                    Welcome to your calendar.
                    Bookmark the current URL to access your calendar later.
                    Tap a day to toggle its status.
                </div>
            </div>
        );
    }
}

export default CalendarWelcomeBanner;
