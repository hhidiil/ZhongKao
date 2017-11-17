/**
 * Created by gaoju on 2017/11/16.
 */
import React, { Component } from 'react'
import { Modal, Button } from 'antd';
import Login from '../../login/login'
import './style.css'

class MaskAlter extends React.Component {
    constructor(props) {
        super(props)
        this.state={
            modalVisible: false,
            title:props.title
        }
    }
    setModalVisible(modalVisible) {
        this.setState({modalVisible});
    }
    render() {
        return (
            <div>
                <a type="primary" onClick={() => this.setModalVisible(true)}>{this.state.title}</a>
                <Modal
                    title="Login"
                    footer=""
                    maskClosable={false}
                    wrapClassName="vertical-center-modal"
                    visible={this.state.modalVisible}
                    onCancel={() => this.setModalVisible(false)}
                >
                    <Login></Login>
                </Modal>
            </div>
        );
    }
}

export default MaskAlter