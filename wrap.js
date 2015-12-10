var getBase = require('./base')
var baseCache = new WeakMap()

module.exports = function wrap (requires, fn) {
  var result = function (audioContext, args) {
    var ctor = getCtorForContext(audioContext)
    var instance = Object.create(ctor.prototype)
    ctor.apply(instance, Array.prototype.slice.call(arguments, 1))
    return instance
  }

  result.requires = requires
  result.applyTo = fn
  result.forContext = getCtorForContext
  return result

  // scoped

  function getCtorForContext (audioContext) {
    if (!(audioContext instanceof window.AudioContext)) {
      throw new Error('You must specify an AudioContext.')
    }

    // cache base
    var baseForContext = baseCache.get(audioContext)
    if (!baseForContext) {
      baseForContext = {
        base: getBase(audioContext),
        lookup: new WeakMap()
      }
      baseCache.set(audioContext, baseForContext)
    }

    // cache ctor
    var ctor = baseForContext.lookup.get(fn)
    if (!ctor) {
      console.log('thing')
      applyRequires(requires, baseForContext)
      ctor = fn(baseForContext.base)
      baseForContext.lookup.set(fn, ctor)
    }

    return ctor
  }
}

function applyRequires (requires, baseForContext) {
  requires.forEach(function (module) {
    if (!baseForContext.lookup.has(module.applyTo)) {
      applyRequires(module.requires, baseForContext)
      var ctor = module.applyTo(baseForContext.base)
      baseForContext.lookup.set(module.applyTo, ctor)
    }
  })
}
