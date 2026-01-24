import { request } from "@/utils"
export const getList = (params) => {
    return request({
        url: `/log/page?${params}`,
        method: 'GET',
    });
}