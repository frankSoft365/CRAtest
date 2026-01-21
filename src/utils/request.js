import axios from "axios";
import { getToken, removeToken } from "./token";
import router from "@/router";

const request = axios.create({
    baseURL: 'http://localhost:8080',
    timeout: 5000
});

// Add a request interceptor
request.interceptors.request.use(function (config) {
    // Do something before request is sent
    // 注入token
    const token = getToken();

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, function (error) {
    // Do something with request error
    return Promise.reject(error);
});

// Add a response interceptor
request.interceptors.response.use(function onFulfilled(response) {
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data
    return response;
}, function onRejected(error) {
    // 拦截401 token失效跳转登录避免红屏
    if (error.response.status === 401) {
        removeToken();
        router.navigate('/login');
        window.location.reload();
    }

    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error
    return Promise.reject(error);
});

export { request };