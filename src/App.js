import React, { Component } from "react";
import { HashRouter as Router, Route } from "react-router-dom";
import SignUp from "./pages/SignUp";
import LogIn from "./pages/LogIn";
import CreateTicket from "./pages/CreateTicket";
import TicketHistory from "./pages/TicketHistory";
import MyAccount from "./pages/MyAccount";
import generateAlert from "./pages/AlertMessage";
import PendingTickets from "./pages/PendingTickets";
import AssignedTickets from "./pages/AssignedTickets";
import UnverifiedTenants from "./pages/UnverifiedTenants";
import UnverifiedWorkers from "./pages/UnverifiedWorkers";
import "./App.css";

class App extends Component {
  render() {
    return (
      <div>
        <Router>
          <div className="App">
            <div className="App__Form">
              <Route exact path="/" component={SignUp}>
              </Route>
              <Route path="/login" component={LogIn}>
              </Route>
              <Route path="/createticket" component={CreateTicket}>
              </Route>
              <Route path="/tickethistory" component={TicketHistory}>
              </Route>
              <Route path="/myaccount" component={MyAccount}>
              </Route>
              <Route path="/pendingtickets" component={PendingTickets}>
              </Route>
              <Route path="/assignedtickets" component={AssignedTickets}>
              </Route>
              <Route path="/unverifiedtenants" component={UnverifiedTenants}>
              </Route>
              <Route path="/unverifiedworkers" component={UnverifiedWorkers}>
              </Route>
              <Route path="/" component={e => generateAlert()}>
              </Route>
            </div>
          </div>
        </Router>
      </div>
    );
  }
}

export default App;
