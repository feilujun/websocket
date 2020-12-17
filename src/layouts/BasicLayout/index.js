import React, { PureComponent } from 'react'
import { Switch, Redirect, Route } from "dva/router"
import { RouteWithSubRoutes } from "@/router"
import Header from "@/components/Header"
import NotFound from '@/routes/Exception/404';
import { getLoginStatu } from "@/utils/storage"
import styles from "./index.module.less";

class BasicLayout extends PureComponent {
    render() {
        let routes = this.props.routes || []
        return (
            <div className={styles.layout}>
                <Header />
                <div className={styles.content}>
                    <Switch>
                        {/* {!getLoginStatu() && <Redirect to="/user/login" />} */}
                        <Redirect exact from="/" to="/setting" />
                        {routes.map((route, i) => (
                            <RouteWithSubRoutes key={i} {...route} />
                        ))}
                        <Route render={NotFound} />
                    </Switch>
                </div>
            </div>
        )
    }
}

export default BasicLayout
