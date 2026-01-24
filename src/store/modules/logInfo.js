import { createSlice } from "@reduxjs/toolkit";
import { toURLSearchParams } from "@/utils";
import {
    getList
} from "@/apis/logInfo";
const logInfoReducer = createSlice({
    name: "logInfo",
    initialState: {
        rows: [],
        total: null,
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
        setResult(state, action) {
            state.result = action.payload;
        },
        removeResult(state) {
            state.result = { code: null, message: null };
        },
    }
});
const { setRows,
    setTotal,
    setResult,
    removeResult,
} = logInfoReducer.actions;
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

const reducer = logInfoReducer.reducer;

export {
    defaultFetchList,
    removeResult,
};

export default reducer;