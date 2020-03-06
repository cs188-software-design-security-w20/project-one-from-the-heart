import React, { Component } from "react";
import axios from "axios";

class ViewEmail extends Component {
  constructor() {
    super();

    this.state = {
      email: ""
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
    })
      .then((res) => {
        switch (res.status) {
          case 200:
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
      <form className="FormFields">
        <div className="FormField">
          <label className="FormField__Label" htmlFor="email">Email Address</label>
          <input disabled type="email" id="email" className="FormField__Input" placeholder="Your current email address" name="email" defaultValue={this.props.email ? this.props.email : ""}/>
        </div>
      </form>
    );
  }
}

export default ViewEmail;
