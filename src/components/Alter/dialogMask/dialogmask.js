/**
 * Created by gaoju on 2018/7/2.
 */
import React, { Cmponent } from 'react'
import './style.css'
import ShowMask from '../showMask'
import {Button} from 'antd'

class DialogMask extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        let {title,children,closeDialog} = this.props;
        return (
            <div>
                <ShowMask></ShowMask>
                <div className="Dialog-content">
                    <header>
                        <h3>{title}</h3>
                        <Button className="exit" onClick={closeDialog}>关闭</Button>
                    </header>
                    <section>
                        {children}
                    </section>
                </div>
            </div>
        );
    }
}

export default DialogMask