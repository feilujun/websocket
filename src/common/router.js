import React, { createElement } from 'react';
import { Spin } from 'antd';
import Loadable from 'react-loadable';

export const getRouterData = (app) => [
    {
        path: "/user/login",
        component: dynamicWrapper(app, ["login"], () => import('../routes/User/login'))
    },
    {
        path: "/",
        component: dynamicWrapper(app, [], () => import('../layouts/BasicLayout')),
        routes: [

            {
                path: "/setting",
                component: dynamicWrapper(app, ["setting"], () => import('../routes/setting')),
            },
            /***测试例子页面 end */

            /*---公共错误界面 start */
            {
                path: "/exception/403",
                component: dynamicWrapper(app, [], () => import('../routes/Exception/403')),
            },
            {
                path: "/exception/404",
                component: dynamicWrapper(app, [], () => import('../routes/Exception/404')),
            }, {
                path: "/exception/500",
                component: dynamicWrapper(app, [], () => import('../routes/Exception/500')),
            }
            /*---公共错误界面 end */
        ]
    }
]

//modal引入、按需加载处理
const modelNotExisted = (app, model) =>
    // eslint-disable-next-line
    !app._models.some(({ namespace }) => {
        return namespace === model.substring(model.lastIndexOf('/') + 1);
    });

const dynamicWrapper = (app, models, component) => {
    models.forEach(model => {
        if (modelNotExisted(app, model)) {
            // eslint-disable-next-line
            app.model(require(`../models/${model}`).default);
        }
    });

    if (component.toString().indexOf('.then(') < 0) {
        return component;
    }
    // () => import('module')
    return Loadable({
        loader: () => {
            return component().then(raw => {
                const Component = raw.default || raw;
                return props =>
                    createElement(Component, {
                        ...props,
                    });
            });
        },
        loading: ({ error, pastDelay }) => {
            if (pastDelay) {
                return <Spin size="large" style={{ width: "100%", margin: "40px 0px" }} />;
            } else {
                return null;
            }
        },
    });
};

