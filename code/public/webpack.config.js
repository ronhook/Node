var webpack		= require('webpack');
var path		= require('path');
var BUILD_DIR	= path.resolve(__dirname, 'js/');
var APP_DIR		= path.resolve(__dirname, 'js/build');
var config		= {
	entry	: {
		react	: APP_DIR + '/index.jsx',
	},
	output	: {
		path		: BUILD_DIR,
		filename	: 'bundle.js'
	},
	module : {
		rules : [
			{
				test	: /\.jsx?/,
				include : APP_DIR,
				loader	: 'babel-loader'
			},
		]
	},
	externals: {
        react		: "React",
        'react-dom'	: "ReactDOM"
	},
	plugins : [
		new webpack.DefinePlugin({
			'process.env': {
				//'NODE_ENV': JSON.stringify('production')
			}
		}),
		new webpack.optimize.UglifyJsPlugin(),
		new webpack.optimize.AggressiveMergingPlugin()
	]
};
module.exports = config;