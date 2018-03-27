import React, { Component } from 'react';
import {BrowserRouter as Router, Route, Redirect } from 'react-router-dom';
import Home from './pages/Home.jsx';
import NewOrder from './pages/NewOrder.jsx'
import Order from './pages/Order.jsx';
import NewClient from './pages/NewClient.jsx'
import About from './pages/About.jsx';
import News from './pages/News.jsx';
import Managers from './pages/Managers.jsx';
import Clients from './pages/Clients.jsx';
import Carriers from './pages/Carriers.jsx';
import Transfers from './pages/Transfers.jsx';
import Cities from './pages/Cities.jsx';
import Client from './pages/Client.jsx';
import Logout from './components/Logout.jsx';
import Spinner from './components/Spinner.jsx';
import Auth from './pages/Auth.jsx';
import Navbar from './components/CustomNavbar.jsx';
import { db, auth } from './firebase.js';
import './App.css';

function ProtectedRoute(props) {
  if(!props.authorized) {
    return (
      <Redirect to='/auth' />
    );
  }
  return (
    <Route exact path={ props.path } component={ props.component } />
  );
};
class App extends Component {
  constructor() {
    super();
    this.state = {
      authorized: false,
      loading: true
    }
  }
  componentDidMount() {
    auth().onAuthStateChanged((user) => {
      db().collection('users').doc(user.uid)
      .get()
      .then(userSnap => {
        this.setState({
          authorized: userSnap.exists,
          loading: false
        })
      });
    })
  }
  render() {
    if(this.state.loading) {
      return (
        <Spinner />
      )
    }
    return (
      <Router>
        <div>
          <Navbar />
          <Route exact path='/auth' component={ Auth } />
          <ProtectedRoute authorized={this.state.authorized} path='/' component={Home} />
          <ProtectedRoute authorized={this.state.authorized} path='/about' component={About} />
          <ProtectedRoute authorized={this.state.authorized} path='/news' component={News} />
          <ProtectedRoute authorized={this.state.authorized} path='/logout' component={Logout} />
          <ProtectedRoute authorized={this.state.authorized} path='/clients' component={Clients} />
          <ProtectedRoute authorized={true} path='/client/:clientId' component={Client} />
          <ProtectedRoute authorized={this.state.authorized} path='/order-new' component={NewOrder} />
          <ProtectedRoute authorized={this.state.authorized} path='/client/new' component={NewClient} />
          <ProtectedRoute authorized={this.state.authorized} path='/order/:orderId' component={Order} />
          <ProtectedRoute authorized={this.state.authorized} path='/transfers' component={Transfers} />
          <ProtectedRoute authorized={this.state.authorized} path='/managers' component={Managers} />
          <ProtectedRoute authorized={this.state.authorized} path='/carriers' component={Carriers} />
          <ProtectedRoute authorized={this.state.authorized} path='/cities' component={Cities} />
        </div>
      </Router>
    );
  }
}

export default App;
