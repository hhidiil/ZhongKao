/**
 * 定义服务端状态码
 * Created by gaoju on 2019/3/21.
 */
var errorMessage = {
    '400':"请求参数出错",
    '401':"当前请求需要用户验证",
    '404':"未发现请求资源",
    '405':"请求方式出错",
    '408':"请求超时",
    '500':"服务器出错。。。"
}
module.exports = errorMessage;