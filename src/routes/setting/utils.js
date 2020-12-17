import React from "react"
import { Divider, Button } from "antd"
export function getColumns(page) {
    return [{
        title: '序号',
        dataIndex: 'index',
        key: 'index',
    },
    {
        title: '姓名',
        dataIndex: 'name',
        key: 'name',
    },
    {
        title: '年龄',
        dataIndex: 'age',
        key: 'age',
    },
    {
        title: '出生日期',
        dataIndex: 'birthday',
        key: 'birthday',
    },
    {
        title: '籍贯',
        dataIndex: 'address',
        key: 'address',
    },
    {
        title: '工资',
        dataIndex: 'salary',
        key: 'salary',
        align: "right"
    },
    {
        title: '公司',
        dataIndex: 'company',
        key: 'company',
    },
    {
        title: '操作',
        key: 'action',
        render: (text, record) => (
            <span>
                <Button type="primary" onClick={() => page.update(record)}>
                    修改
                </Button>
                <Divider type="vertical" />
                <Button type="primary" onClick={() => page.delete(record.id)}>
                    删除
                </Button>
            </span>
        ),
    }]
}