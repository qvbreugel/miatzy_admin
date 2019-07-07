import React, { useState } from "react";
import { Redirect } from "react-router-dom";

import ReturnToHome from "../../Components/ReturnToHome";
import DynamicInputs from "../../Components/DynamicInputs";

const Receive = () => {
  const [items, setItems] = useState([""]);
  const [received, setReceived] = useState(false);

  const handleSubmit = event => {
    event.preventDefault();

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

        fetch("/receive", {
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
    setReceived(true);
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
    console.log(items);
  };

  return (
    <div className="grid-container">
      <div className="Middle">
        <ReturnToHome />
        <h1>Receive Items</h1>
        <form onSubmit={handleSubmit} method="POST">
          <label>Scan Item</label>
          <DynamicInputs
            items={items}
            onKeyPress={keyPressHandler}
            onChange={changeHandler}
          />
          <button>Enter Items</button>
        </form>
        {received ? <Redirect to="/" /> : ""}
      </div>
    </div>
  );
};

export default Receive;
