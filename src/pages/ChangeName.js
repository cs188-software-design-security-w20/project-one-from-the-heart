import React, { Component } from "react";
import axios from "axios";

class ChangeName extends Component {
  constructor() {
    super();

    this.state = {
      full_name: ""
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

    let target = document.getElementById("full_name");
    let value = target.value;

    axios({
      method: "post",
      url: "https://us-central1-maintenance-genie.cloudfunctions.net/api/edit_account",
      data: {
        change_name: value
      },
      headers: {
        "Authorization": "Bearer "+window.sessionStorage.token,
        "Content-Type": "application/json"
      }
    })
    .then((res) => {
      switch (res.status) {
        case 200:
          window.sessionStorage.setItem("error", "alert success: Name change successful.");
          this.props.history.push("/myaccount/changename");
          break;
        case 400:
          window.sessionStorage.setItem("error", "alert: Invalid input.");
          this.props.history.push("/myaccount/changename");
          break;
        case 401:
          window.sessionStorage.setItem("error", "alert: Some fields left blank.");
          this.props.history.push("/myaccount/changename");
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
          <label className="FormField__Label" htmlFor="full_name">Full Name</label>
          <input type="text" id="full_name" className="FormField__Input" placeholder="Enter your full name" name="full_name" defaultValue={this.props.full_name ? this.props.full_name : ""} onChange={this.handleChange} />
        </div>

        <div className="FormFieldCenter">
          <button className="FormField__Button mr-20">Change Name</button>
        </div>
      </form>
    );
  }
}

export default ChangeName;
