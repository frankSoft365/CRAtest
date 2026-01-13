import { configureStore } from "@reduxjs/toolkit";
import userReducer from './modules/user';
import deptReducer from './modules/dept';
import empReducer from './modules/emp';
import clazzReducer from './modules/clazz';

export default configureStore({
    reducer: {
        user: userReducer,
        dept: deptReducer,
        emp: empReducer,
        clazz: clazzReducer,
    }
});