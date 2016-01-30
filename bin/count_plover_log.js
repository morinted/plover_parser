#! /usr/bin/env node
'use strict';

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toArray(arr) { return Array.isArray(arr) ? arr : Array.from(arr); }

var usage = 'Usage: count_plover_log wordlist.txt plover.log plover.log.1 [...] plover.log.n';

// Get user's arguments
var args = process.argv.slice(2);
// Just the wordlist and then the list of log files as the rest.

var _args = _toArray(args);

var words = _args[0];

var logs = _args.slice(1);

// Exit function used to exit early

var exit = function exit(message) {
  if (message) {
    console.error('ERROR: ' + message);
  }
  process.exit();
};

if (!words) exit('Must provide wordlist as first argument.\n\n' + usage);

// Let's read the wordlist.
var commonWords = undefined;
try {
  // Array of stop words (strings)
  commonWords = _fs2.default.readFileSync(words, 'utf8').replace(/\r\n/g, /\n/) // normalize line-endings
  .split('\n') // one word per line
  .filter(function (x) {
    return x;
  }); // get rid of undefined entries
} catch (e) {
  exit('Error loading wordlist: \'' + words + '\'. Please ensure 1 word per line, UTF-8 format.\n\n' + usage);
}

// An object whose keys are the wordlist. Helps for quick lookup.
var byWord = commonWords.reduce(function (result, word) {
  result[word] = word;
  return result;
}, {});

if (logs.length < 1) {
  exit('Must provide list of logs as arguments after wordlist.\n\n' + usage);
}

/* Function to read one log file, returning all of its strokes + translations */
var readLogFile = function readLogFile(filename) {
  try {
    return _fs2.default.readFileSync(filename, 'utf8').split('\n').filter(function (entry) {
      return entry.includes(' Translation(');
    }) // only care for output
    .map(function (entry) {
      // Parse the entry. Sample:
      // 2015-09-26 16:25:14,647 Translation(('APBG', 'HRAR') : angular)
      //                                      ^ key (array),    ^ translation
      var key = undefined;
      var translation = undefined;
      try {
        key = JSON.parse('[ ' + // We build this as a JSON array and then parse it!
        entry.match(/Translation\(\(([^")]+)\)/)[1] // Read strokes
        .replace(/'/g, '"') // Change quotes
        .replace(/,$/, '') // Get rid of trailing comma
        .replace(/u/g, '') // Remove unicode denotation in log
         + ' ]').map(function (stroke) {
          // We can map the created array...
          if (stroke.match(/^[STKPWHR]+$/)) {
            return stroke + '-'; // Add the implicit comma to left-side
          }
          return stroke;
        }).join('/'); // Finish off by putting back to string, e.g. "KAT/HROG"
      } catch (e) {
        exit('Can\'t process key in entry "' + entry + '"');
      }
      try {
        translation = entry.match(/\) : ([^)]+)\)/)[1]; // Read translation
      } catch (e) {
        exit('Can\'t process translation in entry "' + entry + '"');
      }
      return [key, translation];
    });
  } catch (e) {
    exit('Problem reading ' + filename + ': ' + e.message);
  }
};

// Merge all the stroke files that the user specified
var strokes = [].concat.apply([], logs.map(function (log) {
  return readLogFile(log);
}));

console.info('Loaded ' + commonWords.length + ' words to count, and ' + strokes.length + ' translation outputs from the logs.');

// This builds up the amount of times a stroke is used for each common word.
var frequencies = strokes.reduce(function (results, _ref) {
  var _ref2 = _slicedToArray(_ref, 2);

  var stroke = _ref2[0];
  var translation = _ref2[1];

  // If the translation isn't one from our wordlist, we don't do anything.
  if (!byWord[translation]) {
    return results;
  }
  // If this translation hasn't come up, prepare for it with empty object.
  if (!results[translation]) {
    results[translation] = {};
  }
  // If this stroke has already happened, increment
  if (results[translation][stroke]) {
    results[translation][stroke] += 1;
  } else {
    // Otherwise, it's the first!
    results[translation][stroke] = 1;
  }
  return results;
}, {});

// Finally, we just format the results in the wordlist order we read in.
var orderedResults = commonWords.map(function (word) {
  // We take "word" and turn it into "word: STROKE (count), STROKE (count)"
  if (!frequencies[word]) return; // Word didn't occur? Drop it.
  return word + ': ' + Object.keys(frequencies[word]) // This creates 1 string out of the strokes
  .reduce(function (words, current) {
    return '' + (words ? words + ', ' : '') + current + ' (' + frequencies[word][current] + ')';
  }, '');
}).filter(function (x) {
  return x;
}); // Remove undefined

var endStatus = function endStatus() {
  return '\nOut of the ' + commonWords.length + ' words, you had strokes for ' + orderedResults.length + '\n';
};
console.log(endStatus());
console.log(orderedResults.join('\n'));
console.log(endStatus());

