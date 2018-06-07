import * as React from 'react';

interface ErrorBannerProps {
    errorMessage: string,
}

const ErrorBanner: React.SFC<ErrorBannerProps> = (props) => {
    return <div>
        {props.errorMessage.length !== 0 && <div className="error-banner">
            <div className="alert alert-warning">
                {props.errorMessage}
            </div>
        </div>
        }
    </div>;
};

export default ErrorBanner;
