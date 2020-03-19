import React, { useEffect, useState } from "react";

//Components
import Currency from "../../Components/Currency";
import LoadingSpinner from "../../Components/LoadingSpinner";

//Ant Design
import { Typography } from "antd";
import SelectDate from "../../Components/SelectDate";
const { Title } = Typography;

const Earnings = () => {
  const [total, setTotal] = useState({ cashTotal: 0, cardTotal: 0, total: 0 });
  const [fetching, setFetching] = useState(false);
  const [selectTrigger, setSelectTrigger] = useState(false);

  let subCashInit = 0.0;
  let subCardInit = 0.0;

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
        data["values"].forEach(value => {
          addToSub(value);
        });
        setTotal({
          cashTotal: subCashInit,
          cardTotal: subCardInit,
          total: subCardInit + subCashInit
        });
        setFetching(false);
      });
  }, [selectTrigger]);

  return (
    <div className="Window">
      <Title className="window-title">Opbrengsten</Title>
      <SelectDate
        setFetching={setFetching}
        setTotal={setTotal}
        setSelectTrigger={setSelectTrigger}
        selectTrigger={selectTrigger}
      />
      <p>Contant: {total.cashTotal.toFixed(2)}</p>
      <p>Pin: {total.cardTotal.toFixed(2)}</p>
      {fetching ? <LoadingSpinner /> : ""}
      {total.total > 0 ? <Currency>{total.total}</Currency> : ""}
    </div>
  );
};

export default Earnings;
