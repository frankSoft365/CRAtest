import { createSlice } from "@reduxjs/toolkit";
import { setToken as _setToken, getToken, removeToken, request } from "@/utils";
import { loginAPI, getProfileAPI } from "@/apis/user";

const userReducer = createSlice({
    name: "user",
    initialState: {
        // 优先取本地储存内的token
        token: getToken() || '',
        userInfo: {},
        result: {
            code: null,
            message: null
        },
    },
    reducers: {
        setToken(state, action) {
            state.token = action.payload;
            // token持久化 存入浏览器本地存储
            _setToken(action.payload);
        },
        setUserInfo(state, action) {
            state.userInfo = action.payload;
        },
        setResult(state, action) {
            state.result = action.payload;
        },
        clearResult(state) {
            state.result = {
                code: null,
                message: null
            };
        },
        clearUserInfo(state) {
            // 清除token 用户信息
            state.token = '';
            state.userInfo = {};
            removeToken();
        },
    }
});

const { setToken, setUserInfo, setResult, clearUserInfo, clearResult } = userReducer.actions;

const fetchLogin = (loginForm) => {
    return async (dispatch) => {
        const res = await loginAPI(loginForm);
        const code = res.data.code;
        const data = res.data.data;
        const message = res.data.msg;
        dispatch(setResult({ code: code, message: message }));
        if (code === 1) {
            dispatch(setToken(data.token));
        }
    };
};

const fetchUserProfile = () => {
    return async (dispatch) => {
        const res = await getProfileAPI();
        dispatch(setUserInfo(res.data.data));
    };
};

const reducer = userReducer.reducer;

export { fetchLogin, setResult, fetchUserProfile, clearUserInfo, clearResult };

export default reducer;