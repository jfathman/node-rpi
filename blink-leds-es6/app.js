// app.js

// $ sudo $(which node) app 20 30 5000

'use strict';

var Gpio = require('onoff').Gpio;

if (process.argv[2] == '--help') {
    console.log('Usage: sudo node app.js [rateBlue] [rateRed] [duration]');
    process.exit();
}

var rateBlue = process.argv[2] || 1000;
var rateRed  = process.argv[3] || 2000;
var duration = process.argv[4] || 5000;

const ON = 1;
const OFF = 0;

class Led {
    constructor(gpioPin, ledName, rate) {
        this.gpioPin = gpioPin;
        this.ledName = ledName;
        this.rate = rate;
        this.device = new Gpio(gpioPin, 'out');
    }

    getRate() {
        return this.rate;
    }

    toggle() {
        this.device.writeSync(this.device.readSync() === OFF ? ON : OFF);
    }

    shutdown() {
        this.device.writeSync(OFF);
        this.device.unexport();
    }
}

var ledBlue = new Led(17, 'blue', rateBlue);
var ledRed  = new Led(22, 'red', rateRed);

var timerBlue = setInterval(function() {
    ledBlue.toggle();
}, ledBlue.getRate());

var timerRed = setInterval(function() {
    ledRed.toggle();
}, ledRed.getRate());
 
setTimeout(function() {
    clearInterval(timerBlue);
    clearInterval(timerRed);
    ledBlue.shutdown();
    ledRed.shutdown();
}, duration);

process.on('SIGINT', function() {
    ledBlue.shutdown();
    ledRed.shutdown();
    console.log();
    process.exit();
});

