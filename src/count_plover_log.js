import { readLogFiles, readWordList } from './parsing'
import { exit } from './information'
const usage =
  `Usage: count_plover_log [wordlist.txt or -w] plover.log plover.log.1 [...] plover.log.n`
const staticAssets = '../assets/10000words.txt' // For development
const wp = typeof __WEBPACK__ !== 'undefined' // Check if built or if node
let topWords = staticAssets // Default for development
if (wp) topWords = require('raw!../assets/10000words.txt') // prod package words

// Get user's arguments
const args = process.argv.slice(2)
// Just the wordlist and then the list of log files as the rest.
const [ words, ...logs ] = args

let isContent = false // By default, load the provided wordlist.
let wordFile = words

if (!words) exit(`Must provide wordlist as first argument.\n\n${usage}`)

if (words.toLowerCase() === '-w') { // On -w, use built-in wordlist
  if (wp) isContent = true
  wordFile = topWords
}

// Let's read the wordlist.
const [ commonWords, byWord ] = readWordList(wordFile, isContent)

if (logs.length < 1) {
  exit(`Must provide list of logs as arguments after wordlist.\n\n${usage}`)
}

const strokes = readLogFiles(logs)

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
