//配置API接口地址
import config from '../../public/config'
let root=config.api;
import {
  Message
} from 'element-ui'


//引用axios
var axios = require('axios')

//自定义判断元素类型JS
function toType(obj) {
  return ({}).toString.call(obj).match(/\s([a-zA-Z]+)/)[1].toLowerCase()
}
//参数过滤函数
function filterNull(o) {
  for (var key in o) {
    if (o[key] === null) {
      delete o[key]
    }
    if (toType(o[key]) === 'string') {
      o[key] = o[key].trim()
    } else if (toType(0[key]) === 'object') {
      o[key] = filterNull(o[key])
    } else if (toType(o[key]) === 'array') {
      o[key] = filterNull(o[key])
    }
  }
  return o
}
/*
  接口处理函数
  这个函数每个项目都是不一样的，我现在调整的是适用于
  https://cnodejs.org/api/v1 的接口，如果是其他接口
  需要根据接口的参数进行调整。参考说明文档地址：
  https://cnodejs.org/topic/5378720ed6e2d16149fa16bd
  主要是，不同的接口的成功标识和失败提示是不一致的。
  另外，不同的项目的处理方法也是不一致的，这里出错就是简单的alert
*/

function apiAxios(method, url, params, success, failure) {
  // if (params) {
  //     params = filterNull(params)
  // }
  axios.interceptors.request.use(
    config => {
      if (localStorage.getItem('token')) {
        config.headers.token = localStorage.getItem('token');
      }
      return config;
    },
    error => {
      return Promise.reject(error);
    });
  axios({
      method: method,
      url: url,
      data: method === 'POST' || method === 'PUT' ? params : null,
      params: method === 'GET' || method === 'DELETE' ? params : null,
      baseURL: root,
      withCredentials: false
    }) //后端返回token过期的code码，前端根据此验证码判断是否清除用户信息；需解决用户一直登录时的token验证状态，是否增添定时刷新功能；
    .then(function (res) {
      if (res.status == 401) {
        // store.dispatch('user/FedLogOut').then(() => {
        //   Message({
        //     type: 'warning',
        //     message: 'Token失效将在三秒后退出到登录页面!',
        //     showClose: false,
        //   })
        //   setTimeout(() => {
        //     location.reload()
        //   }, 3000);
        // })
      }
      if (res.status == 400) {
        this.$message({
          message: "参数错误",
          type: "error"
         });
      }
      if (res.status == 500) {
        this.$message({
          message: "服务错误",
          type: "error"
         });
      }
      success(res.data)
    })
    .catch(function (err) {
      let res = err.response
      if (res) {
        if (res.status == 401) {
        //   store.dispatch('user/FedLogOut').then(() => {
        //     Message({
        //       type: 'warning',
        //       message: 'Token失效将在三秒后退出到登录页面!',
        //       showClose: false,
        //     })
        //     setTimeout(() => {
        //       location.reload()
        //     }, 3000);
        //   })
        }
        if(res.status==400){
          if(url.indexOf('/auth/login')!=-1){
            Message.error('用户名或密码错误')
          }else{
            // Message.error(res.data.message)
            Message.error(url+' 服务器连接中断！')
            setTimeout(() => {
              // location.reload()
            }, 1500);
          }
        }
      }
    })
}

function exportExcel(url, options = {}) {
  return new Promise((resolve, reject) => {
    axios.defaults.headers['content-type'] = 'application/json;charset=UTF-8'
    axios({
      method: 'post',
      url: url, // 请求地址
      data: options, // 参数
      responseType: 'blob' // 表明返回服务器返回的数据类型
    }).then(
      response => {
        resolve(response.data)
        let blob = new Blob([response.data], {
          type: 'application/vnd.ms-excel'
        })
        let fileName = Date.parse(new Date()) + '.xlsx'
        if (window.navigator.msSaveOrOpenBlob) {
          navigator.msSaveBlob(blob, fileName)
        } else {
          var link = document.createElement('a')
          link.href = window.URL.createObjectURL(blob)
          link.download = fileName
          link.click()
          //释放内存
          window.URL.revokeObjectURL(link.href)
        }
      },
      err => {
        reject(err)
      }
    )
  })
}




// 返回在vue模板中的调用接口
export default {
  get: function (url, params, success, failure) {
    return apiAxios('GET', url, params, success, failure)
  },
  post: function (url, params, success, failure) {
    return apiAxios('POST', url, params, success, failure)
  },
  put: function (url, params, success, failure) {
    return apiAxios('PUT', url, params, success, failure)
  },
  delete: function (url, params, success, failure) {
    return apiAxios('DELETE', url, params, success, failure)
  },
  fileOut: function (url, data) {
    return exportExcel(config.api + url, data)
  }
}
