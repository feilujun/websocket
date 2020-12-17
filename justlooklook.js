import React, { PureComponent } from 'react'
import { Form, Input, Button, Select, Row, Col, message, Drawer, Spin } from 'antd';
import { connect } from 'dva';
import EditJson from "./EditJson";
import dict from "@/utils/dict"
import HelpModal from "./Help"
import MetaModal from "./MetaModal";

let { datatypeOption, codeTypeOption, methodOption } = dict
@connect(({ source, options, loading }) => {
    const { selectedNode, details } = source
    return {
        selectedNode,
        details,
        options,
        loading: !!loading.effects['source/datasourceGet'] || !!loading.effects['source/dataSourceUpdate'] || !!loading.effects['source/dataSourceAdd']
    }
})
@Form.create()
class Index extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            value: "",  //url
            code: "",   //代码

            helpVisible: false,
        }
        this.EditJson = React.createRef()
    }
    componentDidMount = () => {
        const { selectedNode } = this.props;
        if (!!selectedNode.id) {
            this.details(selectedNode)
        }
    }
    onChange = (e) => {
        let value = e.target.value
        this.setState({
            value: value
        })
    }
    //获取数据源详情
    details = (selectedNode) => {
        const { id } = selectedNode;
        this.props.dispatch({
            type: "source/datasourceGet",
            payload: {
                datasourceCode: id
            }
        })
    }
    renderData = (details) => {
        if (!!details.datasourceCode) {
            if (details.codeType === "url") {
                this.setState({
                    value: details.codeContent,
                    code: ""
                })
            } else {
                this.setState({
                    value: "",
                    code: details.codeContent
                })
            }
        } else {
            this.setState({
                value: "",
                code: ""
            })
        }
    }
    componentWillReceiveProps = (nextProps) => {
        if (nextProps.selectedNode !== this.props.selectedNode) {
            this.props.form.resetFields()
            if (!!nextProps.selectedNode.id) {
                this.details(nextProps.selectedNode)
            }
        }
        if (nextProps.details !== this.props.details) {
            this.renderData(nextProps.details)
        }
    }
    testDataSource = () => {
        this.props.form.validateFields((error, value) => {
            if (error) {
                return
            }
            let codeContent = ""
            if (value.codeType === "url") {
                codeContent = this.state.value
            } else {
                if (this.EditJson.current) {
                    codeContent = this.EditJson.current.getValue();
                }
            }
            if (codeContent === undefined) {
                message.error("数据源不能为空")
                return
            }
            const { params = {}, ...otherValue } = value
            let _params = {
                ...otherValue,
                codeContent,
                params: JSON.stringify(params)
            }
            this.props.dispatch({
                type: "source/datasourceTest",
                payload: _params
            })
        })
    }
    saveDataSource = () => {
        this.props.form.validateFields((error, value) => {
            if (error) {
                return
            }
            let codeContent = undefined
            if (value.codeType === "url") {
                codeContent = this.state.value
            } else {
                if (this.EditJson.current) {
                    codeContent = this.EditJson.current.getValue();
                }
            }
            if (codeContent === undefined) {
                message.error("数据源不能为空")
                return
            }
            const { params = {}, ...otherValue } = value
            let _params = {
                ...otherValue,
                codeContent,
                params: JSON.stringify(params)
            }
            if (!!this.props.selectedNode.id) { //修改
                this.props.dispatch({
                    type: "source/dataSourceUpdate",
                    payload: _params
                })
            } else {
                this.props.dispatch({   //新增
                    type: "source/dataSourceAdd",
                    payload: _params
                })
            }
        })

    }
    datatypeChange = (value) => {
        if (value === "enum" && this.props.form.getFieldValue("codeType") === "url") {
            this.props.form.setFieldsValue({
                'params.method': "get"
            })
        }
    }

    //帮助点击事件
    helpClick = () => {
        this.setState({
            helpVisible: true,
            dataType: this.props.form.getFieldValue("dataType"),
            codeType: this.props.form.getFieldValue("codeType"),
        });
    }

    //元数据点击事件
    metaClick = () => {
        this.props.dispatch({
            type: "source/save",
            payload: {
                metaVisible: true
            }
        })
        this.props.dispatch({
            type: "source/getMetadata",
            payload: {
                datasourceCode: this.props.form.getFieldValue("datasourceCode"),
            }
        })
    }
    onClose = () => {
        this.setState({
            helpVisible: false
        });
    };
    render() {
        const { selectedNode, details, options } = this.props;
        const { getFieldDecorator, getFieldValue } = this.props.form;
        const formItemLayout = {
            labelCol: {
                span: 8,

            },
            wrapperCol: {
                span: 12
            },
        };
        let params = details.params
        try {
            params = JSON.parse(params) || {}
        } catch (error) {
            params = {}
        }
        return (
            <Spin spinning={this.props.loading}>
                <Form {...formItemLayout}>
                    {<Form.Item style={{ display: "none" }} label={`组代码`}>
                        {getFieldDecorator(`groupCode`, {
                            initialValue: selectedNode.pid,
                            rules: [
                                {
                                    required: true,
                                    message: '必填',
                                },
                            ],
                        })(<Input placeholder="请输入" />)}
                    </Form.Item>}
                    <Row>
                        <Col span={12}>
                            <Form.Item label={`数据名称`}>
                                {getFieldDecorator(`datasourceName`, {
                                    initialValue: selectedNode.name,
                                    rules: [
                                        {
                                            required: true,
                                            message: '必填',
                                        },
                                    ],
                                })(<Input placeholder="请输入" />)}
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            {selectedNode.id && <Form.Item label={`数据源代码`}>
                                {getFieldDecorator(`datasourceCode`, {
                                    initialValue: details.datasourceCode,
                                    rules: [
                                        {
                                            required: true,
                                            message: '必填',
                                        },
                                    ],
                                })(<Input disabled={true} placeholder="请输入" />)}
                            </Form.Item>}
                        </Col>
                    </Row>
                    <Row>
                        <Col span={12}>
                            <Form.Item label={`数据源类型`}>
                                {getFieldDecorator(`dataType`, {
                                    initialValue: details.dataType,
                                    rules: [
                                        {
                                            required: true,
                                            message: '必填',
                                        },
                                    ],
                                })(<Select placeholder="请选择" onChange={this.datatypeChange}>
                                    {datatypeOption.map(({ value, name }) => {
                                        return <Select.Option value={value} key={value}>{name}</Select.Option>
                                    })}
                                </Select>)}
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item label={`代码类型`}>
                                {getFieldDecorator(`codeType`, {
                                    initialValue: details.codeType || "url",
                                    rules: [
                                        {
                                            required: true,
                                            message: '必填',
                                        },
                                    ],
                                })(<Select placeholder="请选择" >
                                    {codeTypeOption.map(({ value, name }) => {
                                        return <Select.Option value={value} key={value}>{name}</Select.Option>
                                    })}
                                </Select>)}
                            </Form.Item>
                        </Col>
                    </Row>
                    {getFieldValue("codeType") === "url" && <Row>
                        <Col span={12}>
                            <Form.Item label={`方法类型`}m>
                                {getFieldDecorator(`params.method`, {
                                    initialValue: getFieldValue("dataType") === "enum" ? "get" : params.method,
                                    rules: [
                                        {
                                            required: true,
                                            message: '必填',
                                        },
                                    ],
                                })(<Select disabled={getFieldValue("dataType") === "enum"} placeholder="请选择" >
                                    {methodOption.map(({ value, name }) => {
                                        return <Select.Option value={value} key={value}>{name}</Select.Option>
                                    })}
                                </Select>)}
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item label={`服务`}>
                                {getFieldDecorator(`params.dsCode`, {
                                    initialValue: params.dsCode,
                                    rules: [
                                        {
                                            required: true,
                                            message: '必填',
                                        },
                                    ],
                                })(<Select placeholder="请选择" >
                                    {options.serverMap.map(({ value, name }) => {
                                        return <Select.Option value={value} key={value}>{name}</Select.Option>
                                    })}
                                </Select>)}
                            </Form.Item>
                        </Col>
                    </Row>}

                    {getFieldValue("codeType") === "sql" && <Row>
                        <Row>
                            <Col span={12}>
                                <Form.Item label={`数据库`}>
                                    {getFieldDecorator(`params.dsCode`, {
                                        initialValue: params.dsCode,
                                        rules: [
                                            {
                                                required: true,
                                                message: '必填',
                                            },
                                        ],
                                    })(<Select placeholder="请选择" >
                                        {options.dataBaseMap.map(({ value, name }) => {
                                            return <Select.Option value={value} key={value}>{name}</Select.Option>
                                        })}
                                    </Select>)}
                                </Form.Item>
                            </Col>
                        </Row>
                    </Row>}

                    {getFieldValue("dataType") === "enum" &&
                        < Row >
                            <Col span={12}>
                                <Form.Item label={`显示键值`}>
                                    {getFieldDecorator(`params.valueKey`, {
                                        initialValue: params.valueKey || "value",
                                        rules: [
                                            {
                                                required: true,
                                                message: '必填',
                                            },
                                        ],
                                    })(<Input placeholder="请选择" ></Input>)}
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item label={`显示名称`}>
                                    {getFieldDecorator(`params.nameKey`, {
                                        initialValue: params.nameKey || "name",
                                        rules: [
                                            {
                                                required: true,
                                                message: '必填',
                                            },
                                        ],
                                    })(<Input placeholder="请选择" ></Input>)}
                                </Form.Item>
                            </Col>
                        </Row>}
                </Form>

                <h2 style={{ color: "#fff" }}>数据源
                    <a onClick={this.helpClick} style={{ fontSize: 12, marginLeft: 14 }}>帮助</a>
                    {getFieldValue("dataType") === "table" && selectedNode.id && <a onClick={this.metaClick} style={{ fontSize: 12, marginLeft: 14 }}>元数据管理</a>}
                </h2>

                <Input onChange={this.onChange} value={this.state.value} style={{ display: getFieldValue("codeType") !== "url" ? "none" : "" }} ></Input>

                <div style={{ opacity: getFieldValue("codeType") === "url" ? 0 : 1 }}>
                    <EditJson ref={this.EditJson} value={this.state.code} language={getFieldValue("codeType")} />
                </div>


                <div style={{ textAlign: "right", marginTop: 14, paddingBottom: 14 }}>
                    <Button style={{ marginRight: 14 }} onClick={this.testDataSource}> 测试数据源</Button>
                    <Button onClick={this.saveDataSource}>{selectedNode.id ? "修改" : "保存"}</Button>
                </div>

                <Drawer
                    title="帮助"
                    width={500}
                    onClose={this.onClose}
                    visible={this.state.helpVisible}
                >
                    <HelpModal visible={this.state.helpVisible}
                        dataType={this.state.dataType}
                        codeType={this.state.codeType}
                    ></HelpModal>
                </Drawer>
                <MetaModal />
            </Spin >
        )
    }
}

export default Index
