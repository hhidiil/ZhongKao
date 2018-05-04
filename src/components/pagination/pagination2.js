/**
 * Created by gaoju on 2018/3/6.
 */
import React,{Component} from 'react'
import './style.css'
import ReactDom from 'react-dom'
import PropTypes from 'prop-types'

class Pagination2 extends Component{
    constructor(props){
        super(props)
        this.state={
            current: props.current,
            total: props.total || 5,
            color:props.color,
            scoreList: props.scoreArraylist ||[],
            arrayList: []
        }
    }
    componentWillMount(){
        let arraylist=[];
        for(let i=0;i<this.state.total;i++) {
            arraylist[i] = i+1;
        }
        this.setState({arrayList:arraylist})
    }
    componentDidMount(){
        let score = this.state.scoreList;
        $('.after').each(function(i){
            $(this).attr('data-attr',score[i])
        })
        this.addClassHandle(this.state.current)
    }
    componentWillReceiveProps(nextProps) {
        if (nextProps) {
            this.addClassHandle(nextProps.current)
        }
    }
    addClassHandle(num){
        let _this = this.refs[num];
        $(_this).siblings().removeClass("active")
        $(_this).attr("class","active")
    }
    handleChange(e){
        this.addClassHandle(e.target.text);
        this.props.onChange(Number(e.target.text))
    }
    render(){
        if(this.state.arrayList.length<1){
            return <div/>
        }
        let color = this.state.color;
        return(
            <div className="myPagination2">
                <nav aria-label="Page navigation">
                    <ul className="pagination">
                        {this.state.arrayList.map((index,i)=>(
                            <li key={index} ref={index} id={index}><a className="after" onClick={this.handleChange.bind(this)}>{index}</a></li>
                        ))}
                    </ul>
                </nav>
            </div>
        )
    }
}
Pagination2.propTypes = {
    current: PropTypes.number,//当前题号
    total:PropTypes.number,//总题数
    onChange:PropTypes.func,//切换题号的时间函数
    color:PropTypes.string,//背景颜色设置
    scoreList:PropTypes.array//每题对应的分数数组
}
export default Pagination2