const five = require('johnny-five');
const debug = require('debug');

const log = debug('watson:reporter:moisture:read');

const board = new five.Board();
let samples = [];
let ready = false;
const sampleSize = 32;

board.on('ready', () => {
	log('board is ready');
	const sensor = new five.Sensor('A0');
	sensor.on('change', value => {
		log('Soil moisture change: ' + value);
		samples.push(value);
		if (samples.length > sampleSize) {
			samples.shift();
		}
		ready = true;
	});
});

board.on('error', function(err) {
	log('board err', err);
});

module.exports = {
	get current() {
		if (!ready) return null;
		// Get mid value of samples
		const sortedSamples = [...samples].sort();
		const moisture = sortedSamples[Math.floor(sortedSamples.length / 2)];
		return {
			moisture,
			time: new Date(),
			location: process.env.LOCATION,
		};
	},
};
