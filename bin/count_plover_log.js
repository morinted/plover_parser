#!/usr/bin/env node

!function(r){function e(n){if(t[n])return t[n].exports;var o=t[n]={exports:{},id:n,loaded:!1};return r[n].call(o.exports,o,o.exports,e),o.loaded=!0,o.exports}var t={};return e.m=r,e.c=t,e.oe=function(r){throw r},e.p="",e(e.s=4)}([function(r,e){"use strict";Object.defineProperty(e,"__esModule",{value:!0});e.exit=function(r){r&&console.error("ERROR: "+r),process.exit()}},function(r,e,t){"use strict";function n(r){return Array.isArray(r)?r:Array.from(r)}var o=function(){function r(r,e){var t=[],n=!0,o=!1,i=void 0;try{for(var a,u=r[Symbol.iterator]();!(n=(a=u.next()).done)&&(t.push(a.value),!e||t.length!==e);n=!0);}catch(l){o=!0,i=l}finally{try{!n&&u["return"]&&u["return"]()}finally{if(o)throw i}}return t}return function(e,t){if(Array.isArray(e))return e;if(Symbol.iterator in Object(e))return r(e,t);throw new TypeError("Invalid attempt to destructure non-iterable instance")}}(),i=t(2),a=t(0),u="Usage: count_plover_log wordlist.txt plover.log plover.log.1 [...] plover.log.n",l=process.argv.slice(2),c=n(l),s=c[0],f=c.slice(1);s||(0,a.exit)("Must provide wordlist as first argument.\n\n"+u);var d=(0,i.readWordList)(s),p=o(d,2),g=p[0],v=p[1];f.length<1&&(0,a.exit)("Must provide list of logs as arguments after wordlist.\n\n"+u);var y=(0,i.readLogFiles)(f);console.info("Loaded "+g.length+" words to count, and "+y.length+" translation outputs from the logs.");var h=y.reduce(function(r,e){var t=o(e,2),n=t[0],i=t[1];return v[i]?(r[i]||(r[i]={}),r[i][n]?r[i][n]+=1:r[i][n]=1,r):r},{}),m=g.map(function(r){return h[r]?r+": "+Object.keys(h[r]).reduce(function(e,t){return""+(e?e+", ":"")+t+" ("+h[r][t]+")"},""):void 0}).filter(function(r){return r}),x=function(){return"\nOut of the "+g.length+" words, you had strokes for "+m.length+"\n"};console.log(x()),console.log(m.join("\n")),console.log(x())},function(r,e,t){"use strict";function n(r){return r&&r.__esModule?r:{"default":r}}Object.defineProperty(e,"__esModule",{value:!0}),e.readLogFiles=e.readWordList=e.readLogFile=void 0;var o=t(3),i=n(o),a=t(0),u=e.readLogFile=function(r){try{return i["default"].readFileSync(r,"utf8").split("\n").filter(function(r){return r.includes(" Translation(")}).map(function(r){var e=void 0,t=void 0;try{e=JSON.parse("[ "+r.match(/Translation\(\(([^\)]+)\)/)[1].replace(/'/g,'"').replace(/,$/,"").replace(/u/g,"")+" ]").map(function(r){return r.match(/^[STKPWHR]+$/)?r+"-":r}).join("/")}catch(n){(0,a.exit)("Can't process key in entry \""+r+'"')}try{t=r.match(/\) : ([^)]+)\)/)[1]}catch(n){(0,a.exit)("Can't process translation in entry \""+r+'"')}return[e,t]})}catch(e){(0,a.exit)("Problem reading "+r+": "+e.message)}};e.readWordList=function(r){try{var e=i["default"].readFileSync(r,"utf8").replace(/\r\n/g,/\n/).split("\n").filter(function(r){return r}),t=e.reduce(function(r,e,t){return r[e]=t+1,r},{});return[e,t]}catch(n){(0,a.exit)("Error loading wordlist: '"+r+"'. Please ensure 1 word per line, UTF-8 format.")}},e.readLogFiles=function(r){return[].concat.apply([],r.map(function(r){return u(r)}))}},function(r,e){r.exports=require("fs")},function(r,e,t){r.exports=t(1)}]);