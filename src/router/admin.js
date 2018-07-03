/**
 * 教师系统项目路由配置
 * Created by gaoju on 2017/11/15.
 */
import React from 'react'
import { Route } from 'react-router'

import Login from '../container/admin/login'
import {isAdmin} from '../method_public/public'
import Main from '../container/admin/main'
import Register from '../container/admin/register'
import PaperList from '../container/admin/paperList'
import PaperDetail from '../container/admin/paperDetail'
import PaperDetailTwo from '../container/admin/paperDetailTwo'

const requireAuth = (nextState, replace) => {
    if (!isAdmin()) {
        window.confirm("请登录！")
        replace({ pathname: '/' })
    }
}
const routes = (
    <Route>
        <Route path="/" component={Login} />
        <Route path="/register" component={Register} />
        <Route path="/main" component={Main} onEnter={requireAuth} >
            <Route path="papers" component={PaperList} />
            <Route path="papers/:userid" component={PaperList} />
            <Route path="papers/paper/:userid/:paperid" component={PaperDetail} />
            <Route path="papers/paperTwo/:userid/:paperid" component={PaperDetailTwo} />
        </Route>
    </Route>
);

export default routes