require('dotenv').config();
const createQueue = require('siju');
const debug = require('debug');
const read = require('./read');
const report = require('./report');

const log = debug('watson:reporter:moisture');
const queue = createQueue(report);

function takeReading() {
  const reading = read.current;
  if (reading) {
    queue.add(reading);
  }
}

const TEN_MINS = 1000 * 60 * 10 + '';
const interval = parseInt(process.env.INTERVAL || TEN_MINS, 10);
console.log('Interval set at', interval, 'millis');

setInterval(takeReading, interval);

log('Started Moisture Reporter');
