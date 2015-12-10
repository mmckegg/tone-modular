Tone.js - modular require edition
===

This is a special build of [Yotam Mann](https://github.com/tambien)'s excellent [Tone.js framework](https://github.com/Tonejs/Tone.js) that allows requiring of **individual components** and **avoids the global AudioContext**. This make it much more [browserify](http://browserify.org) friendly and easier to use with existing code or other libraries.

> Tone.js is a Web Audio framework for creating interactive music in the browser. The architecture of Tone.js aims to be familiar to both musicians and audio programmers looking to create web-based audio applications. On the high-level, Tone offers common DAW (digital audio workstation) features like a global transport for scheduling and timing events and prebuilt synths and effects. For signal-processing programmers (coming from languages like Max/MSP), Tone provides a wealth of high performance, low latency building blocks and DSP modules to build your own synthesizers, effects, and complex control signals.

## Install via [npm](https://www.npmjs.com/package/tone-modular)

```bash
$ npm install tone-modular
```

## Documentation

Usage is same as official [API](http://tonejs.org/docs/), except that you require the modules you need individually instead of as one bundle. Constructors have an additional first argument where you must specify the `AudioContext` to use.

You must manually apply any Web Audio compatibility shims yourself, as these are not included in this build.

Global objects like `Transport` can be accessed by requiring and then calling `.withContext(audioContext)`.

## Example

```js
var SimpleSynth = require('tone-modular/instrument/simple-synth')
var Sequence = require('tone-modular/event/sequence')
var Transport = require('tone-modular/core/transport')
var Freeverb = require('tone-modular/effect/freeverb')

var audioContext = new window.AudioContext()

var transport = Transport.forContext(audioContext)
transport.timeSignature = [6, 4]
transport.bpm.value = 180
transport.start()

var reverb = Freeverb(audioContext, {
  roomSize: 0.2,
  wet: 0.3
})

var output = audioContext.createGain()
output.connect(audioContext.destination)

var synth = SimpleSynth(audioContext)
synth.connect(reverb)
reverb.connect(output)

var playback = Sequence(audioContext, function (time, note) {
  synth.triggerAttackRelease(note, '8n', time)
}, ['E4', 'F#4', 'B4', 'C#5', 'D5', 'F#4', 'E4', 'C#5', 'B4', 'F#4', 'C#5', 'B4'], '8n')

playback.start()
```

## Version

This module should track the latest version of the [official Tone.js module](https://https://github.com/Tonejs/Tone.js). If it gets behind, feel welcome to send a pull request updating to latest version!

You can use `rebuild.js` to update all the modules from the master repo, but `base.js` must be manually updated from `Tone/core/Tone.js`
