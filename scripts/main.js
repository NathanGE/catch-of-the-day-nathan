var React = require('react');
var ReactDOM = require('react-dom');

var ReactRouter = require('react-router');
var Router = ReactRouter.Router;
var Route = ReactRouter.Route;
var Navigation = ReactRouter.Navigation;
var createBrowserHistory = require('history/lib/createBrowserHistory');

/*
  Import Components
*/

import App from './components/App';
import NotFound from './components/NotFound';
import StorePicker from './components/StorePicker';
import Header from './components/Header';
import Fish from './components/Fish';
import AddFishFrom from './components/AddFishForm';
import Inventory from './components/Inventory';
import Order from './components/Order';

/*
  Routes
*/

var routes = (
  <Router history={createBrowserHistory()}>
    <Route path="/" component={StorePicker}/>
    <Route path="/store/:storeId" component={App}/>
    <Route path="*" component={NotFound}/>
  </Router>
);

ReactDOM.render(routes, document.querySelector('#main'));
