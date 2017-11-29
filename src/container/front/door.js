/**
 * Created by gaoju on 2017/11/15.
 */
import React, { Component } from 'react'
import { Link } from 'react-router'
import { Menu, Dropdown, Icon } from 'antd'
import './style.css'
import Login from './login'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { getHomeShowList } from '../../redux/actions/user'

class Door extends Component {
    constructor(props) {
        super(props)
        this.state={
            showList:[]
        }
    }
    componentDidMount(){
        console.log(this.props)
        console.log("getQuestionsList success-->:");
        this.props.actions.getHomeShowList({
            success: (data) => {
                console.log("getQuestionsList success-->:"+data);
                this.setState({showList : JSON.parse(data)})
            },
            error: (message) => {
                this.props.form.setFields({
                    password: {
                        errors: [new Error(message || "数据错误")]
                    }
                });

            }
        })
    };
    _showListItem(showList){
        const showItem = showList.map((item,index)=>{
            return (
                <div key={index} className="showListAll">
                    <div className="showlist"><img src={item.url_img} /></div>
                    <div>我是谁</div>
                </div>
            )
        },this)
        return showItem
    }
    render() {
        const showList = this.state.showList;
        const menu = (
            <Menu>
                <Menu.Item key="0">
                    <Login title="登录"></Login>
                </Menu.Item>
                <Menu.Item key="1">
                    <Link to="/register">注册</Link>
                </Menu.Item>
                <Menu.Divider />
                <Menu.Item key="3">退出</Menu.Item>
            </Menu>
        );
        return (
            <div>
                <header id="header" className="header flex-box box-align-center justify-center">
                    <div className="full-width position-relative width-max-xxlarge">
                        <div className="logolay"><a href="http://www.idiil.com.cn/index.html" ><img src="public/images/uu14.png"/></a></div>
                        <div className="header-check-btn">
                            <Dropdown overlay={menu} trigger={['click']}>
                            <a className="ant-dropdown-link color-white" href="#">
                                Click me <Icon type="down" />
                            </a>
                            </Dropdown>
                        </div>
                    </div>
                </header>
                <div className="mainWapper">
                    <section className="page banner-wapper1">
                        <div className="content">
                            <label style={{fontSize:"1.18rem"}}>Title</label>
                            <h1 style={{fontSize:"3rem"}}>senior high school entrance examination</h1>
                            <p style={{fontSize:"24px",lineHight:1.5}}>This system can help you !</p>
                        </div>
                    </section>
                    <section className="banner-wapper2 flex-box box-align-center justify-center">
                        <div className="content">
                            <h1 style={{fontSize:"2.5rem"}}>中考(senior high school entrance examination)</h1>
                            <p style={{fontSize:"24px",lineHight:1.5}}>中考，全称为初中学业水平考试。是检测初中在校生是否达到初中学业水平的水平性考试和建立在九年义务教育基础上的高中选拔性考试；是初中毕业证发放的必要条件，考试科目将国家课程方案所规定的学科全部列入初中学业水平考试的范围。学生可根据中考成绩报考相应的普通高中、职业高中、中专、中技、中职等。其中以报考普通高中为主</p>
                        </div>
                    </section>
                    <section className="banner-wapper3">
                        {this._showListItem(showList)}
                    </section>
                </div>
            </div>
        )
    }
}
function mapStateToProps(state) {
    return {}
}

function mapDispatchToProps(dispatch) {
    return { actions: bindActionCreators({getHomeShowList}, dispatch) }
}

export default connect(mapStateToProps, mapDispatchToProps)(Door)