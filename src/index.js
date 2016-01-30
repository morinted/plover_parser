#! /usr/bin/env node
import fs from 'fs'

const usage = `Usage: count_plover_log wordlist.txt plover.log plover.log.1 [...] plover.log.n`

// Get user's arguments
const args = process.argv.slice(2)
// Just the wordlist and then the list of log files as the rest.
const [ words, ...logs ] = args

// Exit function used to exit early
const exit = message => {
  if (message) {
    console.error(
      `ERROR: ${message}`
    )
  }
  process.exit()
}

if (!words) exit(`Must provide wordlist as first argument.\n\n${usage}`)

// Let's read the wordlist.
let commonWords
try {
  // Array of stop words (strings)
  commonWords =
    fs.readFileSync(words, 'utf8')
      .replace(/\r\n/g, /\n/) // normalize line-endings
      .split('\n') // one word per line
      .filter(x => x) // get rid of undefined entries
} catch (e) {
  exit(`Error loading wordlist: '${
    words
  }'. Please ensure 1 word per line, UTF-8 format.\n\n${usage}`)
}

// An object whose keys are the wordlist. Helps for quick lookup.
const byWord =
  commonWords.reduce((result, word) => {
    result[word] = word
    return result
  }, {})

if (logs.length < 1) {
  exit(`Must provide list of logs as arguments after wordlist.\n\n${usage}`)
}

/* Function to read one log file, returning all of its strokes + translations */
const readLogFile = filename => {
  try {
    return fs.readFileSync(filename, 'utf8')
    .split('\n')
    .filter(entry => entry.includes(' Translation(')) // only care for output
    .map(entry => {
      // Parse the entry. Sample:
      // 2015-09-26 16:25:14,647 Translation(('APBG', 'HRAR') : angular)
      //                                      ^ key (array),    ^ translation
      let key
      let translation
      try {
        key =
          JSON.parse(`[ ${ // We build this as a JSON array and then parse it!
            entry.match(/Translation\(\(([^")]+)\)/)[1] // Read strokes
              .replace(/'/g, '"') // Change quotes
              .replace(/,$/, '') // Get rid of trailing comma
              .replace(/u/g, '') // Remove unicode denotation in log
          } ]`
        ).map(stroke => { // We can map the created array...
          if (stroke.match(/^[STKPWHR]+$/)) {
            return `${stroke}-` // Add the implicit comma to left-side
          }
          return stroke
        }).join('/') // Finish off by putting back to string, e.g. "KAT/HROG"
      } catch (e) {
        exit(`Can't process key in entry "${entry}"`)
      }
      try {
        translation =
          entry.match(/\) : ([^)]+)\)/)[1] // Read translation
      } catch (e) {
        exit(`Can't process translation in entry "${entry}"`)
      }
      return [ key, translation ]
    })
  } catch (e) {
    exit(`Problem reading ${filename}: ${e.message}`)
  }
}

// Merge all the stroke files that the user specified
const strokes = [].concat.apply([], logs.map(log => readLogFile(log)))

console.info(`Loaded ${
  commonWords.length
} words to count, and ${
  strokes.length
} translation outputs from the logs.`)

// This builds up the amount of times a stroke is used for each common word.
const frequencies =
  strokes.reduce((results, [ stroke, translation ]) => {
    // If the translation isn't one from our wordlist, we don't do anything.
    if (!byWord[translation]) {
      return results
    }
    // If this translation hasn't come up, prepare for it with empty object.
    if (!results[translation]) {
      results[translation] = {}
    }
    // If this stroke has already happened, increment
    if (results[translation][stroke]) {
      results[translation][stroke] += 1
    } else {
      // Otherwise, it's the first!
      results[translation][stroke] = 1
    }
    return results
  }, {})

// Finally, we just format the results in the wordlist order we read in.
const orderedResults =
  commonWords.map(word => {
    // We take "word" and turn it into "word: STROKE (count), STROKE (count)"
    if (!frequencies[word]) return // Word didn't occur? Drop it.
    return `${word}: ${
      Object.keys(frequencies[word]) // This creates 1 string out of the strokes
        .reduce((words, current) =>
          `${
              words ? `${words}, ` : ''
            }${current} (${frequencies[word][current]})`
        , '')
    }`
  })
  .filter(x => x) // Remove undefined

const endStatus = () => `
Out of the ${
  commonWords.length
} words, you had strokes for ${
  orderedResults.length
}
`
console.log(endStatus())
console.log(orderedResults.join('\n'))
console.log(endStatus())
