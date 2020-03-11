import React, { useEffect, useState } from "react";

//Components
import Currency from "../../Components/Currency";
import LoadingSpinner from "../../Components/LoadingSpinner";

//Ant Design
import { Typography } from "antd";
import SelectDate from "../../Components/SelectDate";
const { Title } = Typography;

let subCashInit = 0.0;
let subCardInit = 0.0;

const Earnings = () => {
  const [values, setValues] = useState([]);
  const [total, setTotal] = useState(0);
  const [fetching, setFetching] = useState(false);
  const [allSelected, setAllSelected] = useState(false);

  const addToSub = value => {
    if (value["status"] === 20) {
      if (value["ticketnumber"] == "Miatzy") {
        subCashInit += value["price"];
      } else {
        subCashInit += value["price"] * 0.1;
      }
    } else if (value["status"] === 30) {
      if (value["ticketnumber"] == "Miatzy") {
        subCashInit += value["price"];
      } else {
        subCardInit += value["price"] * 0.1;
      }
    }
  };

  useEffect(() => {
    subCashInit = 0.0;
    subCardInit = 0.0;
    setAllSelected(false); //Create trigger
    setFetching(true);
    fetch("/earnings", {
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
        setValues(data["values"]);
        data["values"].forEach(value => {
          addToSub(value);
        });
        const subTotal = subCashInit + subCardInit;
        setTotal(subTotal);
        setFetching(false);
      });
  }, [allSelected]);

  return (
    <div className="Window">
      <Title className="window-title">Opbrengsten</Title>
      <SelectDate
        setFetching={setFetching}
        setTotal={setTotal}
        setAllSelected={setAllSelected}
      />
      <p>Cash: {subCashInit.toFixed(2)}</p>
      <p>Card: {subCardInit.toFixed(2)}</p>
      {fetching ? <LoadingSpinner /> : ""}
      {total > 0 ? <Currency>{total}</Currency> : ""}
    </div>
  );
};

export default Earnings;
