/**
 * Created by gaoju on 2017/11/21.
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
        this.state = {
        }
    }
    goPage(data,event){
        console.log(data)
        this.props.actions.push(`/home/${data}`)
    }
    render(){
        //let { basic, english, math } = this.props;
        //console.log(this.props)
        return (
            <div className="math-door">
                <div className="questions">
                    <div className="enter-block question-block" onClick={this.goPage.bind(this,'questions')}>真题</div>
                </div>
                <div className="exam">
                    <div className="enter-block exam-block" onClick={this.goPage.bind(this,'exam')}>模考</div>
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