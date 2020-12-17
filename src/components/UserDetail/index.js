import React, { PureComponent } from 'react'
import { Avatar, Icon, Menu, Dropdown } from 'antd';
import styles from "./index.module.less"
import store from "@/index"
import { language } from 'quant-ui';

const { getCurrentLanguage, setCurrentLanguage, translate } = language
class Index extends PureComponent {
    onClick = ({ key }) => {
        if (key === "1") {    //修改密码
            console.log("修改密码")
        } else if (key === "2") {   //退出登陆
            store.dispatch({
                type: "login/logout"
            })
        }
    }
    languageMenuClick = (e) => {
        if (!e.key) return;
        let language = "zh_CN";
        if (e.key === "en_US") {
            language = "en_US"
        }
        setCurrentLanguage(language);
    }
    languageMenu = () => {
        return <Menu
            onClick={this.languageMenuClick}
            defaultSelectedKeys={[getCurrentLanguage()]}
        >
            <Menu.Item key="zh_CN">中文</Menu.Item>
            <Menu.Item key="en_US">English</Menu.Item>
        </Menu>
    }
    menu = () => (
        <Menu onClick={this.onClick}>
            <Menu.Item key="1">
                <Icon type="edit" /> 修改密码
            </Menu.Item>
            <Menu.Divider />
            <Menu.Item key="2">
                <Icon type="logout" />退出登陆
            </Menu.Item>
        </Menu>
    )
    render() {
        let languageData = "中文";
        if (getCurrentLanguage() === "en_US") {
            languageData = "English"
        }
        return (
            <div className={styles['user-detail']} >
                <Dropdown overlay={this.languageMenu()}>
                    <span className={`${styles.language}`}>
                        <Icon type="setting" /> {languageData}
                    </span>
                </Dropdown>
                <Dropdown overlay={this.menu()}>
                    <div className={styles.user}>
                        <Avatar size={26} icon="user" />
                        <span style={{ position: "relative", top: "1px" }}>{translate("userName")}</span>
                        <Icon type="down" />
                    </div>
                </Dropdown>
            </div >
        )
    }
}

export default Index
