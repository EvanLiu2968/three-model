import axios from 'axios'
import Cookies from '@/utils/js-cookie'
import qs from 'qs'
// import { Message } from 'element-ui'

const isMobile = (() => {
  const ua = navigator.userAgent.toLowerCase()
  return /(Android|iOS|iPhone|iPad|iPod)/i.test(ua)
})()

const http = axios.create({
  headers: {
    'user_agent': 'web',
    'device_type': isMobile ? 2 : 1, // 1:pc 2:移动端(手机/平板)
    'device_env': window.navigator.userAgent,
  },
  paramsSerializer: function(params) {
    return qs.stringify(params, { arrayFormat: 'repeat' })
  }
})

// request interceptor
http.interceptors.request.use(
  config => {
    // do something before request is sent
    const token = Cookies.get('token')
    config.headers['Authorization'] = `kite ${token}`
    return config
  },
  error => {
    // do something with request error
    console.log(error) // for debug
    return Promise.reject(error)
  }
)

// response interceptor
http.interceptors.response.use(
  response => response,
  error => {
    if (error.response && error.response.status === 401) {
      window.localStorage.setItem('login_redirect', window.location.href)
      Cookies.remove('token')
      const redirect_uri = encodeURIComponent(`${window.location.protocol}//${window.location.host}/#/oauth2/callback`)
      window.location.href = `${error.response.data.login_url}?redirect_uri=${redirect_uri}`
    } else if (error.response && error.response.data.err === 16) {
      alert('当前账号已被禁用！')
    } else if (error.response && error.response.data.err === 1069) {
      alert('你没有当前操作的权限！')
    } else if (error.response && error.response.data.err === 30) {
      // Message.error('时间范围不超过一年')
    }
    return Promise.reject(error)
  }
)

export default http
