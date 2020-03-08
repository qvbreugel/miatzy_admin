import React, { useEffect, useState } from "react";

//Components
import Currency from "../../Components/Currency";
import LoadingSpinner from "../../Components/LoadingSpinner";

//Ant Design
import { Typography } from "antd";
import SelectDate from "../../Components/SelectDate";
const { Title } = Typography;

let subCashInit = 0;
let subCardInit = 0;

const Earnings = () => {
  const [values, setValues] = useState([]);
  const [subCard, setSubCard] = useState(0);
  const [subCash, setSubCash] = useState(0.0);
  const [total, setTotal] = useState(0);
  const [fetching, setFetching] = useState(false);
  const [allSelected, setAllSelected] = useState(false);

  const addToSub = value => {
    if (value["status"] === 20) {
      subCashInit += value["price"] * 0.1;
    } else if (value["status"] === 30) {
      subCardInit += value["price"] * 0.1;
    }
  };

  useEffect(() => {
    setAllSelected(false);
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
        console.log(data["values"]);
        setValues(data["values"]);
        data["values"].forEach(value => {
          addToSub(value);
        });
        subCashInit = (subCashInit * 0.1).toFixed(2);
        subCardInit = (subCardInit * 0.1).toFixed(2);
        const subTotal = subCashInit + subCardInit;
        setTotal(subTotal);
        setFetching(false);
      });
  }, [allSelected]);

  console.log(subCashInit);

  return (
    <div className="Window">
      <Title className="window-title">Opbrengsten</Title>
      <SelectDate
        setFetching={setFetching}
        setTotal={setTotal}
        setAllSelected={setAllSelected}
      />
      <p>Cash: {subCashInit}</p>
      <p>Card: {subCard}</p>
      {fetching ? <LoadingSpinner /> : ""}
      {total > 0 ? <Currency>{total}</Currency> : ""}
    </div>
  );
};

export default Earnings;
