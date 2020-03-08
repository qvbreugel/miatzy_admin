import React, { useState } from "react";
import Navigation from "../../Components/Navigation";
import Receive from "../Receive/Receive";
import Sell from "../Sell/Sell";
import Pay from "../Pay/Pay";
import Scan from "../Scan/Scan";
import EditPrice from "../EditPrice/EditPrice";
import Earnings from "../Earnings/Earnings";
import AllProducts from "../AllProducts/AllProducts";
import CardTotal from "../CardTotal/CardTotal";
import ImportProducts from "../ImportProducts/ImportProducts";

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
    case "pr_all":
      activeWindow = <AllProducts />;
      break;
    case "in_sls":
      activeWindow = <Earnings />;
      break;
    case "in_cto":
      activeWindow = <CardTotal />;
      break;
    case "se_imp":
      activeWindow = <ImportProducts />;
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
