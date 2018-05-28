/**
 * Created by gaoju on 2017/11/15.
 */
import React, { Component } from 'react'
import { Link } from 'react-router'
import { Menu, Dropdown, Icon } from 'antd'
import 'antd/dist/antd.css';
import './style.css'
import Login from './login'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import PureRenderMixin from '../../method_public/pure-render'
import {handleImg} from '../../method_public/public'
import { getHomeShowList} from '../../redux/actions/page'

const colorList=["mediumorchid","cornflowerblue","chocolate","yellowgreen","tomato","gold"];
class Door extends Component {
    constructor(props) {
        super(props);
    }
    componentDidMount(){
        this.props.actions.getHomeShowList({})
    };
    _showListItem(showList){
        let pageSize = showList.get('items').size;
        if (pageSize > 0) {
            const showItem = showList.get('items').map((item,index)=>{
               let  color = {
                   background:colorList[index]
               }
                return (
                    <div key={index} className="col-sm-4">
                        <div className="thumbnail">
                            <img className="door_headimg" src={handleImg(item.get('headimg'))} title="头像" onError={(e)=>{e.target.src = "public/images/user_head.jpg"}}/>
                            <div className="caption message" style={color}>
                                <h3>{item.get('username')}</h3>
                                <p>{item.get('phone')}</p>
                            </div>
                        </div>
                    </div>
                )
            },this)
            return showItem
        }
    }
    _showWapper4List(){
        const showWapper =[];
        const showdata=["专题","模考","训练","检测","巩固","拓展"]
        for(let i=0;i<6;i++){
            showWapper.push(
                <div className="col-md-4 part" key={i}>
                    <i className={"sev-icon sev-icon"+(i+1)}></i>
                    <h3>{showdata[i]}</h3>
                    <p>这是一个很好的东西，你值得拥有。真的不用就会错过很多东西，肯定会帮助到你。</p>
                </div>)
        }
        return showWapper
    }
    render() {
        let { homeShowList } = this.props;
        let error = PureRenderMixin.Compare([homeShowList]);//优化render
        if (error) return error
        const menu = (
            <Menu>
                <Menu.Item key="0">
                    <Login title="登录"></Login>
                </Menu.Item>
                <Menu.Divider />
                <Menu.Item key="1">
                    <Link to="/register">注册</Link>
                </Menu.Item>
            </Menu>
        );
        return (
            <div className="door">
                <header id="header" className="header flex-box box-align-center justify-center">
                    <div className="full-width position-relative width-max-xxlarge">
                        <div className="logolay"><a href="http://www.idiil.com.cn/index.html" ><img src="public/images/uu14.png"/></a></div>
                        <div className="header-check-btn">
                            <Dropdown overlay={menu} trigger={['click']}>
                            <a className="ant-dropdown-link color-white" href="#">登录<Icon type="down" />
                            </a>
                            </Dropdown>
                        </div>
                    </div>
                </header>
                <div className="mainWapper">
                    <section className="page banner-wapper1">
                        <div className="content">
                            <p>senior high school entrance examination</p>
                        </div>
                    </section>
                    <section className="banner-wapper2 flex-box box-align-center justify-center">
                        <div className="content">
                            <h2>Welcome To Senior High School Entrance Examination</h2>
                            <p>中考，全称为初中学业水平考试。是检测初中在校生是否达到初中学业水平的水平性考试和建立在九年义务教育基础上的高中选拔性考试；是初中毕业证发放的必要条件，考试科目将国家课程方案所规定的学科全部列入初中学业水平考试的范围。学生可根据中考成绩报考相应的普通高中、职业高中、中专、中技、中职等。其中以报考普通高中为主</p>
                        </div>
                    </section>
                    <section className="banner-wapper3">
                        <div className="content">
                            <h3>特色部分</h3>
                            <div className="special-parts">
                                <div className="parts one">
                                    <div className="col-md-9">
                                        <p><span>Part one:</span>线下作业，为学生特定指派课程作业，旨在使学生能够自觉练习。，为学生特定指派课程作业，旨在使学生能够自觉练习.</p>
                                    </div>
                                    <div className="col-md-3">
                                        <img src="public/images/special3.png"/>
                                    </div>
                                    <div className="clearfix"></div>
                                </div>
                                <div className="parts two">
                                    <div className="col-md-3">
                                        <img src="public/images/special2.png"/>
                                    </div>
                                    <div className="col-md-9">
                                        <p><span>Part two:</span>线上作业，可以让学生回家后在家里做作业不需要课本，可以在线上模拟开始做题。可以让学生回家后在家里做作业不需要课本，可以在线上模拟开始做题。</p>
                                    </div>
                                    <div className="clearfix"></div>
                                </div>
                                <div className="parts three">
                                    <div className="col-md-9">
                                        <p><span>Part three:</span>一对一，此功能在最后阶段会给每一位学生指定一个老师进行一对一的辅导。给每一位学生指定一个老师进行一对一的辅导。给每一位学生指定一个老师进行一对一的辅导。</p>
                                    </div>
                                    <div className="col-md-3">
                                        <img src="public/images/special4.png"/>
                                    </div>
                                    <div className="clearfix"></div>
                                </div>
                            </div>
                        </div>
                    </section>
                    <section className="banner-wapper4">
                        <div className="content">
                            {this._showWapper4List()}
                        </div>
                    </section>
                    <section className="banner-wapper5">
                        <div className="content">
                            <h2>我们的成效</h2>
                            <div className="student-parts">
                                {this._showListItem(homeShowList)}
                                <div className="clearfix"></div>
                            </div>
                        </div>
                    </section>
                </div>
                <footer>
                    <div className="container">
                        <div className="footer-grids">
                            <div className="col-md-4">
                                <h3>加入我们</h3>
                                <p>北京爱迪乐教育研究院</p>
                            </div>
                            <div className="col-md-4">
                                <h3>联系我们</h3>
                                <p>101101101101</p>
                            </div>
                            <div className="col-md-4">
                                <h3>地址</h3>
                                <p>北京海淀区上地</p>
                            </div>
                            <div className="clearfix"></div>
                        </div>
                    </div>
                </footer>
            </div>
        )
    }
}
//将redux中state的对象与组件绑定起来。一一对应map对象
function mapStateToProps(state,ownProps) {
    return {
        homeShowList: state.homeShowList
    }
}
//使用bindActionCreators绑定action
function mapDispatchToProps(dispatch) {
    return { actions: bindActionCreators({getHomeShowList}, dispatch) }
}

export default connect(mapStateToProps, mapDispatchToProps)(Door)