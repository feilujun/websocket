const menuData = [
    {
        name: 'websocket',
        icon: 'shop',
        path: '/setting', //必须唯一

    },
    {
        name: '账户',
        icon: 'user',
        path: 'user',
        showMenu: false,    //是否显示menu
        children: [
            {
                name: '登录',
                path: '/user/login',
            }
        ],
    },
];

export default menuData;
