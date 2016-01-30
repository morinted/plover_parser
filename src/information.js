// Exit function used to exit early
export const exit = message => {
  if (message) {
    console.error(
      `ERROR: ${message}`
    )
  }
  process.exit()
}
