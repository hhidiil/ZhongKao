/**
 * 直接获取数据，不需要redux
 * Created by gaoju on 2017/11/28.
 */
import fetch from 'isomorphic-fetch'

export function getHomeShowList(opt) {
    console.log("getHomeShowList")
    const route = '../src/data/home.json';//本地数据
    return requestData(route,opt.success, opt.error)
}
function requestData(url,success=null, error=null){
    console.log("url:-->"+url)
    fetch(url).then(function (res) {
        return res.json()
    }).then(function (json) {
        success && success(JSON.stringify(json))
    }).catch((err) => {
        console.warn(err)
        error(err)
    });
}