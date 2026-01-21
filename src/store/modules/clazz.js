import { createSlice } from "@reduxjs/toolkit";
import { toURLSearchParams } from "@/utils";
import { add, deleteById, getAll, getInfoById, getList, update } from "@/apis/clazz";

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
        allClazz: [],
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
        setAllClazz(state, action) {
            state.allClazz = action.payload;
        },
    }
});

const { setRows, setTotal, setQueryReturn, setResult, setAllClazz } = clazzReducer.actions;

// 设置异常处理 获取员工列表
const defaultFetchList = (tableParams) => {
    return async (dispatch) => {
        const params = toURLSearchParams(tableParams).toString();
        const res = await getList(params);
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

const deleteClazzById = (id, tableParams) => {
    return async (dispatch) => {
        const res = await deleteById(id);
        console.log('已发送delete请求');
        const code = res.data.code;
        const message = res.data.msg;
        dispatch(setResult({ code: code, message: message }));
        if (code === 1) {
            dispatch(defaultFetchList(tableParams));
        }
    }
}

const addClazz = (clazz, tableParams) => {
    return async (dispatch) => {
        const res = await add(clazz);
        console.log('已发送add请求');
        const code = res.data.code;
        const message = res.data.msg;
        dispatch(setResult({ code: code, message: message }));
        if (code === 1) {
            dispatch(defaultFetchList(tableParams));
        }
    }
}

// 设置异常处理 更改班级信息
const updateClazz = (clazz, tableParams) => {
    return async (dispatch) => {
        const res = await update(clazz);
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
        const res = await getInfoById(id);
        console.log('查询回显获取到班级信息：', res.data.data);
        const code = res.data.code;
        if (code === 1) {
            dispatch(setQueryReturn(res.data.data));
        }
    };
};
// 查询所有班级
const getAllClazz = () => {
    return async (dispatch) => {
        const res = await getAll();
        const code = res.data.code;
        if (code === 1) {
            dispatch(setAllClazz(res.data.data));
        }
    }
};


const reducer = clazzReducer.reducer;

export {
    defaultFetchList,
    deleteClazzById,
    addClazz,
    updateClazz,
    getQueryReturnById,
    setQueryReturn,
    setResult,
    getAllClazz,
};

export default reducer;