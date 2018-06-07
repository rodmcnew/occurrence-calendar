var calendarApp = angular.module('calendarApp', ['calendarHelpers']);

calendarApp.controller('CalendarCtrl', function ($scope, $http, $location) {

    /**
     * Calendar's api base url
     *
     * @type {string}
     */
    var apiBase = '/api/shared-calendars';


    function apiError() {
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
     * Create a new calendar or load the one given in the URL
     */
    if ($location.search().calendar) {
        $http.get(getApiUrl()).success(handleCalenderResponse);
    } else {
        $http.post(apiBase).success(function (calendar) {
            $location.search('calendar', calendar.shareUrl).replace();
            handleCalenderResponse(calendar);
            setTimeout(function () {
                alert('New calendar created!\n\nBookmark this page to access your calendar later.\n\nTap a day to toggle its status. Changes are saved immediately.');
            }, 20)
        }).error(apiError);
    }
});
