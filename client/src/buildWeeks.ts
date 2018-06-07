//@TODO clean this up FOR TS and ES6

import 'datejs' //Sets the "Date" global var

const DateJs = <any>Date; //@TODO get typings for DateJS https://stackoverflow.com/questions/14325774/use-datejs-in-typescript

/**
 * Returns the dayId string for a given date in YYYY-MM-DD format
 *
 * @param date
 * @returns {string}
 */
function getDayId(date: any) {//@TODO remove any
    return date.getUTCFullYear() + '-' + date.getUTCMonth() + '-' + date.getUTCDate();
}


export default function buildWeeks(occurrences: Array<string>) {

    var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    var today = getDayId(DateJs.today());
    var day = DateJs.today().add({days: -365 - 6});
    var foundFirstSun = false;
    var week = 0;
    var weeks: Array<any> = [];//@TODO remove any
    var foundToday = false;
    var dayOfWeek = 0;
    // Ensure we end on a saturday
    while (!foundToday || dayOfWeek != 6) {
        day.add({days: +1});
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
        var dayOfMonth = day.getUTCDate();

        var value = 0;
        if (occurrences.indexOf(dayId) !== -1) {
            value = 1;
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

    }
    return weeks;
}
