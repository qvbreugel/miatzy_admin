import React, { useState } from "react";
import { Redirect } from "react-router-dom";

import DynamicInputs from "../../Components/DynamicInputs";

//Ant Design
import { Button, Typography } from "antd";
const { Title } = Typography;

const Sell = () => {
  const [items, setItems] = useState([""]);
  const [fetching, setFetching] = useState(false);
  const [sold, setSold] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = event => {
    event.preventDefault();
    setFetching(true);

    const inputs = [...items];

    for (let i = 0; i < inputs.length; i++) {
      if (inputs[i] !== "") {
        const pre = inputs[i].split(".");
        const ticketNumber = pre[0];
        const product_id = pre[1];
        const data = {
          ticketNumber,
          product_id
        };

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
          .catch(function(err) {
            console.log(err);
          });
      }
    }
  };

  const keyPressHandler = event => {
    if (event.key === "Enter") {
      event.preventDefault();
      setItems([...items, ""]);
    }
  };

  const changeHandler = event => {
    let itemsCopy = [...items];
    itemsCopy[event.target.dataset.id] = event.target.value;
    setItems(itemsCopy);
  };

  let producten = "Product";

  if (items.length > 1) {
    producten = "Producten  ";
  }

  return (
    <div className="Window">
      <Title className="window-title">Producten Verkopen</Title>
      <form onSubmit={handleSubmit} method="POST">
        <DynamicInputs
          items={items}
          onKeyPress={keyPressHandler}
          onInputChange={changeHandler}
        />
        <Button className="window-button" type="primary" onClick={handleSubmit}>
          {producten} Verkopen
        </Button>
      </form>
      {sold ? <Redirect to="/" /> : ""}
      {fetching ? "Fetching..." : ""}
    </div>
  );
};

export default Sell;
