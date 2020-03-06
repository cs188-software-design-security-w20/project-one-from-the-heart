import React, { Component } from "react";
import axios from "axios";

class DeleteAccount extends Component {
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
    let target = document.getElementById("password");
    let value = target.value;

    axios({
      method: "post",
      url: "https://us-central1-maintenance-genie.cloudfunctions.net/api/delete_account",
      data: {
        password: value
      },
      headers: {
        "Authorization": "Bearer " + window.sessionStorage.token,
        "Content-Type": "application/json"
      }
    }).then((res) => {
      switch (res.status) {
        case 200:
          window.sessionStorage.setItem("error", "alert success: Account deleted.");
          window.sessionStorage.removeItem("user_type");
          window.sessionStorage.removeItem("token");
          this.props.history.push("/login");
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

  render() {
    return (
      <form onSubmit={this.handleSubmit} className="FormFields">
        <div className="FormField">
          <label className="FormField__Label" htmlFor="password">Current Password</label>
          <input type="password" id="password" className="FormField__Input" placeholder="Enter your current password" name="password" />
        </div>

        <div className="FormFieldCenter">
          <button style={{ "backgroundColor": "red" }} className="FormField__Button mr-20">Delete Account</button>
        </div>
      </form>
    );
  }
}

export default DeleteAccount;
