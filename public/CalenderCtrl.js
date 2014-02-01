var calenderApp = angular.module('calenderApp', []);

var calenderId = 'FAWNIWt2Z1kZAhzj3rAi6g~Nu6EkW7GCZ2GCrlRPJaXyg';
var apiUrl = '//127.0.0.1:8080/api/calenders/';

calenderApp.controller('CalenderCtrl', function ($scope, $http, $anchorScroll) {
    $scope.weeks = [];

    $scope.habitDays = [];

    function getDayId(date) {
        return date.getUTCFullYear() + '-' + date.getUTCMonth() + '-' + date.getUTCDate();
    }

    $http.get(apiUrl + calenderId).success(
        function (result) {
            $scope.habitDays = result.days;
            console.log($scope.habitDays);
            setupDays();
            setTimeout(function(){window.scrollTo(0, 99999);},1);
        }
    );

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
                    console.log(dayId);
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
        $http.put(apiUrl + calenderId + '/days/' + day.id, {value: day.value});
    };

//    console.log($scope.weeks);

//    $scope.$apply();
});
