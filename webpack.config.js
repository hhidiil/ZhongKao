/**
 * Created by gaoju on 2017/10/26.
 */
var webpack = require('webpack');
var path = require('path');

module.exports = {
    entry: [
        // 为webpack-dev-server的环境打包好运行代码， 然后连接到指定服务器域名与端口
        'webpack-dev-server/client?http://localhost:3000',
        // 为热替换（HMR）打包好运行代码 ， only- 意味着只有成功更新运行代码才会执行热替换（HMR）
        'webpack/hot/only-dev-server',
        // 我们app的入口文件
        './src/enter/front.js'
    ],
    output: {
        path: path.join(__dirname, 'public/build'),//打包输出文件地址
        filename: 'bundle.js'//打包输出文件名
    },
    module: {
        loaders: [
            {
                test: /\.css$/,
                loader: 'style-loader!css-loader'
            },
            {
                test: /\.js|jsx$/,
                loaders: 'babel-loader?presets[]=es2015,presets[]=stage-0,presets[]=react',
                include: path.join(__dirname, 'src')
            }
        ]
    },
    plugins: [
        //生产环境下打开
        //new webpack.optimize.UglifyJsPlugin()
        new webpack.optimize.OccurrenceOrderPlugin(),
        // 开启全局的模块热替换（HMR）
        new webpack.HotModuleReplacementPlugin(),
        // 当模块热替换（HMR）时在浏览器控制台输出对用户更友好的模块名字信息
        new webpack.NamedModulesPlugin()
    ]

}