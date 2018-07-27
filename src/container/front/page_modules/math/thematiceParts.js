/**
 * 考纲复习部分
 * Created by gaoju on 2018/7/11.
 */
import React,{Component} from 'react'
import { Link } from 'react-router'
import { push } from 'react-router-redux'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import './style.css'

class Math extends Component{
    constructor(props) {
        super(props)
    }
    goThematicQuestion(flag){
        this.props.actions.push(`/home/math/thematiceParts/${flag}`);
    }
    render(){
        return(
            <div>
                <div className="examAll-item-knowledge">
                    <h3 className="center margint20">知识点复习</h3>
                    <div className="item-knowledge">
                        <div className="part1" onClick={()=>this.goThematicQuestion('chapters')}>课本复习</div>
                        <div className="part1" style={{borderLeft:"1px solid darkgray"}} onClick={()=>this.goThematicQuestion('exampoint')}>考点复习</div>
                    </div>
                </div>
                <div className="examAll-item">
                    <div className="title" onClick={()=>this.goThematicQuestion('thematic')}>
                        <h3>专题复习</h3>
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
    return { actions: bindActionCreators({push}, dispatch) }
}
export default connect(mapStateToProps, mapDispatchToProps)(Math)