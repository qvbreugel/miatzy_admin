import React, { useState, useEffect } from "react";

//Components
import DynamicInputs from "../../Components/DynamicInputs";
import LoadingSpinner from "../../Components/LoadingSpinner";
import ActionComplete from "../../Components/ActionComplete";

//Ant Design
import { Alert, Button, Typography } from "antd";
const { Title } = Typography;

const Sell = () => {
  //State Management
  const [items, setItems] = useState([""]);
  const [fetching, setFetching] = useState(false);
  const [sold, setSold] = useState(false);
  const [errors, setErrors] = useState([]);

  //Variables
  let noDuplicateEntries = true;

  //Clear sold items for re-render
  useEffect(() => {
    setItems([""]);
  }, [sold]);

  const handleSubmit = event => {
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
              if (counter === inputs.length) {
                if (errors.length > 0) {
                  setErrors([]);
                }
                setFetching(false);
                setSold(true);
              } else if (counter + errorCounter === inputs.length) {
                setErrors(QueryErrors);
                setFetching(false);
              }
            })
            .catch(function(err) {
              console.log(err);
            });
        } else {
          counter++;
        }
      }
    }
  };

  const keyPressHandler = event => {
    if (event.key === "Enter") {
      event.preventDefault();
      setErrors([]);
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
        }
      }
      setItems([...items, ""]);
    }
  };

  const changeHandler = event => {
    let itemsCopy = [...items];
    itemsCopy[event.target.dataset.id] = event.target.value;
    setItems(itemsCopy);
  };

  const clickHandler = () => {
    setSold(false);
  };

  let producten = "Product";

  if (items.length > 1) {
    producten = "Producten";
  }

  let content = (
    <div>
      <Title className="window-title">Producten Verkopen</Title>
      <form onSubmit={handleSubmit} method="POST">
        <DynamicInputs
          items={items}
          onKeyPress={keyPressHandler}
          onInputChange={changeHandler}
        />
        <Button className="window-button" type="primary" onClick={handleSubmit}>
          {producten} Verkopen
        </Button>
      </form>
      {fetching ? <LoadingSpinner /> : ""}
      {errors.length
        ? errors.map((error, errorIndex) => {
            return (
              <Alert
                key={errorIndex}
                message={error["title"]}
                description={error["message"]}
                type="error"
                showIcon
              />
            );
          })
        : ""}
    </div>
  );

  if (sold) {
    content = (
      <ActionComplete
        title="Alle producten zijn succesvol verkocht!"
        subTitle="Neem het geld in ontvangst en overhandig de procuten."
        onClick={clickHandler}
      />
    );
  }

  return <div className="Window">{content}</div>;
};

export default Sell;
