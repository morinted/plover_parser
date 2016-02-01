import { readLogFiles } from './parsing'
import { exit } from './information'

const usage =
  `Usage: plover_log_stats plover.log plover.log.1 [...] plover.log.n`

// Get user's arguments
const args = process.argv.slice(2)
// Just the wordlist and then the list of log files as the rest.
const [ ...logs ] = args

if (logs.length < 1) {
  exit(`Must provide list of logs as arguments.\n\n${usage}`)
}

// Merge all the stroke files that the user specified
const strokes = readLogFiles(logs)

console.info(`Loaded ${
  strokes.length
} translation outputs from the logs.`)

// This builds up the amount of times a stroke is used for each common word.
const frequencies =
  strokes.reduce((results, [ stroke, translation ]) => {
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

const wordsByUsageDescending =
  Object.keys(frequencies).sort((a, b) => {
    const aUse = Object.keys(frequencies[a]).reduce((use, stroke) =>
      use + frequencies[a][stroke], 0)
    const bUse = Object.keys(frequencies[b]).reduce((use, stroke) =>
      use + frequencies[b][stroke], 0)
    return bUse - aUse
  })

// Finally, we just format the results in the wordlist order we read in.
const orderedResults =
  wordsByUsageDescending.map(word => {
    // We take "word" and turn it into "word: STROKE (count), STROKE (count)"
    if (!frequencies[word]) return // Word didn't occur? Drop it.
    if (word === 'None') return // Don't count misstrokes
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
Showing ${
  orderedResults.length
} unique words.
`
console.log(endStatus())
console.log(orderedResults.join('\n'))
console.log(endStatus())
