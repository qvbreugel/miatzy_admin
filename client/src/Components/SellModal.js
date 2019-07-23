import React, { useState } from "react";

//Ant Design
import { Modal } from "antd";

//Components
import LoadingSpinner from "./LoadingSpinner";
import Currency from "./Currency";

const SellModal = props => {
  //State Management
  const [confirmLoading, setConfirmLoading] = useState(false);

  //Props Destructuring
  const { visible, setVisible, total, fetching, items, setSold } = props;

  //Action Handlers
  const handleCancel = () => {
    setVisible(false);
  };

  const handleOk = event => {
    event.preventDefault();
    setConfirmLoading(true);

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
          .then(function(data) {
            if (data["Sold"]) {
              counter++;
            }
            if (counter === inputs.length) {
              setConfirmLoading(false);
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
      onOk={handleOk}
      okText="Bevestigen"
      confirmLoading={confirmLoading}
      onCancel={handleCancel}
      cancelText="Annuleren"
    >
      <Currency>{total !== 0 ? total : ""}</Currency>
      {fetching ? <LoadingSpinner /> : ""}
    </Modal>
  );
};

export default SellModal;
