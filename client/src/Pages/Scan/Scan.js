import React, { useState } from "react";

//Ant Design
import { Button, Typography, Modal } from "antd";
import StaticInput from "./../../Components/StaticInput";
const { Title } = Typography;

const Scan = () => {
  const [item, setItem] = useState("");

  const onChange = event => {
    setItem(event.target.value);
  };
  return (
    <div className="Window">
      <Title className="window-title">Scan Product</Title>
      <form method="POST">
        <StaticInput onChange={onChange} value={item} name="item" />
        <Button className="window-button" type="primary">
          Producten Bekijken
        </Button>
      </form>
    </div>
  );
};

export default Scan;
