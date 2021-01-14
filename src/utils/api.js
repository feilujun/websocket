let basUrl = "";
export default {
    basUrl: basUrl,
    "example1": {
        findByQuery: basUrl + "/query",   //条件查询接口
        update: basUrl + "/update",        //更新、修改接口
        delete: basUrl + "/delete",        //删除接口
        add: basUrl + "/add",           //添加接口
    },
    "example2": {
        findByQuery: basUrl + "/query2",   //条件查询接口
        update: basUrl + "/update",        //更新、修改接口
        delete: basUrl + "/delete",        //删除接口
        add: basUrl + "/add",           //添加接口
        setting: basUrl + "/add",           //添加接口
    },
    "setting": {
        findByQuery: basUrl + "/query",   //条件查询接口
        update: basUrl + "/update",        //更新、修改接口
        delete: basUrl + "/delete",        //删除接口
        add: basUrl + "/add",           //添加接口
    },
    "jsonPage": {
        getData: "/qdFrontServer/restfulservice/qdFrontTradeService/qryInstrumentWithMarketData"
    }
}