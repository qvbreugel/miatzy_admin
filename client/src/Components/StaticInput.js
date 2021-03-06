import React from "react";

import { Input } from "antd";

const StaticInput = props => {
  return (
    <div style={{ width: "100%" }}>
      <Input
        style={{ width: "30%", textAlign: "left" }}
        type="text"
        value={props.value}
        onChange={props.onChange}
        onKeyPress={props.onKeyPress}
        name={props.name}
        autoFocus={props.autoFocus}
        placeholder={props.placeHolder}
        autoComplete="off"
      />
    </div>
  );
};

export default StaticInput;
