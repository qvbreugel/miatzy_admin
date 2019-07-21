import React from "react";

//Ant Design
import { Button } from "antd";

const EditPriceButton = props => {
  //Props Destructuring
  const { item, newPrice, setFetching, setPriceEdited, setError } = props;

  const handleClick = event => {
    event.preventDefault();
    setFetching(true);
    setError("");
    const [ticketNumber, product_id] = item.split(".");

    if (product_id === undefined) {
      setError("Product bevat geen product id. Voeg een product id toe.");
      setFetching(false);
    } else if (newPrice === "") {
      setError("Geen nieuwe prijs ingevoerd. Voer een nieuwe prijs in.");
      setFetching(false);
    } else {
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
          } else if (!data["priceEdited"]) {
            setFetching(false);
            setError(data["error"]);
          }
        });
    }
  };

  return (
    <Button className="window-button" type="primary" onClick={handleClick}>
      Prijs Aanpassen
    </Button>
  );
};

export default EditPriceButton;
