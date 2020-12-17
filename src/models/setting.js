import { POST, GET, api } from '@/utils/request';
import { message } from "antd"
export default {
    namespace: 'setting',
    state: {
        //modal弹框数据
        addVisible: false,   //modal弹框显示隐藏
        isUpdate: false,     //当前modal弹框状态  添加还是修改
        currentData: {},     //当前操作数据

        //列表数据
        dataSource: [],       //表格数据
        queryCondition: {},   //查询条件

        //分页信息
        pageNum: 1,
        pageSize: 10,
        totalCount: 0,
    },
    effects: {
        //条件查询
        *findByQuery({ payload }, {call, put, select }){
            const { queryCondition } = yield select(({ setting }) => setting)
            let params = payload || queryCondition;
            const { errorCode, data, pageNum, pageSize, totalCount } = yield call(GET, api.setting.findByQuery, params);
            if(errorCode === 0){
                yield put({
                    type: "save",
                    payload: {
                        dataSource: data,
                        pageNum: params.pageNum,
                        pageSize: params.pageSize,
                        totalCount: totalCount,

                        queryCondition:params
                    }
                })
            }
        },

        //新增添加
        *add({ payload }, { call, put, select }) {
            const { errorCode, data } = yield call(POST, api.setting.delete, payload);
            if(errorCode === 0){
                message.success("新增成功!");
                yield put({
                    type: "save",
                    payload: {
                        addVisible: false
                    }
                })
                yield put({
                    type: "findByQuery"
                })
            }
        },

        //删除
        *delete({ payload }, { call, put, select }){
            const { errorCode, data } = yield call(POST, api.setting.delete, payload);
            if(errorCode === 0) {
                message.success("删除成功!");
                yield put({
                    type: "findByQuery"
                })
            }
        },

        //修改
        *update({ payload }, { call, put, select }){
            const { errorCode, data} = yield call(POST, api.setting.update, payload);
            if(errorCode === 0){
                message.success("修改成功");
                yield put({
                    type: "save",
                    payload: {
                        addVisible: false
                    }
                })
                yield put({
                    type: "findByQuery"
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