import React, { useState } from "react";

//Components
import DynamicInputs from "../../Components/DynamicInputs";

//Ant Design
import { Button, Typography } from "antd";
const { Title } = Typography;

const Receive = () => {
  const [items, setItems] = useState([{ barcode: "", status: 1 }]);
  const [received, setReceived] = useState(false);

  const handleSubmit = event => {
    event.preventDefault();

    const inputs = [...items];
    for (let i = 0; i < inputs.length; i++) {
      if (inputs[i] !== "") {
        const pre = inputs[i]["barcode"].split(".");
        const ticketNumber = pre[0];
        const product_id = pre[1];
        const status = inputs[i]["status"];
        const data = {
          ticketNumber,
          product_id,
          status
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
      setItems([...items, { barcode: "", status: 99 }]);
    }
  };

  const inputChangeHandler = event => {
    let itemsCopy = [...items];
    itemsCopy[event.target.dataset.id]["barcode"] = event.target.value;
    setItems(itemsCopy);
  };

  const selectChangeHanlder = (value, event) => {
    let itemsCopy = [...items];
    itemsCopy[event.props.id]["status"] = value;
    setItems(itemsCopy);
  };

  let producten = "Product";

  if (items.length > 1) {
    producten = "Producten  ";
  }

  return (
    <div className="Window">
      <Title className="window-title">Producten Ontvangen</Title>
      <form onSubmit={handleSubmit} method="POST">
        <DynamicInputs
          items={items}
          onKeyPress={keyPressHandler}
          onInputChange={inputChangeHandler}
          onSelectChange={selectChangeHanlder}
        />
        <Button className="window-button" type="primary" onClick={handleSubmit}>
          {producten} Ontvangen
        </Button>
      </form>
      {received ? "Received" : ""}
    </div>
  );
};

export default Receive;
