import { routerRedux } from 'dva/router';
import { setUserStatu, removeUserStatu } from "@/utils/storage"
export default {
    namespace: 'login',

    state: {


    },

    effects: {
        *login({ payload }, { call, put }) {
            //发送登陆请求
            //登陆成功
            setUserStatu()              //设置登陆状态
            window.location.href = window.location.origin;
        },
        *logout(_, { put }) {
            removeUserStatu();      //移除登陆状态
            yield put(              //跳转到登陆页面
                routerRedux.push({
                    pathname: '/user/login'
                })
            );
        },
    },

    reducers: {

    },
};
