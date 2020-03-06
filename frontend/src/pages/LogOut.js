import React, { Component } from "react";

class LogOut extends Component {
  constructor() {
    super();

    this.state = {
      problem_type: "",
      additional_instructions: ""
    };
  }

  render() {
    return (
      <form className="FormFields">
        <div className="FormFieldCenter">
          <button className="FormField__Button mr-20" onClick={() => {
            window.sessionStorage.setItem("error", "alert success: Logout successful.");
            window.sessionStorage.removeItem("user_type");
            window.sessionStorage.removeItem("token");
            this.props.history.push("/login");
          }}>Confirm Log Out</button>
        </div>
      </form>
    );
  }
}

export default LogOut;
