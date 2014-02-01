var calenderApp = angular.module('calenderApp', []);

var apiBase = '/api/calendars';

calenderApp.controller('CalenderCtrl', function ($scope, $http, $location) {
    $scope.weeks = [];

    $scope.habitDays = [];


    if ($location.search().calendar) {
        $http.get(getApiUrl()).success(handleCalanderResonse);
    } else {
        $http.post(apiBase).success(function (calendar) {
            $location.search('calendar',calendar.id);
            handleCalanderResonse(calendar);
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
        }, 1);
    }

    function setupDays() {
        var today = getDayId(Date.today());
        var day = Date.today().add({ days: -90 });
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
                var month = day.getUTCMonth();
                var dayOfMonth = day.getUTCDate();
                var year = day.getUTCFullYear();
                var dayId = getDayId(day);

                var value = 0;
                if ($scope.habitDays[dayId]) {
                    value = $scope.habitDays[dayId];
                }
                var newDay = {dayOfMonth: dayOfMonth, month: month, today: dayId == today, id: dayId, value: value};
                $scope.weeks[week].push(newDay);
            }
            day.add({ days: +1 });
        }
    }

    $scope.dayClick = function (day) {
        day.value = day.value + 1;
        if (day.value > 3) {
            day.value = 0
        }
        $http.put(getApiUrl() + '/days/' + day.id, {value: day.value});
    };
});
