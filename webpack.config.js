const path = require('path');

module.exports = {
    mode: 'development',
    entry: {
        bundle: path.resolve(__dirname,"src/index.js"),
    },
    devServer :{
        static:{
            directory: path.resolve(__dirname, "./")
        },
        host:'0.0.0.0',
        port:3000,
        open:true,
        hot:true,
        compress:true,
        allowedHosts: "all"
    },
    watchOptions: {
        aggregateTimeout: 500, // delay before reloading
        poll: 1000 // enable polling since fsevents are not supported in docker
    },
    module : {
        rules : [
            {
                test: /\.css$/i,
                use: ["style-loader", "css-loader"],
            },
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                use: ["babel-loader"],
            },
            {
                test: /\.(png|svg|jpg|jpeg|gif)$/i,
                type: 'asset/inline',
            }
        ] 
    },
    resolve: {
        modules: [__dirname,"src","node_modules"],
        extensions: ["*", ".js", ".jsx"],
    },
    output : {
        path: path.resolve(__dirname, "./"),
        filename: '[name].js',
    },
}