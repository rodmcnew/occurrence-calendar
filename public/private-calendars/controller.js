var calendarApp = angular.module('calendarApp', ['calendarHelpers']);

calendarApp.controller('HomeCtrl', function ($scope, $http, $location) {

    /**
     * Calendar's api base url
     *
     * @type {string}
     */
    var apiBase = '/api/calendars';

    /**
     * Handle api errors
     */
    function apiError(data) {
        if (data.error && data.error == 'notAuthenticated') {
            window.location.replace('/login/facebook');
            return
        }
        alert('Could not communicate with server. Check your internet Connection');
    }

    /**
     * Returns the calendar api url
     *
     * @returns {string}
     */
    function getApiUrl() {
        return apiBase + '/' + $location.search().calendar
    }

    /**
     * Handle the response for the current user data and load the users calendars
     *
     * @param data
     */
    function handleUserResponse(data) {
        $scope.calendars = data.calendars;
        $scope.calendarId = $scope.calendars[0].id;
        $location.search('calendar', $scope.calendarId).replace();
        $http.get(getApiUrl()).success(handleCalenderResponse).error(apiError);
    }

    /**
     * Handle the response for a given calendar and render it
     *
     * @param calendar
     */
    function handleCalenderResponse(calendar) {
        $scope.calendar = calendar;
        setTimeout(function () {
            window.scrollTo(0, 99999);
        }, 10);
    }

    /**
     * Ensure day value changes are saved on the server
     *
     * @param day
     */
    $scope.onDayChange = function (day) {
        var url = getApiUrl() + '/' + day.id;
        if (day.value == 1) {
            $http.put(url).error(apiError);
        } else {
            $http.delete(url).error(apiError);
        }
    };

    /**
     * Get the user's calendar list to start everything off
     */
    $http.get('/api/user').success(handleUserResponse).error(apiError);
});
