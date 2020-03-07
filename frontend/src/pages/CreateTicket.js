import React, { Component } from "react";
import { NavLink } from "react-router-dom";
import axios from "axios";

class CreateTicket extends Component {
  constructor() {
    super();

    this.state = {
      description: ""
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.setActive = this.setActive.bind(this);
  }

  handleChange(e) {
    let target = document.getElementsByTagName("textarea")[0];
    let value = target.value;
    let name = target.name;

    this.setState({
      [name]: value
    });
  }

  handleSubmit(e) {
    e.preventDefault();

    let target = document.getElementsByTagName("textarea")[0];
    let value = target.value;
    let name = target.name;
    let authVal = "Bearer " + window.sessionStorage.token;

    axios({
      method: "post",
      url: "https://us-central1-maintenance-genie.cloudfunctions.net/api/ticket",
      data: { [name]: value },
      headers: {
        "Authorization": authVal,
        "Content-Type": "application/json"
      }
    }).then((res) => {
      switch (res.status) {
        case 200:
          window.sessionStorage.setItem("error", "alert success: Ticket created successfully.");
          this.props.history.push("/tickethistory");
          break;
        case 400:
          window.sessionStorage.setItem("error", "alert: Invalid input.");
          this.props.history.push("/createticket");
          break;
        case 401:
          window.sessionStorage.setItem("error", "alert: Some fields left blank.");
          this.props.history.push("/createticket");
          break;
        case 403:
          window.sessionStorage.setItem("error", "alert: Invalid credentials.");
          window.sessionStorage.removeItem("user_type");
          window.sessionStorage.removeItem("token");
          this.props.history.push("/login");
          break;
        case 500:
          window.sessionStorage.setItem("error", "alert: Internal server error.");
          window.sessionStorage.removeItem("user_type");
          window.sessionStorage.removeItem("token");
          this.props.history.push("/login");
          break;
        default:
          window.sessionStorage.setItem("error", "alert: Unrecognized error.");
          window.sessionStorage.removeItem("user_type");
          window.sessionStorage.removeItem("token");
          this.props.history.push("/login");
      }
    }).catch((res) => { });
  }

  setActive(e) {
    var current = document.getElementsByClassName("active");
    current[0].className = current[0].className.replace(" active", "");

    e.className += " active";
  }

  render() {
    return (
      <div>
        <div className="PageSwitcher">
          <NavLink exact to="/createticket" activeClassName="PageSwitcher__Item--Active" className="PageSwitcher__Item">Create Ticket</NavLink>
          <NavLink exact to="/tickethistory" activeClassName="PageSwitcher__Item--Active" className="PageSwitcher__Item">Ticket History</NavLink>
          <NavLink to="/myaccount" activeClassName="PageSwitcher__Item--Active" className="PageSwitcher__Item">My Account</NavLink>
        </div>
        <div className="FormCenter">
          <form onSubmit={this.handleSubmit} className="FormFields">
            <textarea name="description" placeholder="Enter your problem description">
            </textarea>

            <div className="FormFieldCenter">
              <button className="FormField__Button mr-20">Submit Ticket</button>
            </div>
          </form>
        </div>
      </div>
    );
  }
}

export default CreateTicket;
