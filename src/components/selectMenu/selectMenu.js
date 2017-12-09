/**
 * Created by gaoju on 2017/12/9.
 */
/**
 * Created by gaoju on 2017/11/16.
 */
import React, { Component } from 'react'
import { Link } from 'react-router'
import { Menu, Dropdown,Icon } from 'antd';
import './style.css'

class SelectMenu extends Component {
    constructor(props) {
        super(props)
    }
    render() {
        const menu = (
            <Menu>
                <Menu.Item key="0">
                    <Link to="/register">三角函数</Link>
                </Menu.Item>
                <Menu.Divider />
                <Menu.Item key="1">
                    <Link to="/register">股沟定理</Link>
                </Menu.Item>
            </Menu>
        );
        return (
            <div>
                <Dropdown overlay={menu} trigger={['click']}>
                    <a className="ant-dropdown-link" href="#">提示</a>
                </Dropdown>
            </div>
        );
    }
}

export default SelectMenu