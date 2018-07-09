/**
 * Created by gaoju on 2018/7/6.
 */
import React,{Component} from 'react'
import './style.css'

class Collapse extends Component{
    constructor(props){
        super(props)
        this.state = {
            displayFlag:false
        }
    }
    componentDidMount(){
    }
    //componentWillReceiveProps(nextProps) {
    //    this.setState({
    //        clearTime: nextProps.clearTime
    //    });
    //}
    clickHandle(){
        this.setState({displayFlag:!this.state.displayFlag});
        if(this.props.onClick){
            this.props.onClick();
        }
    }
    render(){
        let {title} = this.props;
        let childcss = {
            display:this.state.displayFlag?"block":"none"
        }
        return(
            <div className="myCollapse">
                <div className="myCollapseHeader" onClick={()=>this.clickHandle()}>{title}</div>
                <div className="myCollapseList" id="objective" style={childcss}>{this.props.children}</div>
            </div>
        )
    }
}
export default Collapse