import React from "react";
import { routerRedux, Route, Switch } from 'dva/router';
import { ConfigProvider } from "antd";
import zh_CN from 'antd/lib/locale-provider/zh_CN';
import { getRouterData } from './common/router';

const { ConnectedRouter } = routerRedux;

export default function RouterConfig({ history, app }) {
    const routes = getRouterData(app);
    return (
        <ConfigProvider locale={zh_CN}>
            <ConnectedRouter history={history}>
                <Switch>
                    {routes.map((route, i) => (
                        <RouteWithSubRoutes key={i} {...route} />
                    ))}
                </Switch>
            </ConnectedRouter>
        </ConfigProvider>
    )
}

export const RouteWithSubRoutes = (route) => (
    <Route exact={route.routes && route.routes.length > 0 ? false : true} path={route.path} render={props => (
        <route.component {...props} routes={route.routes} />
    )} />
)