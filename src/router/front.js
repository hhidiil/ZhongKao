/**
 * 项目路由配置
 * Created by gaoju on 2017/11/15.
 */
import React from 'react'
import { Route } from 'react-router'

import Door from '../container/front/door'
import Home from '../container/front/home'

const routes = (
    <Route>
        <Route path="/" component={Door} />
        <Route path="/home" component={Home} />
    </Route>
);

export default routes