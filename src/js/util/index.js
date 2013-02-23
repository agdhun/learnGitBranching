var _ = require('underscore');
var constants = require('../util/constants');

exports.isBrowser = function() {
  var inBrowser = String(typeof window) !== 'undefined';
  return inBrowser;
};

exports.getLocale = function() {
  if (constants.GLOBAL.locale) {
    return constants.GLOBAL.locale;
  }
  console.warn('No locale found...');
  return 'en';
};

exports.splitTextCommand = function(value, func, context) {
  func = _.bind(func, context);
  _.each(value.split(';'), function(command, index) {
    command = _.escape(command);
    command = command
      .replace(/^(\s+)/, '')
      .replace(/(\s+)$/, '')
      .replace(/&quot;/g, '"')
      .replace(/&#x27;/g, "'");

    if (index > 0 && !command.length) {
      return;
    }
    func(command);
  });
};

exports.genParseCommand = function(regexMap, eventName) {
  return function(str) {
    var method;
    var regexResults;

    _.each(regexMap, function(regex, _method) {
      var results = regex.exec(str);
      if (results) {
        method = _method;
        regexResults = results;
      }
    });

    return (!method) ? false : {
      toSet: {
        eventName: eventName,
        method: method,
        regexResults: regexResults
      }
    };
  };
};
