import React, { Component } from "react";
import axios from "axios";

class ChangeAddress extends Component {
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

    let target = document.getElementById("address");
    let value = target.value;

    axios({
      method: "post",
      url: "https://us-central1-maintenance-genie.cloudfunctions.net/api/edit_account",
      data: {
        change_location: value
      },
      headers: {
        "Authorization": "Bearer "+window.sessionStorage.token,
        "Content-Type": "application/json"
      }
    })
    .then((res) => {
      switch (res.status) {
        case 200:
          window.sessionStorage.setItem("error", "alert success: Address change successful.");
          this.props.history.push("/myaccount/changeaddress");
          break;
        case 400:
          window.sessionStorage.setItem("error", "alert: Invalid input.");
          this.props.history.push("/myaccount/changeaddress");
          break;
        case 401:
          window.sessionStorage.setItem("error", "alert: Some fields left blank.");
          this.props.history.push("/myaccount/changeaddress");
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
          <label className="FormField__Label" htmlFor="address">Street Address</label>
          <input type="text" id="address" className="FormField__Input" placeholder="Enter your new street address" name="address" defaultValue={this.props.address ? this.props.address : ""} onChange={this.handleChange} />
        </div>

        <div className="FormFieldCenter">
          <button className="FormField__Button mr-20">Change Address</button>
        </div>
      </form>
    );
  }
}

export default ChangeAddress;
