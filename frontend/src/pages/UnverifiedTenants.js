import React, { Component } from "react";
import { NavLink } from "react-router-dom";
import axios from "axios";
import pending from "./pending.png";

class UnverifiedTenants extends Component {
    constructor() {
        super();

        this.state = {
            users: []
        };
    }

    componentDidMount() {
        this.generateUsers().then((res) => {
            this.setState({
                users: res.data
            });
        });
    }

    generateUsers() {
        return axios.get("https://us-central1-maintenance-genie.cloudfunctions.net/api/unverified_users", {
            headers: {
                "Authorization": "Bearer " + window.sessionStorage.token,
                "Content-Type": "application/json"
            }
        }).then((res) => {
            return res;
        }).catch((res) => {
            return {};
        });
    }

    verifyUser(e) {
        e.preventDefault();

        let target = e.currentTarget.parentElement;
        let value = target.attributes.customkey.nodeValue;

        axios({
            method: "post",
            url: "https://us-central1-maintenance-genie.cloudfunctions.net/api/verify_tenant/"+value,
            headers: {
                "Authorization": "Bearer " + window.sessionStorage.token,
                "Content-Type": "application/json"
            }
        }).then((res) => {
            switch (res.status) {
                case 200:
                    window.sessionStorage.setItem("error", "alert success: Tenant verified.");
                    this.props.history.push("/unverifiedworkers");
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
            <div>
                <div className="PageSwitcher">
                    <NavLink exact to="/unverifiedtenants" activeClassName="PageSwitcher__Item--Active" className="PageSwitcher__Item">Assign Tenants</NavLink>
                    <NavLink exact to="/unverifiedworkers" activeClassName="PageSwitcher__Item--Active" className="PageSwitcher__Item">Assign Workers</NavLink>
                    <NavLink to="/myaccount" activeClassName="PageSwitcher__Item--Active" className="PageSwitcher__Item">My Account</NavLink>
                </div>
                <div className="FormDual">
                    <div className="FormChain">
                        {Array.isArray(this.state.users) ? this.state.users.map((dat) => {
                            if (dat) {
                                let tmp = "NAME: " + dat.full_name + "\nADDRESS: " + dat.address + "\nEMAIL: " + dat.email + "\nCREATED ON: " + dat.created_at;

                                return (
                                    <div key={dat.email} className="FormLink" customkey={dat.email}>
                                        <button onClick={this.verifyUser}><img src={pending} alt="Pending"></img></button>
                                        <textarea disabled value={tmp}></textarea>
                                    </div>
                                );
                            } else {
                                return null;
                            }
                        }) : null}
                    </div>
                </div>
            </div>
        );
    }
}

export default UnverifiedTenants;