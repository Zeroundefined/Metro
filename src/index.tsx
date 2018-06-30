import * as React from 'react';
import { createStore, combineReducers, applyMiddleware } from 'redux';
import * as ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { syncHistoryWithStore, routerReducer } from 'react-router-redux';
import { Router, Route, browserHistory, IndexRoute, Redirect } from 'react-router';
import { Login, Reports, Frame, Logs } from './pages';
import { reducer as LoginReducer } from '../src/pages/Login/LoginRedux';
import { reducer as ReportsReducer } from '../src/pages/Reports/ReportsRedux';
import thunk from 'redux-thunk';
import './app.scss';
import 'antd/dist/antd.css';

export var logStatus = false;

const reducers = combineReducers({
  routing: routerReducer,
  login: LoginReducer,
  reports: ReportsReducer
});

const store = createStore(reducers, applyMiddleware(thunk));
const history = syncHistoryWithStore(browserHistory, store);

function handleRedirect(nextState, replace, next) {
  next();
}

ReactDOM.render(
  <Provider store={store}>
    <Router history={history}>
      <Route path="/" component={Frame} onEnter={handleRedirect}>
        <Route path="login" component={Login}/>
        <Route path="metaCenter" component={Reports} />
        <Route path="reports" component={Reports} />
        <Route path="logs" component={Logs} />
      </Route>
    </Router>
  </Provider>,
  document.getElementById('app')
);
