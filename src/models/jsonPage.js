import { POST, FormPOST, GET, api } from '@/utils/request';
import { message } from "antd"
export default {
    namespace: 'jsonPage',

    state: {
        data: '',
        queryCondition: {},   //查询条件
    },

    effects: {
        //条件查询
        *getData({ payload }, { call, put, select }) {
            const { queryCondition } = yield select(({ jsonPage }) => jsonPage)
            let params = payload || queryCondition;
            const { errorCode, data } = yield call(FormPOST, api.jsonPage.getData, params);
            if (errorCode === 0) {
                yield put({
                    type: "save",
                    payload: {
                        data: data,
                        queryCondition: params
                    }
                })
            }
        },
    },
    reducers: {
        save(state, { payload }) {
            return {
                ...state, ...payload
            };
        }
    },
    subscriptions: {

    },
};
