/**
 * 项目全局变量基本配置(建议都是固定不变的值)
 * Created by gaoju on 2018/1/17.
 */

const CONFIG_MAP={
    root_path: __dirname,//项目根目录
    ROOT_NUMBER: 0,//用户
    questionScore:[3,3,5]//试题的分数，questionScore[0]：选择题分数，questionScore[1]：填空题，questionScore[2]：简答题
}
module.exports=CONFIG_MAP