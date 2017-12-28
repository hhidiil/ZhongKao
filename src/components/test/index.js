/**
 * Created by gaoju on 2017/12/21.
 */
import React,{Component} from 'react'
import Pagination from '../pagination/pagination'

class Test extends Component{
    constructor(props){
        super(props)
    }
    render(){
        return(
            <div style={{padding:"20px"}}>
                <Pagination total={20}></Pagination>
            </div>
        )
    }
}
export default Test