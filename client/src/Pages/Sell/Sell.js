import React, { useState, useEffect } from "react";

//Components
import DynamicInputs from "../../Components/DynamicInputs";
import LoadingSpinner from "../../Components/LoadingSpinner";
import ActionComplete from "../../Components/ActionComplete";
import GetTotalButton from "../../Components/GetTotalButton";
import SellModal from "../../Components/SellModal";
import AddItemButton from "../../Components/Buttons/AddItemButton";

//Ant Design
import { Alert, Typography } from "antd";

const { Title } = Typography;

const Sell = () => {
  //State Management
  const [items, setItems] = useState([""]);
  const [fetching, setFetching] = useState(false);
  const [sold, setSold] = useState(false);
  const [errors, setErrors] = useState([]);
  const [total, setTotal] = useState(0);
  const [visible, setVisible] = useState(false);

  //Variables
  let noDuplicateEntries = true;

  //Clear sold items for re-render
  useEffect(() => {
    setItems([""]);
  }, [sold]);

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

  let content = (
    <div>
      <Title className="window-title">Producten Verkopen</Title>
      <form method="POST">
        <DynamicInputs
          items={items}
          onKeyPress={keyPressHandler}
          onInputChange={changeHandler}
        />
        <GetTotalButton
          items={items}
          setVisible={setVisible}
          setFetching={setFetching}
          setTotal={setTotal}
          errors={errors}
          setErrors={setErrors}
          noDuplicateEntries={noDuplicateEntries}
        />
        <AddItemButton
          setFetching={setFetching}
          items={items}
          setItems={setItems}
          type="bag"
        />
        <AddItemButton
          setFetching={setFetching}
          items={items}
          setItems={setItems}
          type="card"
        />
      </form>
      <SellModal
        visible={visible}
        total={total}
        fetching={fetching}
        setVisible={setVisible}
        items={items}
        setSold={setSold}
      />
      {fetching ? <LoadingSpinner /> : ""}
      {errors.length
        ? errors.map((error, errorIndex) => {
            return (
              <Alert
                key={errorIndex}
                message={error["message"]}
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
        buttonText="Verkoop meer producten"
        onClick={clickHandler}
      />
    );
  }

  return <div className="Window">{content}</div>;
};

export default Sell;
