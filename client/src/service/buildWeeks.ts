import 'datejs' //Sets the "Date" global let
import Day from '../model/Day';

const DateJs = <any>Date;

/**
 * Returns the dayId string for a given date in YYYY-MM-DD format
 *
 * @param {Date} date
 * @return {string}
 */
function dateToDateId(date: Date): string {
    return date.toISOString().split('T')[0];
}

export default function buildWeeks(occurrences: Array<string>): Array<Array<Day>> {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    let today = dateToDateId(DateJs.today());
    let day = DateJs.today().add({days: -365 - 6});
    let foundFirstSun = false;
    let week = 0;
    let weeks: Array<Array<Day>> = [];
    let foundToday = false;
    let dayOfWeek = 0;
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
        let dayId = dateToDateId(day);
        if (dayId == today) {
            foundToday = true;
        }
        let dayOfMonth = day.getUTCDate();

        let value = 0;
        if (occurrences.indexOf(dayId) !== -1) {
            value = 1;
        }
        let month = day.getUTCMonth();

        let dayText = dayOfMonth;
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
