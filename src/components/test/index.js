/**
 * Created by gaoju on 2017/12/21.
 */
import React,{Component} from 'react'
import PropTypes from 'prop-types'
import './style.css'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { push } from 'react-router-redux'
import { Button,message,Icon } from 'antd'

var num = 0;

class Child extends React.Component {
    // 类型限制，静态属性名字固定
    static contextTypes = {
        color: PropTypes.string,
        name:PropTypes.string
    }

    render() {
        return (
            // 从上下文对象中获取爷爷组件传递过来的数据
            <h1 style={{ color: this.context.color }}>{this.context.name}告诉文字是红色的</h1>
        )
    }
}

class Father extends React.Component {
    static contextTypes = {
        name:PropTypes.string
    }
    render() {
        console.log("father--->",this.context)
        return (
            <div>
                <Child></Child>
            </div>

        )
    }
}

class Test extends Component{
    // 类型限制（必须），静态属性名称固定
    static childContextTypes = {
        color: PropTypes.string.isRequired,
        name:PropTypes.string.isRequired,

    }

    // 传递给孙子组件的数据
    getChildContext() {
        return {
            color: 'red',
            name:"grandfather"
        }
    }
    constructor(props){
        super(props)
        this.state={
            Number:0
        }
    }
    componentWillMount(){
        console.log("str------componentWillMount-------->>>");
    }
    componentDidMount(){
        console.log("str-------componentDidMount--------->>>");
    }
    componentWillReceiveProps(){
        console.log("str--------componentWillReceiveProps----->>>");
    }
    shouldComponentUpdate(){
        console.log("str----shouldComponentUpdate-------->>>");
        return true
    }
    componentWillUpdate(){
        console.log("str------componentWillUpdate------->>>");
    }
    componentDidUpdate(prevProps,prevState){
        console.log("str-------componentDidUpdate------->>>");
    }
    componentWillUnmount(){
        console.log("str------componentWillUnmount------->>>");

    }
    add(){
        console.log("str------add------->>>");
        this.setState({Number:(this.state.Number +1)})
    }
    render(){
        num ++;
        console.log("str-------render------->>>",num);
        return(
            <div style={{padding:"20px"}}>
                <h1>asdasdasdasd</h1>
                <h3>{this.state.Number}</h3>
                <Button onClick={()=>{this.add()}}>ADD</Button>

            </div>
        )
    }
}
function mapStateToProps(state) {
    return {}
}
function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators({ push}, dispatch)
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(Test)