import React from "react";

//Ant Design
import { Input, Radio } from "antd";

const InputGroup = Input.Group;

const DynamicInputs = props => {
  const onChange = event => {
    console.log(event.target.value);
  };

  return props.items.map((item, index) => {
    let itemId = `item-${index}`;
    return (
      <div key={index}>
        <InputGroup compact>
          {/*<label htmlFor={itemId}>{`Item #${index + 1}`}</label>*/}
          <Input
            style={{ width: "25%" }}
            type="text"
            name={itemId}
            data-id={index}
            id={itemId}
            value={props.items[index]}
            onChange={props.onChange}
            onKeyPress={props.onKeyPress}
            autoFocus
          />
          <Radio.Group
            onChange={onChange}
            defaultValue="a"
            style={{ width: "25%" }}
          >
            <Radio.Button value="a">Bootleg</Radio.Button>
            <Radio.Button value="b">Donatie</Radio.Button>
            <Radio.Button value="c">Ongeschikt</Radio.Button>
          </Radio.Group>
        </InputGroup>
      </div>
    );
  });
};

export default DynamicInputs;
