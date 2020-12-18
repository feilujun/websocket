import React, { PureComponent } from "react";
import { Card, Button, Form, Modal, Input, DatePicker, Comment, List, Row } from 'antd';
import { connect } from 'dva';
import moment from 'moment';

const FormItem = Form.Item;
const confirm = Modal.confirm;
const _data = [
  {
    sender: '0',
    color: 'green',
    content: <p>123</p>,
    datetime: moment().format("YYYY-MM-DD HH:mm:ss"),
  },
  {
    sender: '1',
    color: 'blue',
    content: <p>123</p>,
    datetime: moment().format("YYYY-MM-DD HH:mm:ss"),
  },
]
@Form.create()
@connect(({ setting, loading }) => {
  const { dataSource, pageNum, pageSize, totalCount } = setting
  return {
    dataSource,
    pageNum,
    pageSize,
    totalCount,
    loading: !!loading.effects['setting/findByQuery']
  }
})
class Index extends PureComponent {
  constructor(props) {
    super(props)
    this.messagesEnd = null;
    this.ws = null;
    this.state = {
      isConnected: false,
      messageList: []
    }
  }
  onConnnect = () => {
    const { messageList } = this.state
    const message = {
      color: 'red',
      content: <p>连接成功，现在你可以发送信息啦！！！</p>
    }
    const url = this.props.form.getFieldValue('url')
    this.ws = new WebSocket(url)
    this.ws.onmessage = this.onMessage
    this.setState({
      isConnected: true,
      messageList: [...messageList, message]
    })
  }
  onDisconnect = () => {
    const { messageList } = this.state
    this.ws.close()
    const message = {
      color: 'red',
      content: <p>websocket连接已断开!!!</p>
    }
    this.setState({
      isConnected: false,
      messageList: [...messageList, message]
    })
  }
  onMessage = (message) => {
    const { messageList } = this.state
    const { data } = message;
    const newMessage = {
      sender: '1',
      color: 'blue',
      content: <p>{data}</p>,
      datetime: moment().format("YYYY-MM-DD HH:mm:ss"),
    }
    this.setState({
      messageList: [...messageList, newMessage]
    })
    this.scrollToBottom()
  }
  sendMessage = () => {
    const { messageList } = this.state
    const message = this.props.form.getFieldValue('message')
    this.ws.send(message)
    const newMessage = {
      sender: '0',
      color: 'green',
      content: <p>{message}</p>,
      datetime: moment().format("YYYY-MM-DD HH:mm:ss"),
    }
    this.setState({
      messageList: [...messageList, newMessage]
    })
  }
  scrollToBottom() {
    if (this.messagesEnd) {
        const scrollHeight = this.messagesEnd.scrollHeight;//里面div的实际高度  2000px
        const height = this.messagesEnd.clientHeight;  //网页可见高度  200px
        const maxScrollTop = scrollHeight - height; 
        this.messagesEnd.scrollTop = maxScrollTop > 0 ? maxScrollTop : 0;
      //如果实际高度大于可见高度，说明是有滚动条的，则直接把网页被卷去的高度设置为两个div的高度差，实际效果就是滚动到底部了。
    }
  }
  render() {
    const { form: { getFieldDecorator } } = this.props;
    const { isConnected, messageList } = this.state;
    const SingleMessage = (item) => {
      return (
        <div>
          <Row style={{ color: item.color }}>
            {item.sender === '0' ? '我 ' : '服务器 '} {item.datetime}
          </Row>
          <Row>
            {item.content}
          </Row>
        </div>
      )
    }
    return (
      <Card>
        <Form layout={"inline"}>
          <FormItem>
            {getFieldDecorator('url', {
              initialValue: 'ws://123.207.136.134:9010/ajaxchattest'
            })(
              <Input style={{ width: "550px" }} />
            )}
          </FormItem>
          <FormItem>
            <Button onClick={this.onConnnect} disabled={isConnected} icon="link" type="primary">连接</Button>
            <Button icon="disconnect" type="primary" onClick={this.onDisconnect} style={{ marginLeft: 10 }}>断开</Button>
          </FormItem>

          <div style={{ marginTop: "24px" }}>
            <div ref={(el) => { this.messagesEnd = el; }} style={{ height: "400px", width: "60%", overflowY: "auto", border: "1px solid #ccc", padding: "10px" }}>
              <List
                dataSource={messageList}
                itemLayout="horizontal"
                renderItem={props => <SingleMessage {...props} />}
              />
            </div>
            <Row style={{ marginTop: 10 }}>

              <FormItem>
                {getFieldDecorator('message')(
                  <Input style={{ width: "700px" }} />
                )}
              </FormItem>
              <FormItem>
                <Button style={{ marginLeft: 10 }} disabled={!isConnected} onClick={this.sendMessage}>发送</Button>
              </FormItem>

            </Row>
          </div>
        </Form>
      </Card>
    )
  }
}


export default Index;