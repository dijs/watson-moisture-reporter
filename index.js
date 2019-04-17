require('dotenv').config();
// const createQueue = require('siju');
const debug = require('debug');
const PubNub = require('pubnub');
const read = require('./read');
// const report = require('./report');

const log = debug('watson:reporter:moisture');
// const queue = createQueue(report);

const pubnub = new PubNub({
  publishKey: process.env.PUBLISH_KEY,
  subscribeKey: process.env.SUBSCRIBE_KEY
});

function takeReading() {
  const reading = read.current;
  if (reading) {
    pubnub.publish({
      "channel": "moistures",
      "message": {
        eon: {
          [reading.location]: reading.moisture
        }
      }
    });
  }
}

// const TEN_MINS = 1000 * 60 * 10 + '';
const TEN_MINS = 1000 * 60;
const interval = parseInt(process.env.INTERVAL || TEN_MINS, 10);
console.log('Interval set at', interval, 'millis');

setInterval(takeReading, interval);

log('Started Moisture Reporter');
