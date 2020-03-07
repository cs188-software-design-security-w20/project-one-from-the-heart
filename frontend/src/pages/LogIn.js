import React, { Component } from "react";
import { NavLink } from "react-router-dom";
import axios from "axios";
import "./AlertMessage";

class LogIn extends Component {
  constructor() {
    super();

    this.state = {
      email: "",
      password: ""
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(e) {
    let target = e.target;
    let value = target.value;
    let name = target.name;

    this.setState({
      [name]: value
    });
  }

  handleSubmit(e) {
    e.preventDefault();

    axios({
      method: "post",
      url: "https://us-central1-maintenance-genie.cloudfunctions.net/api/login",
      data: this.state,
      headers: { "Content-Type": "application/json" }
    }).then((res) => {
      switch (res.status) {
        case 200:
          if (res.data.token && res.data.user_type) {
            window.sessionStorage.setItem("error", "alert success: Login successful.")
            window.sessionStorage.setItem("token", res.data.token);
            window.sessionStorage.setItem("user_type", res.data.user_type);
            if (res.data.user_type === "landlord") {
              this.props.history.push("/unverifiedtenants");
            } else if (res.data.user_type === "worker") {
              this.props.history.push("/pendingtickets");
            } else {
              this.props.history.push("/createticket");
            }
          } else {
            window.sessionStorage.setItem("error", "alert: Unrecognized error.");
            window.sessionStorage.removeItem("user_type");
            window.sessionStorage.removeItem("token");
            this.props.history.push("/login");
          }
          break;
        case 400:
          window.sessionStorage.setItem("error", "alert: Invalid input.");
          this.props.history.push("/login");
          break;
        case 401:
          window.sessionStorage.setItem("error", "alert: Some fields left blank.");
          this.props.history.push("/login");
          break;
        case 405:
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
    }).catch((res) => {
      window.sessionStorage.setItem("error", "alert: Invalid credentials.");
      window.sessionStorage.removeItem("user_type");
      window.sessionStorage.removeItem("token");
      this.props.history.push("/login");
    });
  }

  render() {
    return (
      <div>
        <div className="PageSwitcher">
          <NavLink exact to="/login" activeClassName="PageSwitcher__Item--Active" className="PageSwitcher__Item">Log In</NavLink>
          <NavLink exact to="/" activeClassName="PageSwitcher__Item--Active" className="PageSwitcher__Item">Sign Up</NavLink>
        </div>
        <div className="FormCenter">
          <form onSubmit={this.handleSubmit} className="FormFields">
            <div className="FormField">
              <label className="FormField__Label" htmlFor="email">Email Address</label>
              <input type="email" id="email" className="FormField__Input" placeholder="Enter your email" name="email" value={this.state.email} onChange={this.handleChange} />
            </div>

            <div className="FormField">
              <label className="FormField__Label" htmlFor="password">Password</label>
              <input type="password" id="password" className="FormField__Input" placeholder="Enter your password" name="password" value={this.state.password} onChange={this.handleChange} />
            </div>

            <div className="FormFieldCenter">
              <button className="FormField__Button mr-20">Log In</button>
            </div>
          </form>
        </div>
      </div>
    );
  }
}

export default LogIn;
