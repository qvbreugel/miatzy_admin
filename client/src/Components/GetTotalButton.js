import React from "react";

//Ant Design
import { Button } from "antd";

const GetTotalButton = props => {
  //Props Destructuring
  const {
    setFetching,
    setVisible,
    setTotal,
    setErrors,
    errors,
    items,
    noDuplicateEntries
  } = props;

  //Dynamic Rendering
  let producten = "Product";

  if (items.length > 1) {
    producten = "Producten";
  }

  const showModal = event => {
    event.preventDefault();
    setFetching(true);

    for (let i = items.length - 2; i >= 0; i--) {
      if (items[items.length - 1] === items[i]) {
        setErrors([
          ...errors,
          {
            message: `Product met barcode ${
              items[items.length - 1]
            } is al gescand. Scan een ander product of haal de invoer weg.`
          }
        ]);
        noDuplicateEntries = false;
        setFetching(false);
      }
    }

    if (noDuplicateEntries) {
      setErrors([]);
      const inputs = [...items];

      let counter = 0;
      let errorCounter = 0;
      let QueryErrors = [];
      let subTotal = 0;

      for (let i = 0; i < inputs.length; i++) {
        if (inputs[i] !== "") {
          const pre = inputs[i].split(".");
          const ticketNumber = pre[0];
          const product_id = pre[1];
          if (product_id === undefined) {
            setErrors([
              ...errors,
              {
                message: `Product met barcode ${
                  items[items.length - 1]
                } bevat geen product id. Voeg het product id toe.`
              }
            ]);
            setFetching(false);
          } else {
            const index = i;
            const data = {
              ticketNumber,
              product_id,
              index
            };

            fetch("/sell/total", {
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
                if (data["priceReceived"]) {
                  const price = data["price"];
                  subTotal += price;
                  counter++;
                } else if (!data["priceReceived"]) {
                  const errorMessage = data["error"]["message"];
                  QueryErrors = [...QueryErrors, { title: "", message: "" }];
                  QueryErrors[errorCounter] = {
                    message: errorMessage
                  };
                  errorCounter++;
                }
                if (counter === inputs.length) {
                  if (errors.length > 0) {
                    setErrors([]);
                  }
                  setTotal(subTotal);
                  setVisible(true);
                  setFetching(false);
                } else if (counter + errorCounter === inputs.length) {
                  setErrors(QueryErrors);
                  setFetching(false);
                }
              })
              .catch(function(err) {
                console.log(err);
              });
          }
        } else {
          counter++;
        }
      }
    }
  };

  return (
    <Button className="window-button" type="primary" onClick={showModal}>
      Totaalbedrag
    </Button>
  );
};

export default GetTotalButton;
