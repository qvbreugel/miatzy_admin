import React from "react";

//Ant Design
import { Button } from "antd";

const SellButton = props => {
  const { setFetching, setVisible, setTotal, setErrors, errors, items } = props;

  //Dynamic Rendering
  let producten = "Product";

  if (items.length > 1) {
    producten = "Producten";
  }

  //Variables
  let noDuplicateEntries = true;

  const showModal = event => {
    event.preventDefault();
    setFetching(true);

    for (let i = items.length - 2; i >= 0; i--) {
      if (items[items.length - 1] === items[i]) {
        setErrors([
          ...errors,
          {
            title: "Product al gescand",
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
                setTotal(subTotal);
                setFetching(false);
              } else if (!data["Sold"]) {
                const errorTitle = data["error"]["title"];
                const errorMessage = data["error"]["message"];
                QueryErrors = [...QueryErrors, { title: "", message: "" }];
                QueryErrors[errorCounter] = {
                  title: errorTitle,
                  message: errorMessage
                };
                errorCounter++;
              }
            });
          setVisible(true);
        }
      }
    }
  };

  return (
    <Button className="window-button" type="primary" onClick={showModal}>
      {producten} Verkopen
    </Button>
  );
};

export default SellButton;
