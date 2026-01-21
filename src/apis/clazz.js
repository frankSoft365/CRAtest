import { request } from "@/utils";
export function getList(params) {
    return request({
        url: `/clazzs?${params}`,
        method: 'GET',
    });
}
export function deleteById(id) {
    return request({
        url: `/clazzs/${id}`,
        method: 'DELETE',
    });
}
export function add(clazz) {
    return request({
        url: '/clazzs',
        method: 'POST',
        data: clazz,
    });
}
export function update(clazz) {
    return request({
        url: '/clazzs',
        method: 'PUT',
        data: clazz,
    });
}

export function getInfoById(id) {
    return request({
        url: `/clazzs/${id}`,
        method: 'GET',
    });
}

export function getAll() {
    return request({
        url: '/clazzs/list',
        method: 'GET',
    });
}