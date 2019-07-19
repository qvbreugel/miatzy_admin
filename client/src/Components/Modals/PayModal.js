import React, { useState } from "react";

//Ant Design
import { Modal } from "antd";
import Currency from "../Currency";

//Components

const PayModal = props => {
  //State Management
  const [confirmLoading, setConfirmLoading] = useState(false);

  //Props Destructuring
  const {
    visible,
    setVisible,
    unsold,
    amountDue,
    ticketNumber,
    setUserPaid
  } = props;

  //Action Handlers
  const handleCancel = () => {
    setVisible(false);
  };

  const handleOk = event => {
    event.preventDefault();
    setConfirmLoading(true);

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
      .then(function(data) {
        if (data["userPaid"]) {
          setConfirmLoading(false);
          setVisible(false);
          setUserPaid(true);
        }
      })
      .catch(function(err) {
        console.log(err);
      });
  };

  return (
    <Modal
      title="Uitbetalen"
      visible={visible}
      onOk={handleOk}
      okText="Bevestigen"
      confirmLoading={confirmLoading}
      onCancel={handleCancel}
      cancelText="Annuleren"
    >
      <h2>Niet verkochte producten:</h2>
      {unsold.map(product => (
        <div key={product.id}>
          Naam: {product.name}, id: {product.product_id}
        </div>
      ))}
      <Currency>{amountDue}</Currency>
    </Modal>
  );
};

export default PayModal;
