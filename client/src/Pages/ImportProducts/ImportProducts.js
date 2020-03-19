import React, { useState } from "react";

//Antd
import LoadingSpinner from "../../Components/LoadingSpinner";
import { Button, Typography, Divider } from "antd";
const { Title } = Typography;

const ImportProducts = () => {
  const [fetching, setFetching] = useState(false);

  const handleSubmit = event => {
    event.preventDefault();
    setFetching(true);

    fetch("/import", {
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
        console.log(data);
        setFetching(false);
      });
  };

  const handleReset = event => {
    event.preventDefault();
    setFetching(true);

    fetch("/reset", {
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
        setFetching(false);
      });
  };
  return (
    <div className="Window">
      <Title className="window-title">Producten importeren</Title>
      <form method="POST">
        <Button className="window-button" type="primary" onClick={handleSubmit}>
          Importeren
        </Button>
      </form>
      <Divider />
      <Title className="window-title">Database resetten</Title>
      <form>
        <Button
          className="window-button"
          type="primary"
          onClick={handleReset}
          danger
        >
          Reset
        </Button>
      </form>
      {fetching ? <LoadingSpinner /> : ""}
      {
        //error ? <Alert message={error} type="error" showIcon /> : ""}
      }
    </div>
  );
};

export default ImportProducts;
