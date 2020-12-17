import React, { PureComponent } from "react";
import { Card, Button, Form, Modal, Input, DatePicker, Comment, List, Row } from 'antd';
import { getColumns } from "./utils"
import { connect } from 'dva';
import { ExhibitTable } from "quant-ui";
import AddModal from "./addModal";
import moment from 'moment';

const FormItem = Form.Item;
const confirm = Modal.confirm;
const _data = [
  {
    sender: '0',
    content: <p>123</p>,
    datetime: moment().format("YYYY-MM-DD HH:mm:ss"),
  },
  {
    sender: '1',
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
    this.state = {
      columns: getColumns(this),
      isConnected: false,
    }
  }
  // componentDidMount = () => {
  //   this.onSearch(1, 10);
  // }\
  
  render() {
    const { dataSource, form: { getFieldDecorator }, loading, pageNum, pageSize, totalCount } = this.props;
    const { columns } = this.state;
    const SingleMessage = (item) => {
      return (
        <div>
          <Row style={{ color: item.sender === '0' ? "green" : "blue" }}>
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
            {getFieldDecorator('index')(
              <Input style={{ width: "550px" }} />
            )}
          </FormItem>
          <FormItem>
            <Button onClick={() => this.onSearch(pageNum, pageSize)} icon="link" type="primary">连接</Button>
            <Button icon="disconnect" type="primary" onClick={this.addClick} style={{ marginLeft: 10 }}>断开</Button>
          </FormItem>
        </Form>
        <div style={{ marginTop: "24px" }}>
          <div style={{ height: "400px", width: "60%", overflowY: "auto", border: "1px solid #ccc", padding: "10px" }}>
            <List
              dataSource={_data}
              itemLayout="horizontal"
              renderItem={props => <SingleMessage {...props} />}
            />
          </div>
          <Row style={{ marginTop: 10 }}>
            <Input style={{ width: "54%" }}></Input>
            <Button style={{ marginLeft: 10 }}>发送</Button>
          </Row>
        </div>
        <AddModal />
      </Card>
    )
  }
}


export default Index;