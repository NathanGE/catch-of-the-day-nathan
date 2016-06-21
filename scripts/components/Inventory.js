/*
  Inventory
  <Inventory/>
*/

import React from 'react';
import AddFishForm from './AddFishForm';
import autobind from 'autobind-decorator';
import Firebase from 'firebase';
const ref = new Firebase('https://catch-of-the-day-nathan.firebaseio.com/');

@autobind
class Inventory extends React.Component {

  constructor() {
    super();
    this.state = {
      uid : ''
    }
  }

  authenticate(provider) {
    console.log("provider auth " + provider);
    ref.authWithOAuthPopup(provider, this.authHandler);
  }

  componentWillMount() {
    console.log("Checking if we can log them in");
    var token = localStorage.getItem('token');
    if(token) {
      ref.authWithCustomToken(token, this.authHandler);
    }
  }

  logout() {
    ref.anauth();
    localStorage.removeItem('token');
    this.setState({
      uid : null
    });
  }

  authHandler(err, authData) {
    console.log("In the auth handler");
    if(err) {
      console.err(err);
      return;
    }

    // save the login token in browser
    localStore.setItem('token', authData.token);

    console.log(this.props.params.storeId);
    const storeRef = ref.child(this.props.params.storeID);
    storeRef.on('value', (snapshot) => {
      var data = snapshot.val() || {};

      if(!data.owner) {
        // claim it as our own if no owner
        storeRef.set({
          owner : authData.uid
        })
      }
      // update state to reflect current owner and user
      this.setState({
        uid : authData.uid,
        owner : data.owner || authData.uid
      });
    });

  }

  renderLogin() {
    return (
      <nav className="login">
        <h2>Inventory</h2>
        <p>Sign in to manage your store's inventory</p>
        <button className="facebook" onClick={this.authenticate.bind(this, 'facebook')}>Log In with Facebook</button>
      </nav>
    )
  }

  renderInventory(key) {
    var linkState = this.props.linkState;
    return (
      <div className="fish-edit" key={key}>
        <input type="text" valueLink={linkState('fishes.'+ key +'.name')}/>
        <input type="text" valueLink={linkState('fishes.'+ key +'.price')}/>
        <select valueLink={linkState('fishes.'+ key + '.status')}>
          <option value="unavailable">Sold Out!</option>
          <option value="available">Fresh!</option>
        </select>

        <textarea valueLink={linkState('fishes.'+ key +'.desc')}></textarea>
        <input type="text" valueLink={linkState('fishes.'+ key +'.image')}></input>
        <button onClick={this.props.removeFish.bind(null, key)}>Remove Fish</button>
      </div>
    )
  }

  render() {
    let logoutButton = <button onClick={this.logout}>Log Out!</button>

    // Check if user is logged in
    if(!this.state.uid) {
      return (
        <div>{this.renderLogin()}</div>
      )
    }
    // check they are the store owner
    if(this.state.uid !== this.state.owner){
      return (
        <div>
          <p>Sorry, you are not the store owner</p>
          {logoutButton}
        </div>
      )
    }

    return (
      <div>
        <h2>Inventory</h2>
        {logoutButton}
        {Object.keys(this.props.fishes).map(this.renderInventory)}
        <AddFishForm {...this.props} />
        <button onClick={this.props.loadSamples}>Load Sample Fishes</button>
      </div>
    )
  }
};

Inventory.propTypes = {
    addFish : React.PropTypes.func.isRequired,
    loadSamples : React.PropTypes.func.isRequired,
    fishes : React.PropTypes.object.isRequired,
    linkState : React.PropTypes.func.isRequired,
    removeFish : React.PropTypes.func.isRequired
  }

export default Inventory;

