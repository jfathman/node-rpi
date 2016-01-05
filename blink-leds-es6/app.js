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

const ON  = 1;
const OFF = 0;

class Led {
    constructor(pin, name) {
        this.name = name;
        this.timer = null;
        this.device = new Gpio(pin, 'out');
    }

    unexport() {
        this.device.unexport();
    }

    state() {
        return this.device.readSync();
    }

    on() {
        this.device.writeSync(ON);
    }

    off() {
        this.device.writeSync(OFF);
    }

    toggle() {
        this.state() == ON ? this.off() : this.on();
    }

    blinkStart(rate) {
        var _this = this;
        this.timer = setInterval(function () {
            _this.toggle();
        }, rate);
    }

    blinkStop() {
        this.timer && clearInterval(this.timer);
        this.timer = null;
    }

    shutdown() {
        this.blinkStop();
        this.off();
        this.unexport();
    }
}

var ledBlue = new Led(17, 'blue');
var ledRed  = new Led(22, 'red');

ledBlue.blinkStart(rateBlue);
ledRed.blinkStart(rateRed);

setTimeout(function() {
    ledBlue.shutdown();
    ledRed.shutdown();
}, duration);

process.on('SIGINT', function() {
    ledBlue.shutdown();
    ledRed.shutdown();
    console.log();
    process.exit();
});

