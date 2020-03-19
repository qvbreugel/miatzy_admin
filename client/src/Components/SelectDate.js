import React, { useEffect, useState } from "react";

import { Select } from "antd";
const { Option } = Select;

const SelectDate = props => {
  const [loading, setLoading] = useState(false);
  const [dates, setDates] = useState([]);

  let subCashInit = 0.0;
  let subCardInit = 0.0;

  const { setFetching, setTotal, setSelectTrigger, selectTrigger } = props;

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
    setLoading(true);
    fetch("/dates", {
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
        if (data["datesFetched"]) {
          setDates(data["dates"]);
          setLoading(false);
        }
      });
  }, []);

  const changeHandler = event => {
    setTotal({ cardTotal: 0, cashTotal: 0, total: 0 });
    if (event === "all") {
      setSelectTrigger(!selectTrigger);
    }
    setFetching(true);

    subCashInit = 0.0;
    subCardInit = 0.0;

    const currentDate = event;
    const data = { currentDate };

    fetch("/datespecificearnings", {
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
        if (data["valuesFetched"]) {
          data["values"].forEach(value => {
            addToSub(value);
          });
          setTotal({
            cashTotal: subCashInit,
            cardTotal: subCardInit,
            total: subCardInit + subCashInit
          });
          setFetching(false);
        }
      });
  };

  return (
    <Select defaultValue="all" loading={loading} onChange={changeHandler}>
      <Option value="all">Alle dagen</Option>
      {dates.map((date, index) => {
        const formattedDate = date["date"].split("T")[0];
        return (
          <Option value={date["date"].split("T")[0]} key={index}>
            {formattedDate}
          </Option>
        );
      })}
    </Select>
  );
};

export default SelectDate;
