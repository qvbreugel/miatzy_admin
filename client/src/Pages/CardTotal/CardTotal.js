import React, { useEffect, useState } from "react";
import { Typography } from "antd";
import Currency from "../../Components/Currency";
import LoadingSpinner from "../../Components/LoadingSpinner";

const { Title } = Typography;

const CardTotal = () => {
  const [total, setTotal] = useState(0);
  const [fetching, setFetching] = useState(false);

  useEffect(() => {
    setFetching(true);
    fetch("/cardtotal", {
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
        if (data["fetched"]) {
          setTotal(data["total"]);
          setFetching(false);
        }
      });
  }, []);

  return (
    <div className="Window">
      <Title className="window-title">Totaal Gepind</Title>
      {fetching ? <LoadingSpinner /> : <Currency>{total}</Currency>}
    </div>
  );
};

export default CardTotal;
