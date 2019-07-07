import React from "react";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="Middle">
      <Link to="/receive">
        <h1>Receive</h1>
      </Link>
      <Link to="/sell">
        <h1>Sell</h1>
      </Link>
      <Link to="/pay">
        <h1>Pay</h1>
      </Link>
    </div>
  );
};

export default Home;
