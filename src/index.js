import dva from 'dva';
import "./language"
import createHistory from 'history/createHashHistory';
import createLoading from 'dva-loading';
import 'moment/locale/zh-cn';
import logger from 'redux-logger';
import "./utils/styles/global.less";
import moment from 'moment';
moment.locale('zh-cn');
const app = dva(
    process.env.NODE_ENV === "development" ? {
        onAction: logger,
        history: createHistory(),
    } : {
            history: createHistory(),
        }
);

app.use(createLoading());

app.model(require('./models/global').default);

app.router(require('./router').default);

app.start('#root');

export default app._store; // eslint-disable-line