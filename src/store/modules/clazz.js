import { createSlice } from "@reduxjs/toolkit";
import { request, toURLSearchParams } from "@/utils";

const clazzReducer = createSlice({
    name: "clazz",
    initialState: {
        rows: [],
        total: null,
        queryReturn: null,
        result: {
            code: null,
            message: null
        },
    },
    reducers: {
        setRows(state, action) {
            state.rows = action.payload;
        },
        setTotal(state, action) {
            state.total = action.payload;
        },
        setQueryReturn(state, action) {
            state.queryReturn = action.payload;
        },
        setResult(state, action) {
            state.result = action.payload;
        },
    }
});

const { setRows, setTotal, setQueryReturn, setResult } = clazzReducer.actions;

// 设置异常处理 获取员工列表
const defaultFetchList = (tableParams) => {
    return async (dispatch) => {
        const params = toURLSearchParams(tableParams).toString();
        const res = await request.get(`http://localhost:8080/clazzs?${params}`);
        const code = res.data.code;
        const data = res.data.data;
        const message = res.data.msg;
        dispatch(setResult({ code: code, message: message }));
        if (code === 1) {
            dispatch(setRows(data.rows));
            dispatch(setTotal(data.total));
        }
    };
};

const deleteEmpByIds = (ids, tableParams) => {
    return async (dispatch) => {
        const params = toURLSearchParams(ids).toString();
        console.log("url参数 : ", params);
        await request.delete(`http://localhost:8080/emps?${params}`);
        console.log('已发送delete请求');
        dispatch(defaultFetchList(tableParams));
    }
}

const addEmp = (emp, tableParams) => {
    return async (dispatch) => {
        await request.post('http://localhost:8080/emps', emp);
        console.log('已发送add请求');
        dispatch(defaultFetchList(tableParams));
    }
}

// 设置异常处理 更改员工信息
const updateEmp = (emp, tableParams) => {
    return async (dispatch) => {
        const res = await request.put('http://localhost:8080/emps', emp);
        console.log('已发送update请求');
        const code = res.data.code;
        const message = res.data.msg;
        dispatch(setResult({ code: code, message: message }));
        if (code === 1) {
            dispatch(defaultFetchList(tableParams));
        }
    }
}

// 设置异常处理 获取查询回显的员工信息
const getQueryReturnById = (id) => {
    return async (dispatch) => {
        console.log('发送查询回显请求！');
        const res = await request.get('http://localhost:8080/emps/' + id);
        console.log('查询回显获取到员工信息：', res.data.data);
        const code = res.data.code;
        if (code === 1) {
            dispatch(setQueryReturn(res.data.data));
        }
    };
};
// // 获取员工职位人数
// const getEmpJobData = () => {
//     return async (dispatch) => {
//         const res = await request.get('http://localhost:8080/report/empJobData');
//         const code = res.data.code;
//         if (code === 1) {
//             dispatch(setEmpJobStats(res.data.data));
//         }
//     }
// }
// // 获取员工性别人数
// const getEmpGenderData = () => {
//     return async (dispatch) => {
//         const res = await request.get('http://localhost:8080/report/empGenderData');
//         const code = res.data.code;
//         if (code === 1) {
//             dispatch(setEmpGenderStats(res.data.data));
//         }
//     }
// }

const reducer = clazzReducer.reducer;

export {
    defaultFetchList,
    deleteEmpByIds,
    addEmp,
    updateEmp,
    getQueryReturnById,
    setQueryReturn,
    setResult,
    // getEmpJobData,
    // getEmpGenderData,
};

export default reducer;