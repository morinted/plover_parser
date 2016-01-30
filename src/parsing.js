import fs from 'fs'
import { exit } from './information'

/* Function to read one log file, returning all of its strokes + translations */
export const readLogFile = filename => {
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
            entry.match(/Translation\(\(([^\)]+)\)/)[1] // Read strokes
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

export const readWordList = filename => {
  try {
    // Array of stop words (strings)
    const lines = fs.readFileSync(filename, 'utf8')
        .replace(/\r\n/g, /\n/) // normalize line-endings
        .split('\n') // one word per line
        .filter(x => x) // get rid of undefined entries
    const byLine =
      lines.reduce((result, line, i) => {
        result[line] = i + 1 // Give line number (starting at 1)
        return result
      }, {})
    return [ lines, byLine ]
  } catch (e) {
    exit(`Error loading wordlist: '${
      filename
    }'. Please ensure 1 word per line, UTF-8 format.`)
  }
}

export const readLogFiles = logs =>
  [].concat.apply([], logs.map(log => readLogFile(log)))
