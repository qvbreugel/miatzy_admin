import React from "react";

const Currency = props => {
  return <h2>Totaalbedrag: &euro;{props.children.toFixed(2)}</h2>;
};

export default Currency;
