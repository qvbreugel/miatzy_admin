import React from "react";

//Ant Design
import { Input, Select } from "antd";

const InputGroup = Input.Group;
const { Option } = Select;

const DynamicInputs = props => {
  return props.items.map((item, index) => {
    let itemId = `item-${index}`;

    let receiveOptions = (
      <Select
        defaultValue="01"
        onChange={props.onSelectChange}
        style={{ width: "15%", textAlign: "center" }}
      >
        <Option value="01" id={index}>
          Geen bijzonderheden
        </Option>
        <Option value="11" id={index}>
          Bootleg
        </Option>
        <Option value="21" id={index}>
          Donatie
        </Option>
        <Option value="03" id={index}>
          Ongeschikt
        </Option>
      </Select>
    );
    return (
      <div key={index}>
        <InputGroup compact>
          {/*<label htmlFor={itemId}>{`Item #${index + 1}`}</label>*/}
          <Input
            style={{ width: "30%", textAlign: "left" }}
            type="text"
            name={itemId}
            data-id={index}
            id={itemId}
            value={
              props.receive ? props.items[index]["barcode"] : props.items[index]
            }
            onChange={props.onInputChange}
            onKeyPress={props.onKeyPress}
            autoFocus
            autoComplete="off"
          />
          {props.receive ? receiveOptions : ""}
        </InputGroup>
      </div>
    );
  });
};

export default DynamicInputs;
