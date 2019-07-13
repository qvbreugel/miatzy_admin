import React from "react";

import { Button, Result } from "antd";

const ActionComplete = props => {
  return (
    <Result
      status="success"
      title={props.title}
      subTitle={props.subTitle}
      extra={[
        <Button type="primary" onClick={props.onClick} key="restart">
          Verkoop meer producten
        </Button>
      ]}
    />
  );
};

export default ActionComplete;
