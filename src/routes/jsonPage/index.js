import React, { PureComponent } from "react";
import { Card, Button, Form, Modal, Input, DatePicker, Comment, List, Row, message } from 'antd';
import { connect } from 'dva';

@Form.create()
@connect(({ jsonPage, loading }) => {
    const { data } = jsonPage
    return {
        data,
        loading: !!loading.effects['jsonPage/getData']
    }
})
class Index extends PureComponent {

    getData = () => {
        const { form: { validateFields } } = this.props;
        validateFields((error, value) => {
            if(!!error) return
            this.props.dispatch({
                type: "jsonPage/getData",
                payload: value
            })
        })
    }
    copyData = () => {
        var copyDOM = document.getElementById("contentText");  //需要复制文字的节点  
        var range = document.createRange(); //创建一个range
        window.getSelection().removeAllRanges();   //清楚页面中已有的selection
        range.selectNode(copyDOM);    // 选中需要复制的节点    
        window.getSelection().addRange(range);   // 执行选中元素
        var successful = document.execCommand('copy');    // 执行 copy 操作  
        if (successful) {
            message.success('复制成功！')
        } else {
            message.warning('复制失败，请手动复制！')
        }
        // 移除选中的元素  
        window.getSelection().removeAllRanges();
    }
    render() {
        const { form: { getFieldDecorator } } = this.props;
        const { data } = this.props;
        return (
            <div>
                <Card>
                    <Form layout={"inline"}>
                        <Form.Item label="isLogin">
                            {getFieldDecorator('isLogin', {
                                rules: [
                                    {
                                        required: true,
                                        message: "请输入",
                                    },
                                ],
                                initialValue: 0
                            })(
                                <Input style={{ width: "200px" }} />
                            )}
                        </Form.Item>
                        <Form.Item label="tagId">
                            {getFieldDecorator('tagId', {
                                rules: [
                                    {
                                        required: true,
                                        message: "请输入",
                                    },
                                ],
                                initialValue: 'SHFE'
                            })(
                                <Input style={{ width: "200px" }} />
                            )}
                        </Form.Item>
                        <Form.Item>
                            <Button type="primary" onClick={this.getData}>获取数据</Button>
                            <Button type="primary" disabled={!data} onClick={this.copyData} style={{ marginLeft: "15px" }}>复制数据</Button>
                        </Form.Item>
                    </Form>
                    <div style={{ marginTop: "24px", minHeight: "600px", width: "90%" }} id="contentText">
                        {data}
                    </div>
                </Card>
            </div>
        );
    }
}
export default Index