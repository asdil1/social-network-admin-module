import path from "path";
import HtmlWebpackPlugin from "html-webpack-plugin";
import MiniCssExtractPlugin from "mini-css-extract-plugin";
import {CleanWebpackPlugin} from "clean-webpack-plugin";
import {fileURLToPath} from "url";
import fs from "fs";


const __dirname = path.dirname(fileURLToPath(import.meta.url));
const users = JSON.parse(fs.readFileSync(path.join(__dirname, "src/storage/users.json"), "utf8"));

const webpackConfig = {
    entry: {
        // входные точки
        main: './src/public/scripts/index.js',
        mainStyle: './src/public/styles/main.less',
        usersStyle: './src/public/styles/users.less',
        mainTemplate: './src/views/main.pug',
        usersTemplate: './src/views/users.pug',
        friendsTemplate: './src/views/friends.pug',
        friendNewsTemplate: './src/views/friendNews.pug'
    },
    // правила для обработки файлов
    module: {
        rules: [
            // regexp какие файлы обрабатывать, загрузчик для обработки
            {test: /\.js$/, exclude: /node_modules/, use: "babel-loader"},
            {test: /\.pug$/, loader: "pug-loader"},
            // less в css, обработка url() @import, извлечение css в отдельные файлы
            {test: /\.less$/, use: [MiniCssExtractPlugin.loader, "css-loader", "less-loader"]}
        ]
    },
    plugins: [
        new CleanWebpackPlugin(),
        new MiniCssExtractPlugin({
            filename: '[name].css',
        }),
        new HtmlWebpackPlugin({
            template: './src/views/main.pug',  // Компилируем main.pug
            filename: 'main.html',             // Имя выходного HTML
            chunks: ['mainStyle']      // Подключаем нужные бандлы
        }),
        new HtmlWebpackPlugin({
            template: './src/views/users.pug',
            filename: 'users.html',
            chunks: ['usersStyle', 'main'],
            templateParameters: {users: users}
        }),
        new HtmlWebpackPlugin({
            template: './src/views/friends.pug',
            filename: 'friends.html',
            chunks: ['usersStyle', 'main'],
            templateParameters: {users: users}
        }),
        new HtmlWebpackPlugin({
            template: './src/views/friendNews.pug',
            filename: 'friendNews.html',
            chunks: ['usersStyle', 'main'],
            templateParameters: {users: users}
        })
    ],
    output: {
        path: path.resolve("dist/webpack/"),
        filename: '[name].bundle.js',
    }
}

export default webpackConfig;