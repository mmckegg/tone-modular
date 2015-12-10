// from https://github.com/Tonejs/Tone.js/blob/master/Tone/signal/NOT.js
var wrap = require("../wrap")
module.exports = wrap([
  require("./equal-zero")
], function (Tone){

	"use strict";

	/**
	 *  @class  Just an alias for Tone.EqualZero, but has the same effect as a NOT operator. 
	 *          Outputs 1 when input equals 0. 
	 *  
	 *  @constructor
	 *  @extends {Tone.SignalBase}
	 *  @example
	 * var not = new Tone.NOT();
	 * var sig = new Tone.Signal(1).connect(not);
	 * //output of not equals 0. 
	 * sig.value = 0;
	 * //output of not equals 1.
	 */
	Tone.NOT = Tone.EqualZero;

	return Tone.NOT;
})