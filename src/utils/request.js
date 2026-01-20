import axios from "axios";
import { getToken } from "./token";

const request = axios.create({
    baseURL: 'http://localhost:8080',
    timeout: 5000
});

// Add a request interceptor
request.interceptors.request.use(function (config) {
    // Do something before request is sent
    // 注入token
    const token = getToken();
    console.log('拦截器中的token : ', token);

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
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error
    return Promise.reject(error);
});

export { request };