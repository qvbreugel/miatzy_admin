import React, { useState, useEffect } from "react";

//Components
import DynamicInputs from "../../Components/DynamicInputs";
import LoadingSpinner from "../../Components/LoadingSpinner";
import ActionComplete from "../../Components/ActionComplete";

//Ant Design
import { Alert, Button, Typography } from "antd";
const { Title } = Typography;

const Receive = () => {
  //State Management
  const [items, setItems] = useState([{ barcode: "", status: 1 }]);
  const [received, setReceived] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [errors, setErrors] = useState([]);

  //Variables
  let noDuplicateEntries = true;

  //Clear received items for re-render
  useEffect(() => {
    setItems([{ barcode: "", status: 1 }]);
  }, [received]);

  const handleSubmit = event => {
    event.preventDefault();
    setFetching(true);

    for (let i = items.length - 2; i >= 0; i--) {
      if (items[items.length - 1]["barcode"] === items[i]["barcode"]) {
        setErrors([
          ...errors,
          {
            title: "Product al gescand",
            message: `Product met barcode ${
              items[items.length - 1]["barcode"]
            } is al gescand. Scan een ander product of haal de invoer weg.`
          }
        ]);
        noDuplicateEntries = false;
        setFetching(false);
      }
    }

    if (noDuplicateEntries && !errors.length) {
      setErrors([]);
      const inputs = [...items];

      let counter = 0;
      let errorCounter = 0;
      let QueryErrors = [];

      for (let i = 0; i < inputs.length; i++) {
        if (inputs[i]["barcode"] !== "") {
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
            .then(function(data) {
              if (data["Received"]) {
                counter++;
              } else if (!data["Received"]) {
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
                setReceived(true);
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
        console.log(items[items.length - 1]["barcode"]);
        if (items[items.length - 1]["barcode"] === items[i]["barcode"]) {
          setErrors([
            ...errors,
            {
              title: "Product al gescand",
              message: `Product met barcode ${
                items[items.length - 1]["barcode"]
              } is al gescand. Scan een ander product of haal de invoer weg.`
            }
          ]);
          noDuplicateEntries = false;
        }
      }
      setItems([...items, { barcode: "", status: 1 }]);
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

  const clickHandler = () => {
    setReceived(false);
  };

  let producten = "Product";

  if (items.length > 1) {
    producten = "Producten";
  }

  let content = (
    <div>
      <Title className="window-title">Producten Ontvangen</Title>
      <form onSubmit={handleSubmit} method="POST">
        <DynamicInputs
          items={items}
          onKeyPress={keyPressHandler}
          onInputChange={inputChangeHandler}
          onSelectChange={selectChangeHanlder}
          receive
        />
        <Button className="window-button" type="primary" onClick={handleSubmit}>
          {producten} Ontvangen
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

  if (received) {
    content = (
      <ActionComplete
        title="Alle producten zijn succesvol ontvangen!"
        subTitle="Neem de producten in en leg ze klaar voor de verkoop."
        buttonText="Neem meer producten in ontvangst"
        onClick={clickHandler}
      />
    );
  }

  return <div className="Window">{content}</div>;
};

export default Receive;
