import React, { Component } from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import "./App.css";

import Home from "./Pages/Home/Home";
import Receive from "./Pages/Receive/Receive";
import Sell from "./Pages/Sell/Sell";
import Pay from "./Pages/Pay/Pay";

class App extends Component {
  render() {
    return (
      <div className="App">
        <BrowserRouter>
          <Switch>
            <Route path="/" exact component={Home} />
            <Route path="/receive" exact component={Receive} />
            <Route path="/sell" exact component={Sell} />
            <Route path="/pay" exact component={Pay} />
          </Switch>
        </BrowserRouter>
      </div>
    );
  }
}

export default App;
