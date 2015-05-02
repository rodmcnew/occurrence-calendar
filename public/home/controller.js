var calendarApp = angular.module('calendarApp', []);

calendarApp.controller('HomeCtrl', function ($scope, $http, $location) {

    var months = [ 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec' ];
    var apiBase = '/api/calendars';

    $scope.weeks = [];
    $scope.habitDays = [];

    $http.get('/api/user').success(function(data){
        $scope.calendars=data.calendars;
        $scope.calendarId=$scope.calendars[0].id;
        $location.search('calendar', $scope.calendarId);
        $http.get(getApiUrl()).success(handleCalanderResonse);
    });

    if ($location.search().calendar) {
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
        var day = Date.today().add({ days: -365 });
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
        $http.put(getApiUrl() + '/' + day.id, {value: day.value});
    };
});
