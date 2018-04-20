/**
 * 选择题(单选，多选)
 * Created by gaoju on 2018/4/16.
 */
import React,{Component} from 'react'
import './style.css'

const base = new Base64();
const optionName=['A','B','C','D','E','F','G'];
class Choice extends Component{
    constructor(props){
        super(props)
        this.state = {
            type:props.type,
            choiceList:props.choiceList,//选项
            index:props.index
        }
    }
    render(){
        let optionArray=[],option = this.props.choiceList,type = this.props.type;
        let ss = ($.trim(option)).replace(/["\[\]\s]/g,"");
        optionArray = ss.split(",");
        const optionList = (length)=>{
            const list = [];
            for(let i=0;i<length;i++){
                list.push(<label className="checkbox-inline" key={i}>
                    <input type={type == '单选题'?'radio':'checkbox'} value={optionName[i]} name={"Qopts_selects_practice"+this.props.index} />
                    <span>{optionName[i]}</span><span dangerouslySetInnerHTML={{__html:base.decode(optionArray[i])}}></span>
                    </label>)
            }
            return list;
        }
        return(
                <li>
                    <p>{optionArray.length>1?optionList(optionArray.length):''}</p>
                </li>
        )
    }
}
export default Choice