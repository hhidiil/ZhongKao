/**
 * Created by gaoju on 2018/5/28.
 */
import {Modal,Button } from 'antd'
const confirm = Modal.confirm;


export function success(title,content){
    Modal.success({
        title: title,
        content: content
    });
}
export function error(title,content) {
    Modal.error({
        title: title,
        content: content
    });
}

export function warning(title,content) {
    Modal.warning({
        title: title,
        content: content
    });
}
export function showConfirm(content,callback) {
    confirm({
        content: content,
        onOk(){
            return callback();
        },
        onCancel(){
            console.log("cancel")
        }
    });
}