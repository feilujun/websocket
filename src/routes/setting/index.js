import React, { PureComponent } from "react";
import { Card, Button, Form, Modal, Input, DatePicker, Comment, List, Row } from 'antd';
import { getColumns } from "./utils"
import { connect } from 'dva';
import { ExhibitTable } from "quant-ui";
import AddModal from "./addModal";
import moment from 'moment';

const FormItem = Form.Item;
const confirm = Modal.confirm;
const datas = [
  {
    author: '我',
    content: <p>123</p>,
    datetime: moment().fromNow(),
  },
  {
    author: '服务器',
    content: <p>123</p>,
    datetime: moment().fromNow(),
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
      columns: getColumns(this)
    }
  }
  componentDidMount = () => {
    this.onSearch(1, 10);
  }

  //新增点击事件
  addClick = () => {
    const { dispatch } = this.props;
    dispatch({
      type: "setting/save",
      payload: {
        addVisible: true,
        isUpdate: false,
        currentData: {}
      }
    })
  }

  //删除事件
  delete = (id) => {
    const { dispatch } = this.props;
    confirm({
      title: '确认删除？',
      content: '删除后将无法回退！',
      onOk() {
        dispatch({
          type: "setting/delete",
          payload: { id }
        })
      },
      onCancel() { },

    });
  }

  //修改事件
  update = (record) => {
    const { dispatch } = this.props;
    dispatch({
      type: "setting/save",
      payload: {
        addVisible: true,
        isUpdate: true,
        currentData: record
      }
    })
  }

  //查询
  onSearch = (pageNum, pageSize) => {
    const { dispatch, form: { validateFields } } = this.props;
    validateFields((error, values) => {
      if (!!error) return;
      dispatch({
        type: "setting/findByQuery",
        payload: { ...values, pageNum, pageSize }
      })
    })
  }

  //页码变化回调
  onChange = ({ current: pageNum, pageSize }) => {
    this.onSearch(pageNum, pageSize)
  }

  render() {
    const { dataSource, form: { getFieldDecorator }, loading, pageNum, pageSize, totalCount } = this.props;
    const { columns } = this.state;
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
          <div style={{ height: "400px", width: "60%", overflowY: "auto", border: "1px solid #ccc" }}>
            <List
              dataSource={datas}
              itemLayout="horizontal"
              renderItem={props => <Comment {...props} />}
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