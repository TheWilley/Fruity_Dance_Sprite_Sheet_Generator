/* eslint-disable */

const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
require("style-loader");
require("css-loader");
require("sass-loader");
const NodePolyfillPlugin = require("node-polyfill-webpack-plugin");
const FaviconsWebpackPlugin = require('favicons-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
	entry: "./src/app.ts",
	target: "web",
	module: {
		rules: [
			{
				test: /\.(scss)$/,
				use: [
					{
						loader: 'style-loader'
					},
					{
						loader: 'css-loader'
					},
					{
						loader: 'postcss-loader',
						options: {
							postcssOptions: {
								plugins: () => [
									require('autoprefixer')
								]
							}
						}
					},
					{
						loader: 'sass-loader'
					}
				]
			},
			{
				test: /\.tsx?$/,

				use: "ts-loader",
				exclude: /node_modules/
			},
			{
				test: /\.s[ac]ss$/i,

				use: [
					// Creates `style` nodes from JS strings
					"style-loader",
					// Translates CSS into CommonJS
					"css-loader",
					// Compiles Sass to CSS
					"sass-loader"
				]
			},
			{
				test: /\.(png|svg|jpg|jpeg|gif)$/i,
				type: "asset/resource"
			},
			{
				test: /\.css$/i,
				use: ["style-loader", "css-loader"],
			},
		]
	},
	resolve: {
		extensions: [".tsx", ".ts", ".js"]
	},
	output: {
		path: path.resolve(__dirname, "dist"),
		filename: "bundle.js"
	},
	// Other rules...
	plugins: [
		new NodePolyfillPlugin(),
		new HtmlWebpackPlugin({
			template: "./src/index.html"
		}),
		new FaviconsWebpackPlugin('./src/public/favicon/favicon-32x32.png'),
		new CopyWebpackPlugin({
			patterns: [
				{ from: './src/public/google56310369e394ee27.html', to: 'dist' },
			],
		}),
	],
	// http://localhost:9000/dist/index.html
	devServer: {
		compress: true,
		port: 9000,
		client: {
			overlay: {
				warnings: false
			}
		},
		static: {
			directory: path.join(__dirname, "./")
		}
	}
};
