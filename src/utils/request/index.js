import fetch from 'dva/fetch';
import { routerRedux } from 'dva/router';
import axios from "axios";
import { stringify } from 'qs';
import { message } from "antd";
import store from "../../index";
import _api from "../api";
import { isObject } from "lodash";
import { notification } from "antd";
import { parseJSON, requestHeader } from "./config";
const codeMessage = {
    200: '服务器成功返回请求的数据。',
    201: '新建或修改数据成功。',
    202: '一个请求已经进入后台排队（异步任务）。',
    204: '删除数据成功。',
    400: '发出的请求有错误，服务器没有进行新建或修改数据的操作。',
    401: '用户没有权限（令牌、用户名、密码错误）。',
    403: '用户得到授权，但是访问是被禁止的。',
    404: '发出的请求针对的是不存在的记录，服务器没有进行操作。',
    406: '请求的格式不可得。',
    410: '请求的资源被永久删除，且不会再得到的。',
    422: '当创建一个对象时，发生一个验证错误。',
    500: '服务器发生错误，请检查服务器。',
    502: '网关错误。',
    503: '服务不可用，服务器暂时过载或维护。',
    504: '网关超时。'
}
function checkStatus(e) {
    try {
        //请求失败
        let response = e.response
        if (response.status === 401 || response.status === 801) {
            const { dispatch } = store;
            dispatch({
                type: "login/goLogin"
            })
        } else {
            const errortext = codeMessage[response.status] || response.statusText;
            notification.error({
                message: `${"请求错误"} ${response.status}: ${response.config.url}`,
                description: errortext,
            });
        }
    } catch (error) {
        notification.error({
            message: `${"请求错误"}`,
            description: "发生未知错误",
        });
    }
    return {
        code: 10000000000
    }
}
function request(url, newOptions, showMessage = true) {
    return axios({
        url,
        ...newOptions
    })
        .then((response) => {
            let data = response.data;
            if (data.errorCode === 0) {
                return data;
            } else if (data.errorCode === 401) {
                const { dispatch } = store;
                dispatch({
                    type: "login/logout"
                })
                return data
            } else {
                showMessage && message.error(data.message)
                return data
            }
        })
        .catch(checkStatus)
}

/**
 * 
 * @param {string} url 请求地址
 * @param {any} params 请求参数
 * @param {Boolean} showMessage 是否显示错误提示，默认为false
 */
function GET(url, params, showMessage) {
    let _params = !!params ? "?" + stringify(params) : "";
    return request(url + _params, {
        method: "GET",
        headers: requestHeader,
        credentials: 'include'
    }, showMessage)
}

/**
 * 
 * @param {string} url 请求地址
 * @param {any} params 请求参数
 * @param {Boolean} showMessage 是否显示错误提示，默认为false
 */
function POST(url, params, showMessage) {
    return request(url, {
        method: "POST",
        headers: { ...requestHeader },
        data: params,
    }, showMessage)
}

function FormPOST(url, formData, showMessage) {
    return request(url, {
        method: "POST",
        headers: {
            'Accept': '*',
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        data: stringify(formData),
        credentials: 'include',
    }, showMessage)
}

export function upload(url, file, showMessage) {
    let formData = new FormData()
    let params = { file }
    if (isObject(params)) {
        for (const key in params) {
            if (params.hasOwnProperty(key)) {
                formData.append(key, params[key])
            }
        }
    }
    return request(url, {
        method: "POST",
        headers: { 
            "Content-Type": "multipart/form-data",
        },
        data: formData,
    }, showMessage)
}

export const api = _api;
export { POST };
export { GET };
export { FormPOST };
export const UPLOAD = upload;