/**
 * Created by gaoju on 2017/12/21.
 */
import React,{Component} from 'react'
import './style.css'
import ReactDom from 'react-dom'

class Pagination extends Component{
    constructor(props){
        super(props)
        this.state={
            current:props.current || 1,
            total:props.total || 5,
            arrayList:[]
        }
    }
    componentDidMount(){
    }
    _pageItem(num){
        var List = '';
        for(let i=0;i<num;i++){
            List = List + '<li><a ref="1">i</a></li>';
        }
        console.log("List---",List)
    }
    handleClick(e){
        console.log(e)
    }
    render(){

        console.log(this.state.total)
        return(
            <div className="myPagination">
                <nav aria-label="Page navigation">
                    <ul className="pagination">
                        <li>
                            <a aria-label="Previous">
                                <span aria-hidden="true">&laquo;</span>
                            </a>
                        </li>
                        {this._pageItem(5)}
                        <li>
                            <a aria-label="Previous">
                                <span aria-hidden="true">&raquo;</span>
                            </a>
                        </li>
                    </ul>
                </nav>
            </div>
        )
    }
}
export default Pagination