import axios from 'axios';

export function createCalendar() {
    return new Promise((resolve, reject) => {
        axios.post('/api/Calendars', {
            authorization: 'hihi', //@TODO
        })
            .then((response) => {
                console.log(response);
                resolve(response.data);
            })
        // .catch(function (error) {
        //     console.log(error);
        // });
    });
}
