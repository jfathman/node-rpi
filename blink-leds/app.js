// app.js

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

var ledBlue = new Gpio(17, 'out');
var ledRed  = new Gpio(22, 'out');

process.on('SIGINT', function() {
    ledBlue.writeSync(OFF);
    ledBlue.unexport();
    ledRed.writeSync(OFF);
    ledRed.unexport();
    console.log();
    process.exit();
});

var timerBlue = setInterval(function(){
    ledBlue.writeSync(ledBlue.readSync() === OFF ? ON : OFF)
}, rateBlue);

var timerRed = setInterval(function(){
    ledRed.writeSync(ledRed.readSync() === OFF ? ON : OFF)
}, rateRed);
 
setTimeout(function() {
    clearInterval(timerBlue);
    clearInterval(timerRed);
    ledBlue.writeSync(OFF);
    ledBlue.unexport();
    ledRed.writeSync(OFF);
    ledRed.unexport();
}, duration);
