import { request } from "@/utils";
export function getList(params) {
    return request({
        url: `/emps?${params}`,
        method: 'GET',
    });
}
export function deleteByIds(params) {
    return request({
        url: `/emps/${params}`,
        method: 'DELETE',
    });
}
export function add(emp) {
    return request({
        url: '/emps',
        method: 'POST',
        data: emp,
    });
}
export function update(emp) {
    return request({
        url: '/emps',
        method: 'PUT',
        data: emp,
    });
}

export function getInfoById(id) {
    return request({
        url: `/emps/${id}`,
        method: 'GET',
    });
}

export function getJobData() {
    return request({
        url: '/report/empJobData',
        method: 'GET',
    });
}

export function getGenderData() {
    return request({
        url: '/report/empGenderData',
        method: 'GET',
    });
}

export function getAll() {
    return request({
        url: '/emps/list',
        method: 'GET',
    });
}