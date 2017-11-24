/**
 * Created by gaoju on 2017/11/23.
 */
import React,{Component} from 'react'
import { push } from 'react-router-redux'
import './style.css'

class Question extends Component{
    constructor(props){
        super(props)
        this.state={
            itemData:[
                {
                    id:'001',
                    title:'2017年北京大学内部专家通宵熬夜出版中考考试真题',
                    url:'https://www.baidu.com'

                },{
                    id:'002',
                    title:'2017年清华大学内部专家通宵熬夜出版中考考试真题',
                    url:'https://www.baidu.com'
                },{
                    id:'002',
                    title:'2016年清华大学内部专家通宵熬夜出版中考考试真题',
                    url:'https://www.baidu.com'
                },{
                    id:'002',
                    title:'2015年清华大学内部专家通宵熬夜出版中考考试真题',
                    url:'https://www.baidu.com'
                }
            ]
        }
    }
    componentDidMount(){

    };
    render(){
        const items = this.state.itemData;
        console.log(items);
        const itemPage = items.map(function(item,index){
            return(
                <div key={index} className="questionsAll-item">
                    <div className="title"><h2><a href ={item.url}>{item.title}</a></h2></div>
                    <div className="btn looklook">查看</div>
                    <div className="btn doexam">做题</div>
                </div>
            )
        });
        return(
            <div className="questionsAll">
                <header><h2>真题</h2></header>
                <section>
                    {itemPage}
                </section>
            </div>
        )
    }
}
export default Question