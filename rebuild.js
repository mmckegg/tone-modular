var fs = require('fs')
var path = require('path')
var vm = require('vm');
var root = path.join(__dirname, '..', 'Tone.js')
var inRoot = path.join(root, 'Tone')
var outRoot = __dirname

fs.readdirSync(inRoot).forEach(buildDirectory)

function buildDirectory (name) {
  var outDir = path.join(outRoot, name)
  var dir = path.join(inRoot, name)
  var files = fs.readdirSync(dir)

  try {
    fs.mkdirSync(outDir)
  } catch (ex) {}

  files.forEach(function (file) {
    var data = fs.readFileSync(path.join(dir, file), 'utf8')
    if (file !== 'Tone.js') {
      var header = '// from https://github.com/Tonejs/Tone.js/blob/master/Tone/' + name + '/' + file + '\n'
      fs.writeFileSync(path.join(outDir, dasherize(file)), header + processFile(outDir, data))
    }
  })
}

function processFile (dir, data) {
  var result = null
  vm.runInNewContext(data, {
    define: function (requires, fn) {
      result = wrapFunction(dir, requires, fn)
    }
  })
  return result
}

function wrapFunction (dir, requires, fn) {
  var data = fn.toString()
  var wrapPath = path.join(outRoot, 'wrap')
  return 'var wrap = require(' + JSON.stringify(relative(dir, wrapPath)) + ')\n' +
         'module.exports = wrap(' + getRequires(dir, requires) + ', ' + data + ')'
}

function getRequires (dir, requires) {
  var result = []
  requires.forEach(function (p) {
    if (p !== 'Tone/core/Tone') {
      var fullPath = path.join(outRoot, dasherize(p.replace(/^Tone\//, '')))
      result.push('require(' + JSON.stringify(relative(dir, fullPath)) + ')')
    }
  })
  return '[\n' + result.map(function (line) {
    return '  ' + line
  }).join(',\n') + '\n]'
}

function relative (a, b) {
  var result = path.relative(a, b)
  if (result.slice(0, 3) !== '../') {
    result = './' + result
  }
  return result
}

function dasherize (str) {
  return str.replace(/[a-zA-Z][A-Z][a-z]/g, function (s) {
    return s.charAt(0) + '-' + s.slice(1)
  }).toLowerCase()
}
