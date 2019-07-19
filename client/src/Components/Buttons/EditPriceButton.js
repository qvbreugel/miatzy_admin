import React from "react";

//Ant Design
import { Button } from "antd";

const EditPriceButton = props => {
  //Props Destructuring
  const { item, newPrice, setFetching, setPriceEdited } = props;

  const handleClick = event => {
    event.preventDefault();
    setFetching(true);
    const [ticketNumber, product_id] = item.split(".");

    const data = {
      ticketNumber,
      product_id,
      newPrice
    };

    fetch("/editprice", {
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
        if (data["priceEdited"]) {
          setFetching(false);
          setPriceEdited(true);
        }
      });
  };

  return (
    <Button className="window-button" type="primary" onClick={handleClick}>
      Prijs Aanpassen
    </Button>
  );
};

export default EditPriceButton;
