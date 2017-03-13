(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });

},{}],2:[function(require,module,exports){

},{}],3:[function(require,module,exports){
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

},{}],4:[function(require,module,exports){
arguments[4][1][0].apply(exports,arguments)
},{"dup":1}],5:[function(require,module,exports){
///<reference path="./midi.d.ts" />
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Entry point for midilive.js. Used to list controllers and attach them to
 * instruments.
 */
class MIDILive {
    constructor() {
        this.inputInstruments = {};
    }
    init() {
        return new Promise((resolve, reject) => {
            navigator.requestMIDIAccess().then((m) => {
                this.midi = m;
                let inputs = m.inputs.values();
                let input;
                while (input = inputs.next().value) {
                    console.log(input);
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
        console.log(`${id}: ${data}`);
    }
}
// Attach to the window for exporting.
window['MIDILive'] = new MIDILive();

},{}]},{},[1,2,3,4,5]);
