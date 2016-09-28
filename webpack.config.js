var webpack = require('webpack');

const HtmlWebpackPlugin = require('html-webpack-plugin');
var CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
    // Source-Maps zum Debuggen von TypeScript im Browser
    // generieren.
    devtool: 'source-map',
    debug: true,
    // Einstiegspunkt in die Anwendung
    // Erweiterung .js bzw. ts. wird weggelassen
    entry: {
        app: "./app/main"
    },
    // Legt fest, dass das Bundle im Ordner dist abzulegen
    // ist. Der Platzhalter [name] wird durch den Namen des
    // Einstiegspunktes (app) ersetzt.
    output: {
        path: __dirname + "/dist",
        publicPath: 'dist/',
        filename: "[name].js"
    },
    // Dateien mit den nachfolgenden Erweiterungen werden
    // von webpack ins Bundle aufgenommen
    resolve: {
        extensions: ['', '.js', '.ts']
    },
    // Hier wird der TypeScript-Loader konfiguriert. Er gibt
    // an, dass alle Dateien mit der Endung ts mit diesem Loader
    // zu kompilieren sind. Das Ergebnis dieses Vorgangs wird
    // ins Bundle aufgenommen. Die Eigenschaft test verweist
    // auf einen regulären Ausdruck, der die zu kompilierenden
    // Dateien identifiziert. Die Eigenschaft exclude gibt an,
    // das die Bibliotheken im Ordner node_modules nicht zu
    // kompilieren sind.
    module: {
        loaders: [
            {
                test: /.json$/,
                loaders: [
                    'json'
                ]
            },
            {
                test: /\.(css|scss)$/,
                loaders: [
                    'style',
                    'css',
                    'sass',
                    'postcss'
                ]
            },
            {test: /\.ts$/, loaders: ['ts-loader'], exclude: /node_modules/}
        ]
    },
    plugins: [
        new webpack.optimize.OccurrenceOrderPlugin(),
        new webpack.NoErrorsPlugin(),
        new HtmlWebpackPlugin({
            template: 'index.html',
            inject: true
        }),
        new CopyWebpackPlugin([{
                from: "assets",
                to: "assets"
            }, {
                from: "dummydata",
                to: "dummydata"
            }, {
                from: "node_modules",
                to: "node_modules"
            }
            ],
            {
                ignore: [
                    // 'components/**/*.ts'
                ]
            })
    ],
    // Gibt an, dass der webpack-dev-server ein Code in die
    // in die Bundles aufnimmt, welcher den Browser nach einer
    // Änderung des Bundles aktualisiert.
    devServer: {
        //inline: true
        inline: false
    }
};