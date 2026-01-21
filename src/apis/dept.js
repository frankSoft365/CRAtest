import { request } from "@/utils";
export function getList() {
    return request({
        url: '/depts',
        method: 'GET',
    });
}
export function deleteById(id) {
    return request({
        url: `/depts?id=${id}`,
        method: 'DELETE',
    });
}
export function add(dept) {
    return request({
        url: '/depts',
        method: 'POST',
        data: dept,
    });
}
export function update(dept) {
    return request({
        url: '/depts',
        method: 'PUT',
        data: dept,
    });
}

export function getInfoById(id) {
    return request({
        url: `/depts/${id}`,
        method: 'GET',
    });
}