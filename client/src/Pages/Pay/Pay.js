import React, { Component } from "react";

import ReturnToHome from "../../Components/ReturnToHome";

class Pay extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ticketNumber: "",
      unsold: [],
      amountDue: 0
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.onChange = this.onChange.bind(this);
  }

  handleSubmit(event) {
    event.preventDefault();

    const ticketNumber = this.state.ticketNumber;

    const data = {
      ticketNumber
    };

    const context = this;
    fetch("/pay", {
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
        context.setState({ unsold: response["unSold"] });
        const sold = response["Sold"];
        let subtotal = 0;
        for (let i = 0; i < sold.length; i++) {
          subtotal += sold[i]["price"];
        }
        const total = subtotal * 0.9;
        context.setState({ amountDue: total });
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
        <h1>Pay Supplier</h1>
        <form onSubmit={this.handleSubmit} method="POST">
          <label>Enter Ticket Number</label>
          <input
            onChange={this.onChange}
            value={this.state.ticketNumber}
            placeholder="Scan Barcode"
            name="ticketNumber"
          />
          <button>Enter item</button>
        </form>
        <h2>Results:</h2>
        {this.state.unsold.map(product => (
          <div key={product.id}>
            id: {product.product_id} name: {product.name}
          </div>
        ))}
        <div>
          <h2>Payment Due:</h2>
          <h3>{this.state.amountDue}</h3>
        </div>
      </div>
    );
  }
}

export default Pay;
