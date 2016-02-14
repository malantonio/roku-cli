var debug = require('debug')('roku-cli:lib/get-roku-address')
var fs = require('fs')
var home = require('home')
var Client = require('node-ssdp').Client

var homeLoc = home.resolve('~/.roku-cli.json')

module.exports = function getRokuAddress (callback) {
  var config

  try {
    debug('Checking file for config')
    config = fs.readFileSync(homeLoc).toString()
  } catch (e) {
    debug("Couldn't open file")
  }

  if (config) {
    debug('~/.roku-cli.json exists, using for config')
    return callback(JSON.parse(config).address)
  }

  debug('Getting Roku address via ssdp')

  var client = new Client()
  client.on('response', function (headers, statusCode, rinfo) {
    client._stop()
    debug('got address: %s', headers.LOCATION)
    debug('writing file to %s', homeLoc)
    fs.writeFileSync(homeLoc, JSON.stringify({address: headers.LOCATION}), 'utf8')
    return callback(headers.LOCATION)
  })

  client.search('roku:ecp')
}
