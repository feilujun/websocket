import React, { PureComponent } from 'react'
import { connect } from 'dva';
import { Form, Modal, Input, DatePicker, Row, Col, InputNumber } from "antd";
import moment from "moment";

const FormItem = Form.Item;

const formLayout = {
    labelCol: {
        span: 8
    },
    wrapperCol: {
        span: 14
    },
}
@Form.create()
@connect(({ setting, loading }) => {
    const { addVisible, isUpdate, currentData } = setting
    return {
        addVisible,
        isUpdate,
        currentData,
        loading: !!loading.effects['setting/update'] || !!loading.effects['setting/add']
    }
})

class AddModal extends PureComponent{
    componentWillReceiveProps = (nextProps) => {
        if(this.props.addVisible !== nextProps.addVisible && nextProps.addVisible){
            this.props.form.resetFields();
        }
    }

    //取消modal弹框事件
    onCancel = () => {
        const { dispatch } = this.props;
        dispatch({
            type: "setting/save",
            payload: {
                addVisible: false
            }
        })
    }

    //确定modal弹框事件
    onOk = () => {
        const { dispatch, isUpdate, currentData, form: { validateFields } } = this.props;
        validateFields((error, values) => {
            if(!!error) return;
            if(isUpdate) {  //修改
                dispatch({
                    type: "setting/update",
                    payload: {...currentData, ...values }
                })
            } else {    //添加
                dispatch({
                    type: "setting/add",
                    payload: values
                })
            }
        })
    }

    render(){
        const { loading, addVisible, form: { getFieldDecorator }, currentData, isUpdate } = this.props;
        return(
            <Modal
                visible={addVisible}
                title={isUpdate ? "修改" : "添加"}
                onCancel={this.onCancel}
                onOk={this.onOk}
                maskClosable={false}
                confirmLoading={loading}
                width="50%"
            >

                <Form {...formLayout}>
                    <Row>
                        <Col span={12}>
                            <FormItem label={"姓名"}>
                                {getFieldDecorator('name', {
                                    initialValue: currentData.name,
                                    rules: [{ required: true, message: '请选择'}],
                                })(
                                    <Input />
                                )}
                            </FormItem>
                        </Col>
                        <Col span={12}>
                            <FormItem label={"年龄"}>
                                {getFieldDecorator('age', {
                                    initialValue: currentData.age,
                                    rules: [{ required: true, message: '请选择'}],
                                })(
                                    <InputNumber style={{ width: "100%" }} />
                                )}
                            </FormItem>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={12}>
                            <FormItem label={"出生日期"}>
                                {getFieldDecorator('birthday', {
                                    initialValue: currentData.birthday && moment(currentData.birthday),
                                    rules: [{ required: true, message: '请选择'}],
                                })(
                                    <DatePicker style={{ width: "100%" }} />
                                )}
                            </FormItem>
                        </Col>
                        <Col span={12}>
                            <FormItem label={"工资"}>
                                {getFieldDecorator('salary', {
                                    initialValue: currentData.salary,
                                    rules: [{ required: true, message: '请选择'}],
                                })(
                                    <InputNumber style={{ width: "100%" }} />
                                )}
                            </FormItem>
                        </Col>
                    </Row>
                    <Row >
                        <Col span={12}>
                            <FormItem label={"公司"}
                            >
                                {getFieldDecorator('company', {
                                    initialValue: currentData.company,
                                    rules: [{ required: true, message: '请选择'}],
                                })(
                                    <Input />
                                )}
                            </FormItem>
                        </Col>
                    </Row>
                </Form>
            </Modal>
        )
    }
}
export default AddModal