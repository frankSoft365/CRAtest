import { request } from "@/utils";
export function getList(params) {
    return request({
        url: `/students?${params}`,
        method: 'GET',
    });
}
export function deleteByIds(params) {
    return request({
        url: `/students/${params}`,
        method: 'DELETE',
    });
}
export function addStu(stu) {
    return request({
        url: '/students',
        method: 'POST',
        data: stu,
    });
}
export function updateStu(stu) {
    return request({
        url: '/students',
        method: 'PUT',
        data: stu,
    });
}

export function getInfoById(id) {
    return request({
        url: `/students/${id}`,
        method: 'GET',
    });
}

export function getStuCountData() {
    return request({
        url: '/report/studentCountData',
        method: 'GET',
    });
}

export function getStuDegreeData() {
    return request({
        url: '/report/studentDegreeData',
        method: 'GET',
    });
}

export function updateViolation(id, score) {
    return request({
        url: `/students/violation/${id}/${score}`,
        method: 'PUT',
    });
}