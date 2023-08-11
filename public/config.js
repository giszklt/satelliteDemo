// api接口地址
window.apiUrl = "http://127.0.0.1";
// 地图服务
// window.mapUrl = "http://192.168.0.145";//home address
window.mapUrl = "http://192.168.1.188"; //home address
// window.mapUrl = "http://127.0.0.1";
//
// 返回在vue模板中的调用接口
export default {
    config: {
        api: window.apiUrl + ":8188",
    }

}