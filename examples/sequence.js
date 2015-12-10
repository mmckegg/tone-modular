var SimpleSynth = require('../instrument/simple-synth')
var Sequence = require('../event/sequence')
var Transport = require('../core/transport')
var Freeverb = require('../effect/freeverb')

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
