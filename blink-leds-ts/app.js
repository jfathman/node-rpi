// app.ts
// $ sudo $(which node) app 20 30 5000
// $ tsd install node --save
/// <reference path='typings/tsd.d.ts'/>
'use strict';
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Gpio = require('onoff').Gpio;
if (process.argv[2] == '--help') {
    console.log('Usage: sudo node app.js [rateBlue] [rateRed] [duration]');
    process.exit();
}
var rateBlue = process.argv[2] || 1000;
var rateRed = process.argv[3] || 2000;
var duration = process.argv[4] || 5000;
var ON = 1;
var OFF = 0;
var Led = (function () {
    function Led(pin, name) {
        this.name = name;
        this.timer = null;
        this.device = new Gpio(pin, 'out');
    }
    Led.prototype.unexport = function () {
        this.device.unexport();
    };
    Led.prototype.state = function () {
        return this.device.readSync();
    };
    Led.prototype.on = function () {
        this.device.writeSync(ON);
    };
    Led.prototype.off = function () {
        this.device.writeSync(OFF);
    };
    Led.prototype.toggle = function () {
        this.state() == ON ? this.off() : this.on();
    };
    Led.prototype.shutdown = function () {
        this.off();
        this.unexport();
    };
    return Led;
})();
var Blink = (function (_super) {
    __extends(Blink, _super);
    function Blink(pin, name) {
        _super.call(this, pin, name);
    }
    Blink.prototype.start = function (rate) {
        var _this = this;
        this.timer = setInterval(function () {
            _this.toggle();
        }, rate);
    };
    Blink.prototype.stop = function () {
        this.timer && clearInterval(this.timer);
        this.timer = null;
    };
    Blink.prototype.end = function () {
        this.stop();
        this.shutdown();
    };
    return Blink;
})(Led);
var ledBlue = new Blink(17, 'blue');
var ledRed = new Blink(22, 'red');
ledBlue.start(rateBlue);
ledRed.start(rateRed);
setTimeout(function () {
    ledBlue.end();
    ledRed.end();
}, duration);
process.on('SIGINT', function () {
    ledBlue.end();
    ledRed.end();
    console.log();
    process.exit();
});
