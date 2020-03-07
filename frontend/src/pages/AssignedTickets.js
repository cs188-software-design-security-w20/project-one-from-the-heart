import React, { Component } from "react";
import { NavLink } from "react-router-dom";
import axios from "axios";
import inprogress from "./inprogress.png";
import resolved from "./resolved.png";

class AssignedTickets extends Component {
    constructor() {
        super();

        this.state = {
            tickets: []
        };
    }

    componentDidMount() {
        this.generateTickets().then((res) => {
            this.setState({
                tickets: res.data
            });
        });
    }

    generateTickets() {
        return axios.get("https://us-central1-maintenance-genie.cloudfunctions.net/api/assigned_tickets", {
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

    closeTicket(e) {
        e.preventDefault();

        let target = e.currentTarget.parentElement;
        let value = target.attributes.customkey.nodeValue;

        axios({
            method: "post",
            url: "https://us-central1-maintenance-genie.cloudfunctions.net/api/close_ticket/" + value,
            headers: {
                "Authorization": "Bearer " + window.sessionStorage.token,
                "Content-Type": "application/json"
            }
        }).then((res) => {
            switch (res.status) {
                case 200:
                    window.sessionStorage.setItem("error", "alert success: Ticket closed.");
                    this.props.history.push("/assignedtickets");
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
                    <NavLink exact to="/pendingtickets" activeClassName="PageSwitcher__Item--Active" className="PageSwitcher__Item">Pending Tickets</NavLink>
                    <NavLink exact to="/assignedtickets" activeClassName="PageSwitcher__Item--Active" className="PageSwitcher__Item">Assigned Tickets</NavLink>
                    <NavLink to="/myaccount" activeClassName="PageSwitcher__Item--Active" className="PageSwitcher__Item">My Account</NavLink>
                </div>
                <div className="FormDual">
                    <div className="FormChain">
                        {Array.isArray(this.state.tickets) ? this.state.tickets.map((dat) => {
                            if (dat && dat.ticket_id) {
                                let tmp = "NAME: " + dat.full_name + "\nADDRESS: " + dat.address + "\nDESCRIPTION: " + dat.description + "\nSUBMITTED ON: " + dat.submit_time;

                                if (dat.is_closed) {
                                    return (
                                        <div key={dat.ticket_id} className="FormLink">
                                            <button><img src={resolved} alt="Resolved"></img></button>
                                            <textarea disabled value={tmp}></textarea>
                                        </div>
                                    );
                                } else {
                                    return (
                                        <div key={dat.ticket_id} className="FormLink" customkey={dat.ticket_id}>
                                            <button onClick={this.closeTicket}><img src={inprogress} alt="In Progress"></img></button>
                                            <textarea disabled value={tmp}></textarea>
                                        </div>
                                    );
                                }
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

export default AssignedTickets;