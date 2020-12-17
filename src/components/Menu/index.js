import React, { PureComponent } from 'react'
import { Link } from 'dva/router';
import { Menu, Icon } from 'antd';
import menuData from "@/common/menu"
import { connect } from 'dva';
import confing from "@/common/config"
const { SubMenu } = Menu;

const getIcon = icon => {
    if (typeof icon === 'string') {
        return <Icon type={icon} />;
    }

    return icon;
};
@connect(({ routing }) => ({ location: routing.location }))
class Index extends PureComponent {
    //获取当前选中
    getSelectedMenuKeys = () => {
        return [this.props.location.pathname]
    }
    getMenuItemPath = item => {
        const itemPath = item.path;
        const icon = getIcon(item.icon);
        const { name } = item;

        const { location } = this.props;
        return (
            <Link
                to={itemPath}
                replace={itemPath === location.pathname}
            >
                {icon}
                <span>{name}</span>
            </Link>
        );
    };
    getNavMenuItems = (menusData) => {
        if (!menusData) {
            return [];
        }

        return menusData
            .filter(({ name, showMenu = true }) => name && showMenu)
            .map(item => {
                return this.getSubMenuOrItem(item)
            })
    }

    getSubMenuOrItem = (item) => {
        if (item.children && Array.isArray(item.children)) {
            const childrenItems = this.getNavMenuItems(item.children);
            // 当无子菜单时就不展示菜单
            if (childrenItems && childrenItems.length > 0) {
                return (
                    <SubMenu
                        title={
                            item.icon ? (
                                <span>
                                    {getIcon(item.icon)}
                                    <span>{item.name}</span>
                                </span>
                            ) : (
                                    item.name
                                )
                        }
                        key={item.path}
                    >
                        {childrenItems}
                    </SubMenu>
                );
            }

        } else {
            return <Menu.Item key={item.path}>{this.getMenuItemPath(item)}</Menu.Item>;
        }
    }
    render() {
        let selectedKeys = this.getSelectedMenuKeys();
        return (
            <Menu
                mode="horizontal"
                theme={confing.headertTheme}
                selectedKeys={selectedKeys}
            >
                {this.getNavMenuItems(menuData)}
            </Menu>
        )
    }
}

export default Index
