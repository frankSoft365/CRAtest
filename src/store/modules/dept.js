import { createSlice } from "@reduxjs/toolkit";
import { add, deleteById, getInfoById, getList, update } from "@/apis/dept";

const deptReducer = createSlice({
    name: "dept",
    initialState: {
        list: [],
        queryReturn: null,
        result: {
            code: null,
            message: null
        },
    },
    reducers: {
        setList(state, action) {
            state.list = action.payload;
        },
        setQueryReturn(state, action) {
            state.queryReturn = action.payload;
        },
        setResult(state, action) {
            state.result = action.payload;
        },
    }
});

const { setList, setQueryReturn, setResult } = deptReducer.actions;

const fetchList = () => {
    return async (dispatch) => {
        const res = await getList();
        console.log(res.data.data);
        const code = res.data.code;
        const data = res.data.data;
        const message = res.data.msg;
        dispatch(setResult({ code: code, message: message }));
        if (code === 1) {
            dispatch(setList(data));
        }
    };
};

const deleteDeptById = (id) => {
    return async (dispatch) => {
        const res = await deleteById(id);
        console.log('已发送delete请求');
        const code = res.data.code;
        const message = res.data.msg;
        dispatch(setResult({ code: code, message: message }));
        if (code === 1) {
            dispatch(fetchList());
        }
    }
}

const addDept = (dept) => {
    return async (dispatch) => {
        const res = await add(dept);
        console.log('已发送add请求');
        const code = res.data.code;
        const message = res.data.msg;
        dispatch(setResult({ code: code, message: message }));
        if (code === 1) {
            dispatch(fetchList());
        }
    }
}

const updateDept = (dept) => {
    return async (dispatch) => {
        const res = await update(dept);
        console.log('已发送update请求');
        const code = res.data.code;
        const message = res.data.msg;
        dispatch(setResult({ code: code, message: message }));
        if (code === 1) {
            dispatch(fetchList());
        }
    }
}

const getDeptNameById = (id) => {
    return async (dispatch) => {
        const res = await getInfoById(id);
        console.log(res.data.data);
        const code = res.data.code;
        if (code === 1) {
            dispatch(setQueryReturn(res.data.data));
        }
    };
};


const reducer = deptReducer.reducer;

export { fetchList, deleteDeptById, addDept, updateDept, getDeptNameById, setResult };

export default reducer;