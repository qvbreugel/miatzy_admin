import React, { useState } from "react";

//Ant Design
import { Modal, Button } from "antd";

//Components
import LoadingSpinner from "./LoadingSpinner";
import Currency from "./Currency";

const SellModal = props => {
  //State Management
  const [cashLoading, setCashLoading] = useState(false);

  //Props Destructuring
  const { visible, setVisible, total, fetching, items, setSold } = props;

  //Action Handlers
  const handleCancel = () => {
    setVisible(false);
  };

  const handlePayCash = event => {
    event.preventDefault();
    setCashLoading(true);

    //Copy Items array
    const inputs = [...items];

    //Counter
    let counter = 0;

    for (let i = 0; i < inputs.length; i++) {
      if (inputs[i] !== "") {
        const [ticketNumber, unfilteredProduct_id] = inputs[i].split(".");
        const [product_id] = unfilteredProduct_id.split(" ");
        const data = {
          ticketNumber,
          product_id
        };

        fetch("/sell/cash", {
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
          .then(function(data) {
            if (data["Sold"]) {
              counter++;
            }
            if (counter === inputs.length) {
              setCashLoading(false);
              setVisible(false);
              setSold(true);
            }
          })
          .catch(function(err) {
            console.log(err);
          });
      } else {
        counter++;
      }
    }
  };

  const handlePayByCard = event => {
    event.preventDefault();
    setCashLoading(true);

    //Copy Items array
    const inputs = [...items];

    //Counter
    let counter = 0;

    for (let i = 0; i < inputs.length; i++) {
      if (inputs[i] !== "") {
        const [ticketNumber, unfilteredProduct_id] = inputs[i].split(".");
        const [product_id] = unfilteredProduct_id.split(" ");
        const data = {
          ticketNumber,
          product_id
        };

        fetch("/sell/card", {
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
          .then(function(data) {
            if (data["Sold"]) {
              counter++;
            }
            if (counter === inputs.length) {
              setCashLoading(false);
              setVisible(false);
              setSold(true);
            }
          })
          .catch(function(err) {
            console.log(err);
          });
      } else {
        counter++;
      }
    }
  };

  return (
    <Modal
      title="Verkopen"
      visible={visible}
      onCancel={handleCancel}
      footer={[
        <Button key="paybycard" onClick={handlePayByCard} type="primary">
          Pinnen
        </Button>,
        <Button
          key="paycash"
          loading={cashLoading}
          onClick={handlePayCash}
          type="primary"
        >
          Contant
        </Button>
      ]}
    >
      <Currency>{total !== 0 ? total : ""}</Currency>
      {fetching ? <LoadingSpinner /> : ""}
    </Modal>
  );
};

export default SellModal;
