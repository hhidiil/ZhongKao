/**
 * Created by gaoju on 2017/11/15.
 */
import React,{Component} from 'react'
import './style.css'
import { Menu, Icon } from 'antd'


const SubMenu = Menu.SubMenu;
const MenuItemGroup = Menu.ItemGroup;

class Home extends Component {
    constructor(props) {
        super(props)
        this.state = {
            openKeys: ['sub1']
        };
    }

    handleClick = (e) => {
        console.log('click ', e);
    }
    exit(){
        alert("exit!")
    }
    render() {
        return (
            <div>
                <header id="header-home" className="flex-box box-align-center justify-center">
                    <div className="full-width position-relative width-max-xxlarge">
                        <div className="logolay"><a href="http://www.idiil.com.cn/index.html" ><img src="public/images/uu14.png"/></a></div>
                        <div className="header-check-btn">
                            <Icon type="logout" style={{cursor:"pointer"}} onClick={this.exit}></Icon>
                        </div>
                    </div>
                </header>
                <section>
                    <Menu
                        onClick={this.handleClick}
                        style={{ width: 240 }}
                        defaultSelectedKeys={['1']}
                        defaultOpenKeys={['sub1']}
                        mode="inline"
                    >
                        <SubMenu key="sub1" title={<span><Icon type="mail" /><span>Navigation One</span></span>}>
                            <MenuItemGroup key="g1" title="Item 1">
                                <Menu.Item key="1">Option 1</Menu.Item>
                                <Menu.Item key="2">Option 2</Menu.Item>
                            </MenuItemGroup>
                            <MenuItemGroup key="g2" title="Item 2">
                                <Menu.Item key="3">Option 3</Menu.Item>
                                <Menu.Item key="4">Option 4</Menu.Item>
                            </MenuItemGroup>
                        </SubMenu>
                        <SubMenu key="sub2" title={<span><Icon type="appstore" /><span>Navigation Two</span></span>}>
                            <Menu.Item key="5">Option 5</Menu.Item>
                            <Menu.Item key="6">Option 6</Menu.Item>
                            <SubMenu key="sub3" title="Submenu">
                                <Menu.Item key="7">Option 7</Menu.Item>
                                <Menu.Item key="8">Option 8</Menu.Item>
                            </SubMenu>
                        </SubMenu>
                        <SubMenu key="sub4" title={<span><Icon type="setting" /><span>Navigation Three</span></span>}>
                            <Menu.Item key="9">Option 9</Menu.Item>
                            <Menu.Item key="10">Option 10</Menu.Item>
                            <Menu.Item key="11">Option 11</Menu.Item>
                            <Menu.Item key="12">Option 12</Menu.Item>
                        </SubMenu>
                    </Menu>
                    <section>

                    </section>

                </section>

            </div>

        );
    }
}

export default Home
