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
        this.state={
            position:props.position || [],
            id:props.id || '',
        }
    }
    componentDidMount(){
        let position = this.state.position;
        let PreDom = $('#Dialog-content'+(this.state.id-1));
        if(PreDom.length>0){
            let PrenowpositionL = PreDom.css('margin-left');//上一个弹框的样式
            let PrenowpositionT = PreDom.css('margin-top');
            let dom = $('#Dialog-content'+this.state.id);
            if(position.length>0){
                PrenowpositionL = Number(PrenowpositionL.replace(/px/,''));
                PrenowpositionT = Number(PrenowpositionT.replace(/px/,''));
                console.log("DialogMask-----new------<>>>>><<<<>>>>>>",position,PrenowpositionL,PrenowpositionT)
                dom.css('margin-left',(position[0]+PrenowpositionL) + 'px');
                dom.css('margin-top',(position[1]+PrenowpositionT) + 'px');
            }
        }
    }
    render() {
        console.warn("================DialogMask==========");
        let {title,children,closeDialog} = this.props;
        return (
            <div>
                <ShowMask></ShowMask>
                <div className="Dialog-content" id={"Dialog-content"+this.state.id}>
                    <header>
                        <h3>{title}</h3>
                        <Button className="exitbtn" onClick={closeDialog}>关闭</Button>
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