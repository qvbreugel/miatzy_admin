import React, { useState } from "react";

//Ant Design
import { Button, Typography, Modal } from "antd";
import StaticInput from "./../../Components/StaticInput";
const { Title } = Typography;

const Pay = () => {
  const [ticketNumber, setTicketNumber] = useState("");
  const [unsold, setUnsold] = useState([]);
  const [amountDue, setAmountDue] = useState(0);

  const showModal = () => {
    Modal.info({
      title: "Uitbetalen",
      centered: true,
      content: (
        <div>
          {console.log(unsold)}
          {unsold.map(product => (
            <div key={product.id}>
              <h2>Results:</h2>
              id: {product.product_id} name: {product.name}
            </div>
          ))}
          <div>
            <h2>Payment Due:</h2>
            <h3>{amountDue}</h3>
          </div>
        </div>
      ),
      onOk() {}
    });
  };

  const handleSubmit = event => {
    event.preventDefault();
    console.log(Date.now());

    const currentTicketNumber = ticketNumber;

    const data = {
      currentTicketNumber
    };

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
        setUnsold(response["unSold"]);
        const sold = response["Sold"];
        let subtotal = 0;
        for (let i = 0; i < sold.length; i++) {
          subtotal += sold[i]["price"];
        }
        const total = subtotal * 0.9;
        setAmountDue(total);
      })
      .catch(function(err) {
        console.log(err);
      });
  };

  const onChange = event => {
    setTicketNumber(event.target.value);
  };

  return (
    <div className="Window">
      <Title className="window-title">Uitbetalen</Title>
      <form onSubmit={handleSubmit} method="POST">
        <StaticInput
          onChange={onChange}
          value={ticketNumber}
          name="ticketNumber"
        />
        <Button className="window-button" type="primary" onClick={handleSubmit}>
          Uitbetalen
        </Button>
      </form>
    </div>
  );
};

export default Pay;
