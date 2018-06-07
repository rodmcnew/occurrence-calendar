import axios from 'axios';
import Calendar from '../model/Calendar';
import generateRandomString from './generateRandomString';

/**
 * The server will return calendars missing the occurrences property if there are none.
 * This makes sure it is an array.
 *
 * @param calendar
 * @return {any}
 */
function ensueCalendarHasOccurrences(calendar: Calendar): Calendar {
    if (!calendar.occurrences) {
        calendar.occurrences = [];
    }
    return calendar;
}

export function createCalendar() {
    return new Promise((resolve, reject) => {
        axios.post('/api/Calendars', {
            authorization: generateRandomString(64),
        })
            .then((response) => {
                resolve(ensueCalendarHasOccurrences(response.data));
            })
            .catch(function (error) {
                reject(error);
            });
    });
}

export function fetchCalendar(id: string, authorization: string) {
    return new Promise((resolve, reject) => {
        axios.get('/api/Calendars/' + id + '?authorization=' + authorization)
            .then((response) => {
                resolve(ensueCalendarHasOccurrences(response.data));
            })
            .catch(function (error) {
                reject(error);
            });
    });
}

export function putCalendarOccurrences(id: string, authorization: string, occurrences: Array<string>) {
    return new Promise((resolve, reject) => {
        axios.patch(
            '/api/Calendars/' + id + '?authorization=' + authorization,
            {occurrences: occurrences}
        )
            .then((response) => {
                resolve(ensueCalendarHasOccurrences(response.data));
            })
            .catch(function (error) {
                reject(error);
            });
    });
}
