/**
 * 专题模块页面，每一个模块代表不同知识块
 * Created by gaoju on 2018/5/16.
 */
import React,{Component} from 'react'
import { push } from 'react-router-redux'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import './style.css'

class Thematic extends Component{
    constructor(props) {
        super(props)
    }
    componentDidMount(){
        //用route的参数来判断是从那个页面进来，进而取对应页面数据和显示对应页面
        if(this.props.params.flag=="one"){//模考试题
        }else if(this.props.params.quesParam=="two"){//专题
        }
    };
    goPage(data){
        console.log(data,this.props.params.flag)
        let flag = this.props.params.flag;
        this.props.actions.push(`/home/math/questions/${flag}/${data}`);
    }
    render(){
        return (
            <div className="thematic-parts">
                <div className="part one" onClick={()=>this.goPage('1')}>
                    <div className="col-md-3"><img src="public/images/special1.png"/></div>
                    <div className="col-md-5">
                        <h4>知识回顾</h4>
                        <p>考点梳理</p>
                    </div>
                    <div className="col-md-4">
                        <p>总题数：100道题</p>
                        <p>已完成：25道题</p>
                        <p>正确率：70%</p>
                    </div>
                </div>
                <div className="part two" onClick={()=>this.goPage('2')}>
                    <div className="col-md-3"><img src="public/images/special4.png"/></div>
                    <div className="col-md-5">
                        <h4>重点考点</h4>
                        <p>例题解析+习题训练</p>
                    </div>
                    <div className="col-md-4">
                        <p>总题数：150道题</p>
                        <p>已完成：15道题</p>
                        <p>正确率：70%</p>
                    </div>
                </div>
                <div className="part three" onClick={()=>this.goPage('3')}>
                    <div className="col-md-3"><img src="public/images/special3.png"/></div>
                    <div className="col-md-5">
                        <h4>备考思路</h4>
                        <p>名师技巧点拨</p>
                    </div>
                    <div className="col-md-4">
                        <p>总题数：50道题</p>
                        <p>已完成：18道题</p>
                        <p>正确率：70%</p>
                    </div>
                </div>
                <div className="part four" onClick={()=>this.goPage('4')}>
                    <div className="col-md-3"><img src="public/images/special2.png"/></div>
                    <div className="col-md-5">
                        <h4>聚焦中考</h4>
                        <p>针对性考纲提点</p>
                    </div>
                    <div className="col-md-4">
                        <p>总题数：120道题</p>
                        <p>已完成：55道题</p>
                        <p>正确率：70%</p>
                    </div>
                </div>
                <div className="part five" onClick={()=>this.goPage('5')}>
                    <div className="col-md-3"><img src="public/images/special3.png"/></div>
                    <div className="col-md-5">
                        <h4>真题过关</h4>
                        <p>简单题、中等题、拔高题</p>
                    </div>
                    <div className="col-md-4">
                        <p>总题数：150道题</p>
                        <p>已完成：0道题</p>
                        <p>正确率：0%</p>
                    </div>
                </div>
            </div>
        )
    }
}
function mapStateToProps(state) {
    return {}
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators({push}, dispatch)
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Thematic)