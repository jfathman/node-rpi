// app.ts

// $ sudo $(which node) app 20 30 5000

// $ tsd install node --save

/// <reference path='typings/tsd.d.ts'/>

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
    private name: string;
    private device: any;
    protected timer: number;

    constructor(pin, name) {
        this.name = name;
        this.timer = null;
        this.device = new Gpio(pin, 'out');
    }

    private unexport() {
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

    shutdown() {
        this.off();
        this.unexport();
    }
}

class Blink extends Led {
    constructor(pin, name) {
        super(pin, name);
    }

    start(rate) {
        var _this = this;
        this.timer = setInterval(function () {
            _this.toggle();
        }, rate);
    }

    stop() {
        this.timer && clearInterval(this.timer);
        this.timer = null;
    }

    end() {
        this.stop();
        this.shutdown();
    }
}

var ledBlue = new Blink(17, 'blue');
var ledRed  = new Blink(22, 'red');

ledBlue.start(rateBlue);
ledRed.start(rateRed);

setTimeout(function() {
    ledBlue.end();
    ledRed.end();
}, duration);

process.on('SIGINT', function() {
    ledBlue.end();
    ledRed.end();
    console.log();
    process.exit();
});

