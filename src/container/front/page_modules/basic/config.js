/**
 *数据配置
 * Created by gaoju on 2018/8/8.
 */
export var TableDataMap = {
    dataSource : [{
        key: '0',
        name: '选择题',
        num: '',
        errorNum:'',
        percent: ''
    }, {
        key: '1',
        name: '填空题',
        num: '',
        errorNum:'',
        percent: ''
    }, {
        key: '2',
        name: '简答题',
        num: '',
        errorNum:'',
        percent: ''
    }],
    columns : [{
        title: '名称',
        dataIndex: 'name',
    }, {
        title: '题数',
        dataIndex: 'num',
    }, {
        title: '错题',
        dataIndex: 'errorNum',
    }, {
        title: '正确率',
        dataIndex: 'percent',
    }]
}
//饼状图pie1
export function Pie1 (data){
    let pie = {
        title: {
            text: '试卷结构'
        },
        legend: {
            orient:'vertical',
            left: 0,
            top:30,
            data: ['选择题','填空题','简答题']
        },
        tooltip: {
            trigger: 'item',
            formatter: '{b}:{c}个 ({d}%)',//tooltip显示格式。自定义
        },
        series: [{
            name: 'pie',
            type: 'pie',
            selectedMode: 'single',
            selectedOffset: 0,
            radius:'60%',
            data:[
                {value: data.singleQuestionNum, name: '选择题',
                    label: {
                        normal: {
                            position: 'inside',
                            formatter : '{d}%'
                        }
                    }
                },
                {value: data.tianKongQuestionNum, name: '填空题',
                    label: {
                        normal: {
                            position: 'inside',
                            formatter : '{d}%'
                        }
                    }
                },
                {value: data.jianDaQuestionNum, name: '简答题',
                    label: {
                        normal: {
                            position: 'inside',
                            formatter : '{d}%'
                        }
                    }
                }
            ]
        }]
    }
    return pie
}
//饼状图pie2
export function Pie2 (data){
    let pie = {
        title: {
            text: '知识点统计'
        },
        tooltip: {
            trigger:'item',
            formatter:"{a}：{b}<br/>出现次数：{c}次"
        },
        series : [
            {
                name: '名称',
                type: 'pie',
                radius : '60%',
                center: ['50%', '50%'],
                data: data.seriesData,
                itemStyle: {
                    emphasis: {
                        shadowBlur: 10,
                        shadowOffsetX: 0,
                        shadowColor: 'rgba(0, 0, 0, 0.5)'
                    }
                }
            }]
    }
    return pie
}