import React, { useState } from "react";
import Navigation from "../../Components/Navigation";
import Receive from "../Receive/Receive";
import Sell from "../Sell/Sell";
import Pay from "../Pay/Pay";

//Pages

const Home = () => {
  const [window, setWindow] = useState("ac_rec");

  const clickHandler = event => {
    setWindow(event.key);
  };

  let activeWindow = <Receive />;

  switch (window) {
    case "ac_rec":
      activeWindow = <Receive />;
      break;
    case "ac_sll":
      activeWindow = <Sell />;
      break;
    case "ac_pay":
      activeWindow = <Pay />;
      break;
    default:
      activeWindow = <Receive />;
      break;
  }

  return (
    <div className="grid-container">
      <Navigation onClick={clickHandler} />
      {activeWindow}
    </div>
  );
};

export default Home;
