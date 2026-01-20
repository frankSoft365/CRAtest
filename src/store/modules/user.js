import { createSlice } from "@reduxjs/toolkit";
import { setToken as _setToken, getToken, request } from "@/utils";

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
    }
});

const { setToken, setUserInfo, setResult } = userReducer.actions;

const fetchLogin = (loginForm) => {
    return async (dispatch) => {
        const res = await request.post('/login', loginForm);
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
        const res = await request.get('/user/profile');
        dispatch(setUserInfo(res.data.data));
    };
};

const reducer = userReducer.reducer;

export { fetchLogin, setResult, fetchUserProfile };

export default reducer;