# Occurrence Calendar v2
Demo running at:
https://occurrence-calendar.herokuapp.com/

Occurrence Calendar is a web app that allows you to keep a calendar of how often a given event occurs. All changes are saved immediately via REST calls.

Occurrence Calendar v2 is built with:
* TypeScript
* React
* Loopback (Node REST API framework)
* NodeJS
* MySQL

### Todo in v2:
- Get initial "scroll to bottom" to work on iPhone
- Stop welcome message from flickering during loading
- Regularly delete old unused calenders (modified date? last dayId?, no dayIds?)
- Undo eject from react-scripts now that found way to disable service worker in index.js
- Turn "tslint:recommended" back on and fix all errors
