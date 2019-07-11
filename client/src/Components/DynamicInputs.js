import React from "react";

//Ant Design
import { Input, Select } from "antd";

const InputGroup = Input.Group;
const { Option } = Select;

const DynamicInputs = props => {
  return props.items.map((item, index) => {
    let itemId = `item-${index}`;
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
            value={props.items[index]["barcode"]}
            onChange={props.onInputChange}
            onKeyPress={props.onKeyPress}
            autoFocus
          />
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
        </InputGroup>
      </div>
    );
  });
};

export default DynamicInputs;
