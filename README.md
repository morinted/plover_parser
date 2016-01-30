# Plover Parser

Parse the Plover log to count against a wordlist.

## Extras

Wordlist copied from [Google-10000-english](https://github.com/first20hours/google-10000-english) is found in `assets/`

## Get Parsing

You just need [Node.js](https://nodejs.org/en/) to get started.

```
npm install -g plover_parser
count_plover_log worlist.txt plover.log.1 plover.log.2 > output.txt
```

## Get Gitting (alternate title: so you want to make a pull request?)

```
git clone https://github.com/morinted/plover_parser.git
cd plover_parser
npm install
npm start ~/path/to/log.log
npm run build
```

## ESLint

In your editor, preferably [Atom](http://atom.io) or [Sublime Text 3](http://sublimetext.com), make sure to install a package for "eslint" in order to have your JavaScript validated by the rules defined in the `.eslintrc`
