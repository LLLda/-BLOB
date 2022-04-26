import axios from "axios";

const service = axios.create({
  // process.env.NODE_ENV === 'development' 来判断是否开发环境
  // easy-mock服务挂了，暂时不使用了
  // baseURL: 'http://127.0.0.1:8001',
  headers: {
    // get: {
    //   "Content-Type": "application/x-www-form-urlencoded;charset=utf-8",
    //   // 在开发中，一般还需要单点登录或者其他功能的通用请求头，可以一并配置进来
    // },
    // post: {
    //   "Content-Type": "application/json;charset=utf-8",
    //   // 在开发中，一般还需要单点登录或者其他功能的通用请求头，可以一并配置进来
    // },
  },
  timeout: 5000,
});

service.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    console.log(error);
    return Promise.reject();
  }
);

service.interceptors.response.use(
  (response) => {
    if (response.status === 200) {
      return response.data;
    } else {
      Promise.reject();
    }
  },
  (error) => {
    console.log(error);
    return Promise.reject();
  }
);

export default service;
