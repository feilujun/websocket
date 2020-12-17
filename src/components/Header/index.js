import React, { PureComponent } from 'react'
import Menu from "../Menu"
import styles from "./index.module.less"
import UserDetail from "../UserDetail"
import { Link } from "dva/router"
import classNames from "classnames"
import config from "@/common/config"
class Header extends PureComponent {
    render() {
        let className = classNames(
            styles.header,
            styles[config.headertTheme]
        )
        let logo = config.headertTheme === "light" ? config.logoLight : config.logoDark
        return (
            <div className={className}>
                <Link to="/" className={styles.icon}>
                    <img src={logo}></img>
                </Link>
                <div className={styles.menu}>
                    <Menu />
                </div>
                <div className={styles.user}>
                    <UserDetail />
                </div>
            </div>
        )
    }
}

export default Header
