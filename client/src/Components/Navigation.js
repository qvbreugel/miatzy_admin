import React from "react";

//Ant Design
import { Menu } from "antd";

const Navigation = props => {
  return (
    <div className="Navigation">
      <Menu
        onClick={props.onClick}
        defaultSelectedKeys={["ac_rec"]}
        mode="inline"
      >
        <Menu.Divider />
        <Menu.ItemGroup key="pr" title="Producten">
          <Menu.Item key="pr_all">Alle Producten</Menu.Item>
          <Menu.Item key="pr_rec">Ontvangen Producten</Menu.Item>
          <Menu.Item key="pr_sld">Verkochte Produtcen</Menu.Item>
          <Menu.Item key="pr_scn">Scan Product</Menu.Item>
        </Menu.ItemGroup>
        <Menu.ItemGroup key="ac" title="Acties">
          <Menu.Item key="ac_rec">Ontvangen</Menu.Item>
          <Menu.Item key="ac_sll">Verkopen</Menu.Item>
          <Menu.Item key="ac_pay">Betalen</Menu.Item>
        </Menu.ItemGroup>
        <Menu.ItemGroup key="in" title="Inzichten">
          <Menu.Item key="in_sls">Opbrengsten</Menu.Item>
        </Menu.ItemGroup>
        <Menu.Divider />
      </Menu>
    </div>
  );
};

export default Navigation;
