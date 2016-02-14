#!/usr/bin/env node
var debug = require('debug')('roku-cli:index.js')
var Roku = require('roku')
var fs = require('fs')
var getRokuAddress = require('./lib/get-roku-address')

var argv = require('minimist')(process.argv.slice(2), {
  alias: {
    help: 'h',
    info: 'i',
    version: 'v'
  }
})

var validButtons = [
  'home',
  'rev',
  'fwd',
  'play',
  'select',
  'left',
  'right',
  'down',
  'up',
  'back',
  'instantReplay',
  'info',
  'backspace',
  'search',
  'enter'
]

if (argv.version) return version()
if (argv.help || !argv._.length) return help()

function version () {
  var pkg = require(__dirname + '/package.json')
  return console.log('%s @%s', pkg.name, pkg.version)
}

function help () {
  return fs.createReadStream('./usage.txt', 'utf8').pipe(process.stdout)
}

var command = argv._.shift()

getRokuAddress(function (addr) {
  var dev = new Roku(addr)

  if (argv.info) {
    debug('calling info command')
    return info(dev)
  }

  debug('calling command: %s', command)

  switch (command) {
    case 'help':
      return help()
    case 'info':
      return info(dev)
    case 'version':
      return version()

    // shortcut commands
    case 'home':
    case 'left':
    case 'right':
    case 'up':
    case 'down':
    case 'play':
    case 'backspace':
    case 'enter':
    case 'select':
    case 'rev':
    case 'fwd':
      return press(dev, command)
    case 'launch':
      return launch(dev, argv._.shift())
    case 'list':
      return listApps(dev)
    case 'pause':
      return press(dev, 'play')
    case 'press':
      return press(dev, argv._.shift())
    case 'replay':
      return press(dev, 'instantReplay')
    case 'type':
      return type(dev, argv._.join(' '))
    case 'search': {
      var terms
      if (argv._.length)
        terms = argv._.join(' ')

      return search(dev, terms)
    }
  }

  if (validButtons.indexOf(command.toLowerCase()) > -1)
    return press(dev, command)
})

function info (roku) {
  roku.info(function (err, info_) {
    console.log('Information about this Roku')
    console.log('---------------------------')
    for (var k in info_) {
      if (!info_.hasOwnProperty(k))
        next

      console.log('  %s: %s', k, info_[k])
    }
  })
}

function launch (roku, program) {
  debug('Launching %s', program)
  return roku.launch(program, function () {
    process.exit(0)
  })
}

function listApps (roku) {
  return roku.apps(function (err, applist) {
    console.log('Apps installed on this Roku')
    console.log('---------------------------')
    applist.forEach(function (a) {
      console.log('* %s [v%s]', a.name, a.version)
    })
  })
}

function press (roku, button) {
  // title case
  var btn = button.substr(0,1).toUpperCase() + button.substr(1)
  debug('pressing button %s', btn)
  roku.press(btn.toUpperCase())
}

function search (roku, terms) {
  if (!terms)
    return roku.press('search')

  roku.press('search')
  roku.delay(500)
  type(roku, terms)
  roku.press('enter')
}

function type (roku, val) {
  val.split('').forEach(function (l) {
    roku.type(l)
    roku.delay(50)
  })
}
