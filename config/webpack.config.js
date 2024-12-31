const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const ReactRefreshWebpackPlugin = require("@pmmmwh/react-refresh-webpack-plugin");
const { getCssLoaders } = require("webpack-scoped-css");
const ESLintPlugin = require("eslint-webpack-plugin");
const paths = require("./paths");
const { MiniCssExtractPlugin } = require("webpack-scoped-css");

const isDevelopment = process.env.NODE_ENV?.trim() !== "production";
const emitErrorsAsWarnings = process.env.ESLINT_NO_DEV_ERRORS === "true";
const disableESLintPlugin = process.env.DISABLE_ESLINT_PLUGIN === "true";

module.exports = {
	// mode: isDevelopment ? "development" : "production",
	mode: "development",
	entry: "./src/index.jsx",
	output: {
		path: path.resolve(__dirname, "../build"),
		publicPath: isDevelopment ? "/" : "/ral",
		filename: "bundle.js"
	},
	module: {
		rules: [
			{
				test: /\.(js|jsx)$/,
				exclude: /node_modules/,
				use: {
					loader: require.resolve("babel-loader"),
					options: {
						plugins: [isDevelopment && require.resolve("react-refresh/babel")].filter(Boolean)
					}
				}
			},
			{
				test: /\.(png|jpe?g|gif|svg)$/i,
				type: "asset/resource"
			},
			getCssLoaders(isDevelopment, {}, true)
		]
	},
	resolve: {
		extensions: [".js", ".jsx"]
	},
	plugins: [
		new HtmlWebpackPlugin({
			template: "./public/index.html"
		}),
		!disableESLintPlugin &&
			new ESLintPlugin({
				// Plugin options
				extensions: ["js", "mjs", "jsx", "ts", "tsx"],
				eslintPath: require.resolve("eslint"),
				failOnError: !(isDevelopment && emitErrorsAsWarnings),
				context: paths.appSrc,
				cache: true,
				cacheLocation: path.resolve(paths.appNodeModules, ".cache/.eslintcache"),
				// ESLint class options
				cwd: paths.appPath,
				resolvePluginsRelativeTo: __dirname,
				baseConfig: {
					// extends: [require.resolve("eslint-config-react-app/base")]
					extends: ["eslint:recommended", "plugin:react/recommended"]
				}
			}),
		isDevelopment && new ReactRefreshWebpackPlugin(),
		!isDevelopment && new MiniCssExtractPlugin()
	].filter(Boolean),
	devServer: {
		static: {
			directory: path.join(__dirname, "dist")
		},
		port: 9000,
		hot: true,
		historyApiFallback: true
	},
	devtool: isDevelopment ? "eval" : false,
	stats: {
		errorDetails: true,
		children: true
	}
};
