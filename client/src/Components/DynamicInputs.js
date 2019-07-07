import React from "react";

const DynamicInputs = props => {
  return props.items.map((item, index) => {
    let itemId = `item-${index}`;
    return (
      <div key={index}>
        <label htmlFor={itemId}>{`Item #${index + 1}`}</label>
        <input
          type="text"
          name={itemId}
          data-id={index}
          id={itemId}
          value={props.items[index]}
          onChange={props.onChange}
          onKeyPress={props.onKeyPress}
          autoFocus
        />
      </div>
    );
  });
};

export default DynamicInputs;
