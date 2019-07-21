import React, { useEffect, useState } from "react";

import { Select } from "antd";
const { Option } = Select;

const SelectDate = props => {
  const [loading, setLoading] = useState(false);
  const [dates, setDates] = useState([]);

  const { setFetching, setTotal, setAllSelected } = props;

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
    setTotal(0);
    if (event === "all") {
      setAllSelected(true);
    }
    setFetching(true);

    const currentDate = event;
    const data = { currentDate };

    let subTotal = 0;

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
            subTotal += value["price"] * 0.9;
            subTotal.toFixed(2);
            setTotal(subTotal);
            setFetching(false);
          });
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
