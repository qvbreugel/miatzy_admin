import React, { useState, useEffect } from "react";

//Components
import DynamicInputs from "../../Components/DynamicInputs";
import LoadingSpinner from "../../Components/LoadingSpinner";
import ActionComplete from "../../Components/ActionComplete";

//Ant Design
import { Alert, Button, Modal, Typography } from "antd";
import SellButton from "../../Components/SellButton";
const { Title } = Typography;

const Sell = () => {
  //State Management
  const [items, setItems] = useState([""]);
  const [fetching, setFetching] = useState(false);
  const [sold, setSold] = useState(false);
  const [errors, setErrors] = useState([]);
  const [total, setTotal] = useState(0);
  const [visible, setVisible] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);

  //Variables
  let noDuplicateEntries = true;
  let subTotal = 0.0;

  //Clear sold items for re-render
  useEffect(() => {
    setItems([""]);
  }, [sold]);

  const handleSubmit = event => {
    event.preventDefault();
    setFetching(true);
    setConfirmLoading(true);

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
                subTotal += data["price"];
                console.log(subTotal);
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
                setConfirmLoading(false);
                setVisible(false);
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

  const handleCancel = () => {
    setVisible(false);
  };

  const sellBagClickHandler = event => {
    event.preventDefault();
    setFetching(true);

    fetch("/createbag", {
      method: "GET",
      headers: { "Content-Type": "application/json" }
    })
      .then(function(response) {
        if (response.status >= 400) {
          throw new Error("Bad response from server");
        }
        return response.json();
      })
      .then(function(data) {
        if (data["created"]) {
          let bagCode = `Miatzy.${data["product_id"]}`;
          setItems([...items, bagCode]);
          setFetching(false);
        }
      });
  };

  const payByCardClickHandler = event => {
    event.preventDefault();
    setFetching(true);

    fetch("/createpaybycard", {
      method: "GET",
      headers: { "Content-Type": "application/json" }
    })
      .then(function(response) {
        if (response.status >= 400) {
          throw new Error("Bad response from server");
        }
        return response.json();
      })
      .then(function(data) {
        if (data["created"]) {
          let payByCardCode = `Miatzy.${data["product_id"]}`;
          setItems([...items, payByCardCode]);
          setFetching(false);
        }
      });
  };

  let content = (
    <div>
      <Title className="window-title">Producten Verkopen</Title>
      <form onSubmit={handleSubmit} method="POST">
        <DynamicInputs
          items={items}
          onKeyPress={keyPressHandler}
          onInputChange={changeHandler}
        />
        <SellButton
          items={items}
          setVisible={setVisible}
          setFetching={setFetching}
          setTotal={setTotal}
          errors={errors}
          setErrors={setErrors}
        />
        <Button onClick={sellBagClickHandler}>Tasje Toevoegen</Button>
        <Button onClick={payByCardClickHandler}>Pinnen</Button>
      </form>
      <Modal
        title="Verkopen"
        visible={visible}
        onOk={handleSubmit}
        confirmLoading={confirmLoading}
        onCancel={handleCancel}
      >
        {total != 0 ? total : ""}
        {fetching ? <LoadingSpinner /> : ""}
      </Modal>
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
