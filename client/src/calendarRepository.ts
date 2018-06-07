import axios from 'axios';

/**
 * The server will return calendars missing the occurrences property if there are none.
 * This makes sure it is an array.
 *
 * @param calendar
 * @return {any}
 */
function ensueCalendarHasOccurences(calendar: any) {//@todo remove any
    if (!calendar.occurrences) {
        calendar.occurrences = [];
    }
    return calendar;
}

export function createCalendar() {
    return new Promise((resolve, reject) => {
        axios.post('/api/Calendars', {
            authorization: 'hihi', //@TODO
        })
            .then((response) => {
                resolve(ensueCalendarHasOccurences(response.data));
            })
        // .catch(function (error) {
        //     console.log(error);
        // });
    });
}

export function fetchCalendar(id: string, authorization: string) {
    return new Promise((resolve, reject) => {
        axios.get('/api/Calendars/' + id + '?authorization=' + authorization)
            .then((response) => {
                resolve(ensueCalendarHasOccurences(response.data));
            })
        // .catch(function (error) {
        //     console.log(error);
        // });
    });
}

export function putCalendarOccurences(id: string, authorization: string, occurrences: Array<string>) {
    return new Promise((resolve, reject) => {
        axios.patch(
            '/api/Calendars/' + id + '?authorization=' + authorization,
            {occurrences: occurrences}
        )
            .then((response) => {
                resolve(ensueCalendarHasOccurences(response.data));
            })
        // .catch(function (error) {
        //     console.log(error);
        // });
    });
}
