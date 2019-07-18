import React from "react";

/*Does not Work */

//Ant Design
import { Alert } from "antd";

const Errors = props => {
  //Props Destructuring
  const { errors } = props;

  if (!errors.length) {
    return null;
  }

  errors.map((error, errorIndex) => {
    return (
      <Alert
        key={errorIndex}
        message={error["message"]}
        type="error"
        showIcon
      />
    );
  });
};

export default Errors;
