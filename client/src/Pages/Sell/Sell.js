import React, { useState } from "react";
import { Redirect } from "react-router-dom";

import ReturnToHome from "../../Components/ReturnToHome";
import DynamicInputs from "../../Components/DynamicInputs";

const Sell = () => {
  const [items, setItems] = useState([""]);
  const [sold, setSold] = useState(false);

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
    setSold(true);
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
    <div className="Window">
      <ReturnToHome />
      <h1>Sell Items</h1>
      <form onSubmit={handleSubmit} method="POST">
        <DynamicInputs
          items={items}
          onKeyPress={keyPressHandler}
          onChange={changeHandler}
        />
        <button>Sell item</button>
      </form>
      {sold ? <Redirect to="/" /> : ""}
    </div>
  );
};

export default Sell;
