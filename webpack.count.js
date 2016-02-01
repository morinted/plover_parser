var path = require('path')
var webpack = require('webpack')

module.exports =
  { entry:
    [ './src/count_plover_log.js'
    ]
  , target: 'node'
  , output:
    { path: path.join(__dirname, './bin')
    , filename: 'count_plover_log.js'
    }
  , plugins:
    [ new webpack.optimize.DedupePlugin()
    , new webpack.optimize.UglifyJsPlugin()
    , new webpack.DefinePlugin({
      __WEBPACK__: JSON.stringify(true)
    })
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
