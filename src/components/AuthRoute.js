// 加到Layout页面组件外面，对其进行校验，
// 想查看这个界面就要校验是否有token
// 有token，高阶组件原样返回页面
// 没有token，高阶组件强制重定向登录页面
import { getToken } from "@/utils";
import { Navigate } from "react-router-dom";

function AuthRoute({ children }) {
    const token = getToken();
    if (token) {
        return <>{children}</>
    } else {
        return <Navigate to={'/login'} replace />
    }
}
export { AuthRoute };