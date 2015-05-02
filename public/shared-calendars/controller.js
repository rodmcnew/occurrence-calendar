var calendarApp = angular.module('calendarApp', []);

calendarApp.controller('CalendarCtrl', function ($scope, $http, $location) {

    var months = [ 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec' ];
    var apiBase = '/api/shared-calendars';

    $scope.weeks = [];
    $scope.habitDays = [];


    if ($location.search().calendar) {
        $http.get(getApiUrl()).success(handleCalanderResonse);
    } else {
        $http.post(apiBase).success(function (calendar) {
            $location.search('calendar', calendar.shareUrl);
            handleCalanderResonse(calendar);
            setTimeout(function () {
                alert('New calendar created!\n\nBookmark this URL to edit it later on any device that has this URL.\n\nTap a day to toggle its status. Changes are saved immediately.');
            }, 20)
        });
    }

    function getApiUrl() {
        return apiBase + '/' + $location.search().calendar
    }

    function getDayId(date) {
        return date.getUTCFullYear() + '-' + date.getUTCMonth() + '-' + date.getUTCDate();
    }

    function handleCalanderResonse(calendar) {
        $scope.habitDays = calendar.days;
        setupDays();
        setTimeout(function () {
            window.scrollTo(0, 99999);
        }, 10);
    }

    function setupDays() {
        var today = getDayId(Date.today());
        var day = Date.today().add({ days: -96 });
        var end = Date.today().add({ days: +7 });
        var foundFirstSun = false;
        var week = 0;
        while (day <= end) {
            if (day.getDay() == 0) {
                if (!foundFirstSun) {
                    foundFirstSun = true;
                }
                week++;
                $scope.weeks[week] = []
            }
            if (foundFirstSun) {
                var dayOfMonth = day.getUTCDate();
                var dayId = getDayId(day);

                var value = 0;
                if ($scope.habitDays[dayId]) {
                    value = $scope.habitDays[dayId];
                }

                var month = day.getUTCMonth();

                var dayText = dayOfMonth;
                if (dayOfMonth == 1) {
                    dayText = months[month] + ' ' + dayOfMonth;
                }

                var newDay = {
                    dayText: dayText,
                    oddMonth: month % 2 == 1,
                    today: dayId == today,
                    id: dayId,
                    value: value
                };
                $scope.weeks[week].push(newDay);
            }
            day.add({ days: +1 });
        }
    }

    $scope.dayClick = function (day) {
        if (day.value == 1) {
            day.value = 0;
        } else {
            day.value = 1;
        }
        $http.put(getApiUrl() + '/days/' + day.id, {value: day.value});
    };
});
