import React, { Component } from "react";
import { Route, NavLink } from "react-router-dom";
import axios from "axios";
import ChangeName from "./ChangeName";
import ViewEmail from "./ViewEmail";
import ChangePassword from "./ChangePassword";
import ChangeAddress from "./ChangeAddress";
import DeleteAccount from "./DeleteAccount";
import LogOut from "./LogOut";

class MyAccount extends Component {
  constructor() {
    super();

    this.state = {
      address: "",
      email: "",
      full_name: ""
    };

    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount() {
    axios({
      method: "get",
      url: "https://us-central1-maintenance-genie.cloudfunctions.net/api/view_profile",
      headers: {
        "Authorization": "Bearer " + window.sessionStorage.token,
        "Content-Type": "application/json"
      }
    })
      .then((res) => {
        this.setState({
          address: res.data.address,
          email: res.data.email,
          full_name: res.data.full_name
        })
      })
      .catch((res) => { });
  }

  handleSubmit(e) {
    e.preventDefault();

    axios({
      method: "post",
      url: "https://us-central1-maintenance-genie.cloudfunctions.net/api/login",
      data: this.state,
      headers: { "Content-Type": "application/json" }
    })
      .then((res) => { })
      .catch((res) => { });
  }

  generatePageSwitcher() {
    if (window.sessionStorage.user_type === "worker") {
      return (
        <div className="PageSwitcher">
          <NavLink to="/pendingtickets" activeClassName="PageSwitcher__Item--Active" className="PageSwitcher__Item">Pending Tickets</NavLink>
          <NavLink to="/assignedtickets" activeClassName="PageSwitcher__Item--Active" className="PageSwitcher__Item">Assigned Tickets</NavLink>
          <NavLink to="/myaccount" activeClassName="PageSwitcher__Item--Active" className="PageSwitcher__Item">My Account</NavLink>
        </div>
      );
    } else if (window.sessionStorage.user_type === "landlord") {
      return (
        <div className="PageSwitcher">
          <NavLink to="/unverifiedtenants" activeClassName="PageSwitcher__Item--Active" className="PageSwitcher__Item">Assign Tenants</NavLink>
          <NavLink to="/unverifiedworkers" activeClassName="PageSwitcher__Item--Active" className="PageSwitcher__Item">Assign Workers</NavLink>
          <NavLink to="/myaccount" activeClassName="PageSwitcher__Item--Active" className="PageSwitcher__Item">My Account</NavLink>
        </div>
      );
    } else {
      return (
        <div className="PageSwitcher">
          <NavLink to="/createticket" activeClassName="PageSwitcher__Item--Active" className="PageSwitcher__Item">Create Ticket</NavLink>
          <NavLink to="/tickethistory" activeClassName="PageSwitcher__Item--Active" className="PageSwitcher__Item">Ticket History</NavLink>
          <NavLink to="/myaccount" activeClassName="PageSwitcher__Item--Active" className="PageSwitcher__Item">My Account</NavLink>
        </div>
      );
    }
  }

  render() {
    return (
      <div>
        {this.generatePageSwitcher()}

        <div className="FormDual">
          <div className="FormLeft">
            <div className="TabSwitcher">
              <NavLink exact to="/myaccount" activeClassName="PageSwitcher__Item--Active" className="PageSwitcher__Item">Log Out</NavLink>
              <NavLink to="/myaccount/changename" activeClassName="PageSwitcher__Item--Active" className="PageSwitcher__Item">Change Name</NavLink>
              <NavLink to="/myaccount/changeaddress" activeClassName="PageSwitcher__Item--Active" className="PageSwitcher__Item">Change Address</NavLink>
              <NavLink to="/myaccount/viewemail" activeClassName="PageSwitcher__Item--Active" className="PageSwitcher__Item">View Email</NavLink>
              <NavLink to="/myaccount/changepassword" activeClassName="PageSwitcher__Item--Active" className="PageSwitcher__Item">Change Password</NavLink>
              <NavLink to="/myaccount/deleteaccount" activeClassName="PageSwitcher__Item--Active" className="PageSwitcher__Item">Delete Account</NavLink>
            </div>
          </div>

          <div className="FormRight">
            <Route exact path="/myaccount" component={LogOut}>
            </Route>
            <Route path="/myaccount/changename" render={(props) => (<ChangeName {...props} full_name={this.state.full_name} />)}>
            </Route>
            <Route path="/myaccount/changeaddress" render={(props) => (<ChangeAddress {...props} address={this.state.address} />)}>
            </Route>
            <Route path="/myaccount/viewemail" render={(props) => (<ViewEmail {...props} email={this.state.email} />)}>
            </Route>
            <Route path="/myaccount/changepassword" component={ChangePassword}>
            </Route>
            <Route path="/myaccount/deleteaccount" component={DeleteAccount}>
            </Route>
          </div>
        </div>
      </div>
    );
  }
}

export default MyAccount;
