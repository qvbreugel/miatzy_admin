import React from "react";

//Ant Design
import { Button } from "antd";

const GetTotalToPayButton = props => {
  //Props Destructuring
  const {
    setFetching,
    setVisible,
    setAmountDue,
    setUnsold,
    ticketNumber,
    setError
  } = props;

  const showModal = event => {
    event.preventDefault();
    setFetching(true);
    setError("");

    const currentTicketNumber = ticketNumber;

    const data = {
      currentTicketNumber
    };

    fetch("/pay/total", {
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
        if (data["totalReceived"]) {
          const sold = data["Sold"];
          let subtotal = 0;
          for (let i = 0; i < sold.length; i++) {
            subtotal += sold[i]["price"];
          }
          const total = subtotal * 0.9;
          setUnsold(data["unSold"]);
          setAmountDue(total);
          setVisible(true);
          setFetching(false);
        } else if (!data["totalReceived"]) {
          const errorMessage = data["error"];
          setError(errorMessage);
        }
      })
      .catch(function(err) {
        console.log(err);
      });
  };

  return (
    <Button className="window-button" type="primary" onClick={showModal}>
      Totaalbedrag
    </Button>
  );
};

export default GetTotalToPayButton;
