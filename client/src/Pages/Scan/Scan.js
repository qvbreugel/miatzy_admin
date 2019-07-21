import React, { useState } from "react";

//Ant Design
import { Alert, Button, Descriptions, Typography } from "antd";
import StaticInput from "./../../Components/StaticInput";
import LoadingSpinner from "./../../Components/LoadingSpinner";
const { Title } = Typography;

const Scan = () => {
  //State Management
  const [item, setItem] = useState("");
  const [fetching, setFetching] = useState(false);
  const [isScanned, setIsScanned] = useState(false);
  const [scannedProduct, setScannedProduct] = useState({});
  const [error, setError] = useState("");

  let scannedProductInfo;
  let scannedSoldProductInfo;
  let productStatus = "";
  let productType = "";

  const handleSubmit = event => {
    event.preventDefault();
    setFetching(true);

    const [ticketNumber, product_id] = item.split(".");

    if (product_id === undefined) {
      setFetching(false);
      setError("Product bevat geen product id, voeg het product id toe");
    } else {
      setError("");
      const data = {
        ticketNumber,
        product_id
      };

      fetch("/scan", {
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
          if (data["productScanned"]) {
            setScannedProduct(data["product"]);
            setIsScanned(true);
            setFetching(false);
          } else if (!data["productScanned"]) {
            setError(data["error"]);
            setFetching(false);
          }
        });
    }
  };

  if (isScanned) {
    if (scannedProduct["status"] < 10) {
      productType = "Product";
      switch (scannedProduct["status"]) {
        case 1:
          productStatus = "Ontvangen";
          break;
        case 2:
          productStatus = "Verkocht";
          break;
        case 3:
          productStatus = "Geweigerd";
          break;
        case 0:
          productStatus = "Aangemaakt";
          break;
        default:
          productStatus = "Onbekend";
          break;
      }
    } else if (scannedProduct["status"] < 20) {
      productType = "Bootleg";
      switch (scannedProduct["status"]) {
        case 11:
          productStatus = "Ontvangen";
          break;
        case 12:
          productStatus = "Verkocht";
          break;
        case 0:
          productStatus = "Aangemaakt";
          break;
        default:
          productStatus = "Onbekend";
          break;
      }
    } else if (scannedProduct["status"] < 30) {
      productType = "Donatie";
      switch (scannedProduct["status"]) {
        case 21:
          productStatus = "Ontvangen";
          break;
        case 22:
          productStatus = "Verkocht";
          break;
        case 0:
          productStatus = "Aangemaakt";
          break;
        default:
          productStatus = "Onbekend";
          break;
      }
    }

    scannedSoldProductInfo = (
      <Descriptions title="Product" bordered>
        <Descriptions.Item label="Naam" span={1}>
          {scannedProduct["name"]}
        </Descriptions.Item>
        <Descriptions.Item label="Prijs" span={1}>
          &euro;{scannedProduct["price"].toFixed(2)}
        </Descriptions.Item>

        <Descriptions.Item label="Soort">{productType}</Descriptions.Item>
        <Descriptions.Item label="Status">{productStatus}</Descriptions.Item>
        <Descriptions.Item label="Categorie">
          {scannedProduct["category"]}
        </Descriptions.Item>
        <Descriptions.Item label="Verkoopdatum">
          {scannedProduct["date"].split("T")[0]}
        </Descriptions.Item>
        <Descriptions.Item label="Verkooptijd">
          {scannedProduct["time"]}
        </Descriptions.Item>
      </Descriptions>
    );

    scannedProductInfo = (
      <Descriptions title="Product" bordered>
        <Descriptions.Item label="Naam" span={1}>
          {scannedProduct["name"]}
        </Descriptions.Item>
        <Descriptions.Item label="Prijs" span={1}>
          &euro;{scannedProduct["price"].toFixed(2)}
        </Descriptions.Item>

        <Descriptions.Item label="Soort">{productType}</Descriptions.Item>
        <Descriptions.Item label="Status">{productStatus}</Descriptions.Item>
        <Descriptions.Item label="Categorie">
          {scannedProduct["category"]}
        </Descriptions.Item>
      </Descriptions>
    );
  }

  const onChange = event => {
    setItem(event.target.value);
  };

  const keyPressHandler = event => {
    if (event.key === "Enter") {
      event.preventDefault();
      handleSubmit(event);
    }
  };

  return (
    <div className="Window">
      <Title className="window-title">Scan Product</Title>
      <form method="POST">
        <StaticInput
          onChange={onChange}
          value={item}
          name="item"
          onKeyPress={keyPressHandler}
          autoFocus
        />
        <Button className="window-button" type="primary" onClick={handleSubmit}>
          Product Bekijken
        </Button>
      </form>
      {fetching ? <LoadingSpinner /> : ""}
      {error ? <Alert message={error} type="error" showIcon /> : ""}
      {productStatus === "Verkocht"
        ? scannedSoldProductInfo
        : scannedProductInfo}
    </div>
  );
};

export default Scan;
