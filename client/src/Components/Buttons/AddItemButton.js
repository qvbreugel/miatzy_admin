import React from "react";

//Ant Design
import { Button } from "antd";

const AddItemButton = props => {
  //Props Destructuring
  const { setFetching, items, setItems, type } = props;

  //Variables
  let route = "404";
  let text = "...";

  if (type === "bag") {
    route = "/createbag";
    text = "Tasje Toevoegen";
  } else if (type === "card") {
    route = "/createpaybycard";
    text = "Pinkosten";
  }

  const ClickHandler = event => {
    event.preventDefault();
    setFetching(true);

    fetch(route, {
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
          let Code = `Miatzy.${data["product_id"]}`;
          setItems([...items, Code]);
          setFetching(false);
        }
      });
  };

  return <Button onClick={ClickHandler}>{text}</Button>;
};

export default AddItemButton;
