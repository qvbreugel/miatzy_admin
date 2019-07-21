import React, { useEffect, useState } from "react";

//Components
import Currency from "../../Components/Currency";
import LoadingSpinner from "../../Components/LoadingSpinner";

//Ant Design
import { Typography } from "antd";
import SelectDate from "../../Components/SelectDate";
const { Title } = Typography;

const Earnings = () => {
  const [values, setValues] = useState([]);
  const [total, setTotal] = useState(0);
  const [fetching, setFetching] = useState(false);
  const [allSelected, setAllSelected] = useState(false);

  let subTotal = 0;

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
        setValues(data["values"]);
        data["values"].forEach(value => {
          subTotal += value["price"] * 0.9;
          subTotal.toFixed(2);
          setTotal(subTotal);
          setFetching(false);
        });
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
      {fetching ? <LoadingSpinner /> : ""}
      {total > 0 ? <Currency>{total}</Currency> : ""}
    </div>
  );
};

export default Earnings;
