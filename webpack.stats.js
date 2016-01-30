var path = require('path')
var webpack = require('webpack')

module.exports =
  { entry:
    [ './src/plover_log_stats.js'
    ]
  , target: 'node'
  , output:
    { path: path.join(__dirname, './bin')
    , filename: 'plover_log_stats.js'
    }
  , plugins:
    [ new webpack.optimize.DedupePlugin()
    , new webpack.optimize.UglifyJsPlugin()
    ]
  , module:
    { loaders:
      [ { test: /\.js$/
        , loaders: ['babel']
        , exclude: /node_modules/
        }
      ]
    }
}
