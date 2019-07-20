import React, { useState } from "react";
import Navigation from "../../Components/Navigation";
import Receive from "../Receive/Receive";
import Sell from "../Sell/Sell";
import Pay from "../Pay/Pay";
import Scan from "../Scan/Scan";
import EditPrice from "../EditPrice/EditPrice";
import Earnings from "../Earnings/Earnings";

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
    case "pr_scn":
      activeWindow = <Scan />;
      break;
    case "pr_prc":
      activeWindow = <EditPrice />;
      break;
    case "in_sls":
      activeWindow = <Earnings />;
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
