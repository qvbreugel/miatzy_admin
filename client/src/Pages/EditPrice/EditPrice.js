import React, { useState, useEffect } from "react";

//Components
import StaticInput from "./../../Components/StaticInput";
import LoadingSpinner from "./../../Components/LoadingSpinner";
import EditPriceButton from "../../Components/Buttons/EditPriceButton";
import ActionComplete from "../../Components/ActionComplete";

//Ant Design
import { Alert, Typography } from "antd";
const { Title } = Typography;

const EditPrice = () => {
  //State Management
  const [item, setItem] = useState("");
  const [newPrice, setNewPrice] = useState("");
  const [fetching, setFetching] = useState(false);
  const [priceEdited, setPriceEdited] = useState(false);
  const [error, setError] = useState("");

  //Clean up inputs on re-render
  useEffect(() => {
    setItem("");
    setNewPrice("");
  }, [priceEdited]);

  const onChange = event => {
    if (event.target.name === "item") {
      setItem(event.target.value);
    } else if (event.target.name === "newPrice") {
      setNewPrice(event.target.value);
    }
  };

  const keyPressHandler = event => {
    if (event.key === "Enter") {
      event.preventDefault();
    }
  };

  const clickHandler = event => {
    event.preventDefault();
    setPriceEdited(false);
  };

  let content = (
    <div>
      <Title className="window-title">Prijs Aanpassen</Title>
      <form method="POST">
        <StaticInput
          onChange={onChange}
          value={item}
          name="item"
          onKeyPress={keyPressHandler}
          autoFocus={true}
          placeHolder="Barcode"
        />
        <StaticInput
          onChange={onChange}
          value={newPrice}
          name="newPrice"
          onKeyPress={keyPressHandler}
          placeHolder="Nieuwe Prijs"
        />
        <EditPriceButton
          item={item}
          newPrice={newPrice}
          setFetching={setFetching}
          setPriceEdited={setPriceEdited}
          setError={setError}
        />
      </form>
      {fetching ? <LoadingSpinner /> : ""}
      {error ? <Alert message={error} type="error" showIcon /> : ""}
    </div>
  );

  if (priceEdited) {
    content = (
      <ActionComplete
        title="Prijs succesvol aangepast!"
        subTitle="Je kan het product nu terugleggen"
        onClick={clickHandler}
        buttonText={"Pas nog een product aan"}
      />
    );
  }

  return <div className="Window">{content}</div>;
};

export default EditPrice;
