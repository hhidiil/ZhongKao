/**
 * Created by gaoju on 2017/10/26.
 */
var webpack = require('webpack');
var path = require('path');
// works across all browsers, we're adding babel-polyfill here.
//require('babel-polyfill');

module.exports = {
    entry: {
        front:[
            'webpack-hot-middleware/client',
            // 为webpack-dev-server的环境打包好运行代码， 然后连接到指定服务器域名与端口.//不使用node作为服务启动，server.js启动
            //'webpack-dev-server/client?http://localhost:3000',
            // 为热替换（HMR）打包好运行代码 ， only- 意味着只有成功更新运行代码才会执行热替换（HMR）
            //'webpack/hot/only-dev-server',
            // 我们app的入口文件
            './src/enter/front.js'
        ],
        teacher:[
            'webpack-hot-middleware/client',
            './src/enter/teacher.js'
        ]
    },
    output: {
        path: path.join(__dirname, 'assets/build'),//打包输出文件地址
        publicPath:'/build/',
        filename: '[name].bundle.js'//打包输出文件名
    },
    module: {
        //使用webpack2+以上版本都需要加 -loader
        loaders: [
            {
                test: /\.js|jsx$/,
                loaders: 'babel-loader',
                include: path.join(__dirname, 'src'),
                options:{
                    "presets": ["react-hmre"],//热更新插件
                }
            },
            {test: /\.css$/, loader: 'style-loader!css-loader'},
            {test: /\.less$/, loader: 'style-loader!css-loader!less-loader'},
            {test: /\.(gif|jpg|png)$/, loader: 'url-loader?limit=8192&name=images/[name].[hash].[ext]' }
        ]
    },
    devtool: 'cheap-eval-source-map',
    plugins: [
        //为组件分配ID，通过这个插件webpack可以分析和优先考虑使用最多的模块，并为它们分配最小的ID
        new webpack.optimize.OccurrenceOrderPlugin(),
        // 开启全局的模块热替换（HMR）
        new webpack.HotModuleReplacementPlugin(),
        //出错时页面不阻塞，且会在编译结束后报错。
        new webpack.NoEmitOnErrorsPlugin(),
        // 当模块热替换（HMR）时在浏览器控制台输出对用户更友好的模块名字信息
        new webpack.NamedModulesPlugin()
    ]
}