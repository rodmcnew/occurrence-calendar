var calendarHelpers = angular.module('calendarHelpers', []);
calendarHelpers.directive('occurrenceCalendar', function () {

    /**
     * Returns the dayId string for a given date in YYYY-MM-DD format
     *
     * @param date
     * @returns {string}
     */
    function getDayId(date) {
        return date.getUTCFullYear() + '-' + date.getUTCMonth() + '-' + date.getUTCDate();
    }

    /**
     * Builds the weeks array for rendering as rows
     *
     * @param $scope
     */
    function buildWeeks($scope) {
        // Prevent premature loading with no data
        if (!$scope.calendar) {
            return;
        }
        var months = [ 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec' ];

        var today = getDayId(Date.today());
        var day = Date.today().add({ days: -365-6 });
        var foundFirstSun = false;
        var week = 0;
        var weeks = [];
        var foundToday = false;
        var dayOfWeek = 0;
        // Ensure we end on a saturday
        while (!foundToday || dayOfWeek != 0) {
            day.add({ days: +1 });
            dayOfWeek = day.getDay();
            if (dayOfWeek == 0) {
                foundFirstSun = true;
                week++;
                weeks[week] = []
            }
            // Ensure we start on a sunday
            if (!foundFirstSun) {
                continue
            }
            var dayId = getDayId(day);
            if (dayId == today) {
                foundToday = true;
            }
            // Ensure we end on a saturday
            if (foundToday && dayOfWeek == 0) {
                break;
            }
            var dayOfMonth = day.getUTCDate();

            var value = 0;
            if ($scope.calendar.days[dayId]) {
                value = $scope.calendar.days[dayId];
            }
            var month = day.getUTCMonth();

            var dayText = dayOfMonth;
            if (dayOfMonth == 1) {
                dayText = months[month] + ' ' + dayOfMonth;
            }

            weeks[week].push({
                dayText: dayText,
                oddMonth: month % 2 == 1,
                today: dayId == today,
                id: dayId,
                value: value
            });

            $scope.weeks = weeks;
        }
    }

    /**
     * The link function for this directive. Runs when directive is loaded
     *
     * @param $scope
     */
    function link($scope) {
        // Build weeks when the parent scope.calendar is populated
        $scope.$watch('calendar', function () {
            buildWeeks($scope);
        });

        /**
         * Handler for clicks on a given day
         * @param day
         */
        $scope.dayClick = function (day) {
            if (day.value == 1) {
                day.value = 0;
            } else {
                day.value = 1;
            }
            // Let the parent controller know we need to save a change
            $scope.onDayChange(day);

        }
    }

    // Return the directive configuration
    return{
        link: link,
        restrict: 'E',
        scope: {
            'calendar': '=',
            'onDayChange': '='
        },
        template: '<table>' +
            '<tr ng-repeat="week in weeks">' +
            '<td ng-repeat="day in week" ng-click="dayClick(day)"' +
            ' ng-class="{oddMonth: day.oddMonth,today:day.today,occurrence: day.value==1}">' +
            '{{day.dayText}}' +
            '</td>' +
            '</tr>' +
            '</table>'
    }
});
