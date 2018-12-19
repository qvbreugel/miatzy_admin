import React, { Component } from "react";
import { Redirect } from "react-router-dom";

import ReturnToHome from "../../Components/ReturnToHome";

class Sell extends Component {
  constructor(props) {
    super(props);
    this.state = {
      item: "",
      sold: false
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.onChange = this.onChange.bind(this);
  }

  handleSubmit(event) {
    event.preventDefault();

    const pre = this.state.item.split(".");
    const ticketNumber = pre[0];
    const product_id = pre[1];
    const data = {
      ticketNumber,
      product_id
    };

    const context = this;

    console.log(ticketNumber);
    console.log(product_id);

    fetch("/sell", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    })
      .then(function(response) {
        if (response.status >= 400) {
          throw new Error("Bad response from server");
        }
        return response.json();
      })
      .then(function(response) {
        context.setState({ sold: response["Sold"] });
      })
      .catch(function(err) {
        console.log(err);
      });
  }

  onChange(e) {
    this.setState({ [e.target.name]: e.target.value });
  }

  render() {
    return (
      <div>
        <ReturnToHome />
        <h1>Sell Items</h1>
        <form onSubmit={this.handleSubmit} method="POST">
          <label>Scan Item</label>
          <input
            onChange={this.onChange}
            value={this.state.item}
            placeholder="Scan Barcode"
            name="item"
          />
          <button>Enter item</button>
        </form>
        {this.state.sold ? <Redirect to="/" /> : ""}
      </div>
    );
  }
}

export default Sell;
