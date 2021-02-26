import React, { PureComponent } from "react";
import { Card, Button, Form, Modal, Input, DatePicker, Comment, List, Row, InputNumber, message } from 'antd';
import { connect } from 'dva';
import moment from 'moment';

const FormItem = Form.Item;
const confirm = Modal.confirm;
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
      messageList: [],
      limit: 8192
    }
  }
  componentWillUnmount = () => {
    this.ws && this.ws.close()
  }
  //取数组中的后100个元素
  getLimitArray = (array = []) => {
    const { limit } = this.state;
    if (array.length > limit) {
      return array.slice(array.length - limit, array.length)
    } else {
      return array
    }
  }
  onLimit = () => {
    const limitNum = Number.parseInt(this.props.form.getFieldValue('limit'))
    if (limitNum >= 1 && limitNum <= 50000) {
      this.setState({
        limit: limitNum
      })
    } else {
      message.info('缓存条数区间为[1,50000]')
      return
    }
  }
  onConnnect = () => {
    const { messageList } = this.state
    const message = {
      color: 'red',
      content: '连接成功，现在你可以发送信息啦！！！',
      datetime: moment().format("YYYY-MM-DD HH:mm:ss")
    }
    const url = this.props.form.getFieldValue('url')
    this.ws = new WebSocket(url)
    this.ws.onmessage = this.onMessage
    this.setState({
      isConnected: true,
      messageList: this.getLimitArray([...messageList, message])
    })
  }
  onDisconnect = () => {
    const { messageList } = this.state
    this.ws.close()
    const message = {
      color: 'red',
      content: 'websocket连接已断开!!!',
      datetime: moment().format("YYYY-MM-DD HH:mm:ss")
    }
    this.setState({
      isConnected: false,
      messageList: this.getLimitArray([...messageList, message])
    })
  }
  onMessage = (message) => {
    const { messageList } = this.state
    const { data } = message;
    const newMessage = {
      sender: '1',
      color: 'blue',
      content: data,
      datetime: moment().format("YYYY-MM-DD HH:mm:ss"),
    }
    this.setState({
      messageList: this.getLimitArray([...messageList, newMessage])
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
      content: message,
      datetime: moment().format("YYYY-MM-DD HH:mm:ss"),
    }
    this.setState({
      messageList: this.getLimitArray([...messageList, newMessage])
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
  transferMessage = (msgList = []) => {
    let message = ''
    msgList.forEach(item => {
      message = message + item.datetime + '<br/>' 
      message = message + item.content + '<br/>'
    })
    return message
  }
  render() {
    const { form: { getFieldDecorator } } = this.props;
    const { isConnected, messageList, limit } = this.state;
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
          <Row>
            <FormItem>
              {getFieldDecorator('url', {
                initialValue: 'ws://192.168.205.14:9181/api/ws'
              })(
                <Input style={{ width: "550px" }} />
              )}
            </FormItem>
            <FormItem>
              <Button onClick={this.onConnnect} disabled={isConnected} icon="link" type="primary">连接</Button>
              <Button icon="disconnect" type="primary" onClick={this.onDisconnect} style={{ marginLeft: 10 }}>断开</Button>
            </FormItem>
          </Row>
          <Row>
            <FormItem>
              {getFieldDecorator('limit', {
                initialValue: 8192
              })(
                <Input addonBefore="缓存" addonAfter="条信息" max={50000} min={1} type="number" style={{ width: "250px" }} />
              )}
            </FormItem>
            <FormItem>
              <Button onClick={this.onLimit} type="primary">确定</Button>
            </FormItem>
            <span style={{ lineHeight: "50px", color: "rgb(204, 204, 204)" }}>当前限制缓存条数：{limit}</span>
          </Row>
          <div style={{ marginTop: "6px" }}>
            <div ref={(el) => { this.messagesEnd = el; }} style={{ height: "400px", width: "60%", overflowY: "auto", border: "1px solid #ccc", padding: "10px" }} dangerouslySetInnerHTML={{__html:this.transferMessage(messageList)}}>
              {/* <List
                dataSource={messageList}
                itemLayout="horizontal"
                renderItem={props => <SingleMessage {...props} />}
              /> */}
              {/* {this.transferMessage(messageList)} */}
            </div>
            <Row style={{ marginTop: 10 }}>

              <FormItem>
                {getFieldDecorator('message', {
                  initialValue: 'qtj://a?action=CAROUSEL&content=DEFAULT_TOPIC'
                })(
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