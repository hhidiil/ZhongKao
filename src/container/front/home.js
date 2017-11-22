/**
 * Created by gaoju on 2017/11/15.
 */
import React,{Component} from 'react'
import './style.css'
import { Menu, Icon } from 'antd'
// redux
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { push } from 'react-router-redux'
import { getBasic } from '../../redux/actions/basic'
import { getEnglish } from '../../redux/actions/english'
import { getMath } from '../../redux/actions/math'


const SubMenu = Menu.SubMenu;
const MenuItemGroup = Menu.ItemGroup;

class Home extends Component {
    constructor(props) {
        super(props)
        //this.pid = props.currentPage.get('id');
        this.state = {
            activeName:window.location.hash.split('/')[window.location.hash.split('/').length-1]
        };
    };
    componentDidMount(){
        document.body.style.backgroundColor = '#F5F5F5';
    };
    load(pid) {
        if (pid) {
            this.props.actions.getBasic({ params: {pid: pid }})
            this.props.actions.getEnglish({ params: {pid: pid }})
            this.props.actions.getMath({ params: {pid: pid }})
            this.pid = pid;
        }
    }

    componentWillReceiveProps(nextProps) {
        //this.setState({
        //    activeName: window.location.hash.split('/')[window.location.hash.split('/').length-1]
        //})
        //if (this.pid !== nextProps.currentPage.get('id')) {
        //    this.load(nextProps.currentPage.get('id'))
        //}
    }
    handleClick = (e) => {
        console.log('click ', e);
        let item = e;
        let route = item.keyPath.pop();
        console.log("item route-->"+route)
        this.props.actions.push(`/home/${route}`)
        this.setState({
            activeName: route
        })
    };
    exit(){
        window.alert("exit!")
    };
    render() {
        let { basic, english, math } = this.props;
        return (
            <div className="home">
                <header id="header-home" className="flex-box box-align-center justify-center">
                    <div className="full-width position-relative width-max-xxlarge">
                        <div className="logolay"><a href="http://www.idiil.com.cn/index.html" ><img src="public/images/uu14.png"/></a></div>
                        <div className="header-check-btn">
                            <Icon type="logout" style={{cursor:"pointer"}} onClick={this.exit}></Icon>
                        </div>
                    </div>
                </header>
                <section className="flex-box section-all">
                    <menu className="menu-css">
                        <Menu
                            onClick={this.handleClick}
                            style={{ width: 240 }}
                            defaultSelectedKeys={['1']}
                            defaultOpenKeys={['basic']}
                            mode="inline"
                        >
                            <SubMenu key="basic" title={<span><Icon type="mail" /><span>我的栏目</span></span>}>
                                <MenuItemGroup key="g1" title="英语">
                                    <Menu.Item key="1">试题 1</Menu.Item>
                                    <Menu.Item key="2">试题 2</Menu.Item>
                                </MenuItemGroup>
                                <MenuItemGroup key="g2" title="数学">
                                    <Menu.Item key="3">试题 3</Menu.Item>
                                    <Menu.Item key="4">试题 4</Menu.Item>
                                </MenuItemGroup>
                            </SubMenu>
                            <SubMenu key="english" title={<span><Icon type="appstore" /><span>英语栏目</span></span>}>
                                <Menu.Item key="5">口语练习 5</Menu.Item>
                                <Menu.Item key="6">阅读练习 6</Menu.Item>
                                <SubMenu key="sub3" title="测试习题">
                                    <Menu.Item key="7">练习 7</Menu.Item>
                                    <Menu.Item key="8">练习 8</Menu.Item>
                                </SubMenu>
                            </SubMenu>
                            <SubMenu key="math" title={<span><Icon type="setting" /><span>数学栏目 3</span></span>}>
                                <Menu.Item key="9">基本概念 9</Menu.Item>
                                <Menu.Item key="10">测试单元 10</Menu.Item>
                                <Menu.Item key="11">测试单元 11</Menu.Item>
                                <Menu.Item key="12">练习 12</Menu.Item>
                            </SubMenu>
                        </Menu>
                    </menu>
                    <section className="full-width section-left">
                        <div>{this.props.children}</div>
                    </section>

                </section>

            </div>

        );
    }
}
function mapStateToProps(state, ownProps) {
    return {
        //currentPage: state.currentPage,
        //basic: state.basic,
        //english: state.english,
        //math:state.math
    }
}

function mapDispatchToProps(dispatch) {
    return { actions: bindActionCreators({push,getBasic,getMath,getEnglish}, dispatch) }
}

export default connect(mapStateToProps, mapDispatchToProps)(Home)
