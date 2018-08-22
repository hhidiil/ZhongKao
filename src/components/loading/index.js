/**
 * 加载图标
 * Created by gaoju on 2018/8/16.
 */
import React, { Cmponent } from 'react'
import {Spin } from 'antd'


class Loading extends React.Component {
    constructor(props) {
        super(props)
        this.state={
            size: props.size || "small",//默认显示小的
            tip:props.tip || ''
        }
    }
    render() {
        const {size,tip} = this.state;
        const css = {
            textAlign:"center"
        }
        return (
            <div style={css}><Spin tip={tip} size={size} /></div>
        );
    }
}

export default Loading