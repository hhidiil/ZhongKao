/**
 * 项目路由配置
 * Created by gaoju on 2017/11/15.
 */
import React from 'react'
import { Route } from 'react-router'

import Door from '../container/front/door'
import Home from '../container/front/home'
import Basic from '../container/front/page_modules/basic'
import Math from '../container/front/page_modules/math'

const routes = (
    <Route>
        <Route path="/" component={Door} />
        <Route path="/home" component={Home}>
            <Route path="basic" component={Basic} />
            <Route path="math" component={Math} />
            <Route path="english" component={Math} />
        </Route>
    </Route>
);

export default routes