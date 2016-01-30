# Plover Parser

Parse the Plover log to count against a wordlist.

## Extras

Wordlist copied from [Google-10000-english](https://github.com/first20hours/google-10000-english) is found in `assets/`

## Install

You just need [Node.js](https://nodejs.org/en/) to get started. Then, run:

```
npm install -g plover_parser
```

### Get Parsing

#### Check Log Against a Wordlist

Given a wordlist with one word per line, you can see how many times the word was
used in the given plover log files. The list will be in the same order as the
wordlist and will show all the strokes you used to write the words and how
many times you used each stroke.

```
count_plover_log worlist.txt plover.log.1 plover.log.2 > counts.txt
```

#### Generate Most Used Words List

Goes through the Plover logs and makes a list of **all** the words you've used
in your log. It then sorts the most used down to the least used. Useful to see
your most commonly used strokes, including commands, and the different ways you
use them.

```
plover_log_stats plover.log.1 plover.log.2 > stats.txt
```

## Get Gitting (alternate title: so you want to make a pull request?)

```
git clone https://github.com/morinted/plover_parser.git
cd plover_parser
npm install
npm start ~/path/to/log.log
npm run build
```

I use webpack to bundle everything and add a shebang afterwards so that they are
runnable.

## ESLint

In your editor, preferably [Atom](http://atom.io) or [Sublime Text 3](http://sublimetext.com), make sure to install a package for "eslint" in order to have your JavaScript validated by the rules defined in the `.eslintrc`
