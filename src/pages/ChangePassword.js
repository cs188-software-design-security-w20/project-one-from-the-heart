import React, { Component } from "react";
import axios from "axios";

class ChangePassword extends Component {
  constructor() {
    super();

    this.state = {
      problem_type: "",
      additional_instructions: ""
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

    let target = document.getElementById("password");
    let target2 = document.getElementById("confirm_password");
    let value = target.value;
    let value2 = target2.value;

    axios({
      method: "post",
      url: "https://us-central1-maintenance-genie.cloudfunctions.net/api/edit_account",
      data: {
        change_password: value,
        confirm_password: value2
      },
      headers: {
        "Authorization": "Bearer "+window.sessionStorage.token,
        "Content-Type": "application/json"
      }
    })
    .then((res) => {
      switch (res.status) {
        case 200:
          window.sessionStorage.setItem("error", "alert success: Password change successful.");
          this.props.history.push("/myaccount/changepassword");
          break;
        case 400:
          window.sessionStorage.setItem("error", "alert: Invalid input.");
          this.props.history.push("/myaccount/changepassword");
          break;
        case 401:
          window.sessionStorage.setItem("error", "alert: Some fields left blank.");
          this.props.history.push("/myaccount/changepassword");
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
    })
    .catch((res) => { });
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit} className="FormFields">
        <div className="FormField">
          <label className="FormField__Label" htmlFor="password">New Password</label>
          <input type="password" id="password" className="FormField__Input" placeholder="Enter your new password" name="password" value={this.state.password} onChange={this.handleChange} />
        </div>
        <div className="FormField">
          <label className="FormField__Label" htmlFor="confirm_password">Confirm New Password</label>
          <input type="password" id="confirm_password" className="FormField__Input" placeholder="Confirm your new password" name="confirm_password" value={this.state.confirm_password} onChange={this.handleChange} />
        </div>

        <div className="FormFieldCenter">
          <button className="FormField__Button mr-20">Change Password</button>
        </div>
      </form>
    );
  }
}

export default ChangePassword;
