(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const debug_instrument_1 = require("./instruments/debug-instrument");
const soundfont_instrument_1 = require("./instruments/soundfont-instrument");
const Instruments = {
    DebugInstrument: debug_instrument_1.default,
    SoundfontInstrument: soundfont_instrument_1.default,
};
exports.default = Instruments;

},{"./instruments/debug-instrument":2,"./instruments/soundfont-instrument":4}],2:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Instrument that logs out events to the console for debugging.
 */
class DebugInstrument {
    constructor() {
        this.name = 'debug';
    }
    noteOn(note, velocity) {
        console.log(`on ${note}(${velocity})`);
    }
    noteOff(note, velocity) {
        console.log(`off ${note}(${velocity})`);
    }
}
;
exports.default = DebugInstrument;

},{}],3:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });

},{}],4:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 *
 */
class Options {
    constructor() {
        this.offDelay = 0;
    }
}
/**
 * Synth instrument based on soundfonts using MIDI.js.
 *
 * Note that right now you can only use one at a time due to the design of MIDI.js. Need to update
 * with static state to support loading multiple instruments.
 */
class SoundfontInstrument {
    constructor(soundfontUrl, instrument, options = new Options()) {
        this.soundfontUrl = soundfontUrl;
        this.instrument = instrument;
        this.options = options;
    }
    init() {
        return new Promise((resolve, reject) => {
            window.MIDI.loadPlugin({
                soundfontUrl: this.soundfontUrl,
                instrument: this.instrument,
                onsuccess: () => {
                    window.MIDI.setVolume(0, 127);
                    resolve();
                },
            });
        });
    }
    noteOn(note, velocity) {
        window.MIDI.noteOn(0, note, velocity, 0);
    }
    noteOff(note, velocity) {
        window.MIDI.noteOff(0, note, velocity, this.options.offDelay);
    }
}
;
exports.default = SoundfontInstrument;

},{}],5:[function(require,module,exports){
///<reference path="./midi.d.ts" />
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const instruments_1 = require("./instruments");
/**
 * Entry point for midilive.js. Used to list controllers and attach them to
 * instruments.
 */
class MIDILive {
    constructor() {
        this.inputInstruments = {};
    }
    init() {
        this.midi = null;
        this.inputs = [];
        this.globalInstruments = [];
        this.inputInstruments = {};
        return new Promise((resolve, reject) => {
            navigator.requestMIDIAccess().then((m) => {
                this.midi = m;
                let inputs = m.inputs.values();
                let input;
                while (input = inputs.next().value) {
                    this.inputs.push(input);
                    input.onmidimessage =
                        (e) => this.handle(e.target.id, e.data);
                }
                resolve();
            }, (err) => reject(err));
        });
    }
    listInputs() {
        return this.inputs;
    }
    addInstrument(instrument, input) {
        if (input) {
            if (!this.inputInstruments[input.id]) {
                this.inputInstruments[input.id] = [];
            }
            this.inputInstruments[input.id].push(instrument);
        }
        else {
            this.globalInstruments.push(instrument);
        }
    }
    removeInstrument(instrument, input) {
        let remove = (arr, item) => {
            for (let i = arr.length - 1; i >= 0; --i) {
                if (arr[i] == item) {
                    arr.splice(i, 1);
                }
            }
        };
        if (input && this.inputInstruments[input.id]) {
            remove(this.inputInstruments[input.id], instrument);
        }
        else {
            remove(this.globalInstruments, instrument);
        }
    }
    handle(id, data) {
        let cmd = data[0] >> 4;
        let channel = data[0] & 0xf;
        let note = data[1];
        let velocity = data[2];
        if (cmd == 8 || (cmd == 9 && velocity == 0)) {
            this.noteOff(id, note, velocity);
        }
        else if (cmd == 9) {
            this.noteOn(id, note, velocity);
        }
        // TODO(alex): Handle sustain, pitch bend, etc.
    }
    noteOn(id, note, velocity) {
        this.globalInstruments.forEach((instrument) => instrument.noteOn(note, velocity));
        if (this.inputInstruments[id]) {
            this.inputInstruments[id].forEach((instrument) => instrument.noteOn(note, velocity));
        }
    }
    noteOff(id, note, velocity) {
        this.globalInstruments.forEach((instrument) => instrument.noteOff(note, velocity));
        if (this.inputInstruments[id]) {
            this.inputInstruments[id].forEach((instrument) => instrument.noteOff(note, velocity));
        }
    }
}
const instance = new MIDILive();
instance['Instruments'] = instruments_1.default;
// Attach to the window for exporting.
window['MIDILive'] = instance;

},{"./instruments":1}]},{},[1,2,3,4,5]);
