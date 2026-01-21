// user.js中的请求
import { request } from "@/utils";
export function loginAPI(formData) {
    return request({
        url: '/login',
        method: 'POST',
        data: formData,
    });
}
export function getProfileAPI() {
    return request({
        url: '/user/profile',
        method: 'GET',
    });
}