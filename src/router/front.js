/**
 * 项目路由配置
 * Created by gaoju on 2017/11/15.
 */
import React from 'react'
import { Route } from 'react-router'

import Door from '../container/front/door'
import Home from '../container/front/home'
import Register from '../container/front/register'
import Basic from '../container/front/page_modules/basic'
import Math from '../container/front/page_modules/math'
import Question from '../container/front/page_modules/math/math-question-all'
import Exam from '../container/front/page_modules/math/math-exam-all'

const routes = (
    <Route>
        <Route path="/" component={Door} />
        <Route path="/register" component={Register} />
        <Route path="/home" component={Home}>
            <Route path="basic" component={Basic} />
            <Route path="math" component={Math}/>
                <Route path="questions" component={Question} />
                <Route path="exam" component={Exam} />

        </Route>
    </Route>
);

export default routes