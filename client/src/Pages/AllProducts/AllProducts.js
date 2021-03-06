import React from "react";
import { Table, Input, Button, Icon, Typography } from "antd";
import Highlighter from "react-highlight-words";

const { Title } = Typography;

class AllProducts extends React.Component {
  state = {
    searchText: "",
    data: [],
    loading: true
  };

  statusToString = status => {
    let statusString = "";

    switch (status) {
      case 0:
        statusString = "Aangemaakt";
        break;
      case 10:
        statusString = "Ingenomen";
        break;
      case 20:
        statusString = "Verkocht (Contant)";
        break;
      case 30:
        statusString = "Verkocht (Pinnen)";
        break;
      case 50:
        statusString = "Geweigerd";
        break;
      default:
        statusString = "Onbekend";
        break;
    }

    return statusString;
  };

  componentDidMount() {
    const context = this;
    fetch("/allproducts", {
      method: "GET",
      headers: { "Content-Type": "application/json" }
    })
      .then(function(response) {
        if (response.status >= 400) {
          throw new Error("Bad response from server");
        }
        return response.json();
      })
      .then(function(data) {
        if (data["productsFetched"]) {
          const products = [];
          const oldProducts = [...data["products"]];
          oldProducts.map(product => {
            products.push({
              key: product["id"],
              ticketnumber: `${product["ticketnumber"]}.${product["product_id"]}`,
              name: product["name"],
              category: product["category"],
              status: context.statusToString(product["status"])
            });
          });
          context.setState({ data: products, loading: false });
        }
      });
  }

  getColumnSearchProps = (dataIndex, name) => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters
    }) => (
      <div style={{ padding: 8 }}>
        <Input
          ref={node => {
            this.searchInput = node;
          }}
          placeholder={`Zoek op ${name}`}
          value={selectedKeys[0]}
          onChange={e =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() => this.handleSearch(selectedKeys, confirm)}
          style={{ width: 188, marginBottom: 8, display: "block" }}
        />
        <Button
          type="primary"
          onClick={() => this.handleSearch(selectedKeys, confirm)}
          icon="search"
          size="small"
          style={{ width: 90, marginRight: 8 }}
        >
          Zoek
        </Button>
        <Button
          onClick={() => this.handleReset(clearFilters)}
          size="small"
          style={{ width: 90 }}
        >
          Reset
        </Button>
      </div>
    ),
    filterIcon: filtered => (
      <Icon type="search" style={{ color: filtered ? "#1890ff" : undefined }} />
    ),
    onFilter: (value, record) =>
      record[dataIndex]
        .toString()
        .toLowerCase()
        .includes(value.toLowerCase()),
    onFilterDropdownVisibleChange: visible => {
      if (visible) {
        setTimeout(() => this.searchInput.select());
      }
    },
    render: text => (
      <Highlighter
        highlightStyle={{ backgroundColor: "#ffc069", padding: 0 }}
        searchWords={[this.state.searchText]}
        autoEscape
        textToHighlight={text.toString()}
      />
    )
  });

  handleSearch = (selectedKeys, confirm) => {
    confirm();
    this.setState({ searchText: selectedKeys[0] });
  };

  handleReset = clearFilters => {
    clearFilters();
    this.setState({ searchText: "" });
  };

  render() {
    const columns = [
      {
        title: "Ticketnummer",
        dataIndex: "ticketnumber",
        key: "ticketnumber",
        width: "25%",
        ...this.getColumnSearchProps("ticketnumber", "ticketnummer")
      },
      {
        title: "Naam",
        dataIndex: "name",
        key: "name",
        width: "25%",
        ...this.getColumnSearchProps("name", "naam")
      },
      {
        title: "Categorie",
        dataIndex: "category",
        key: "category",
        width: "25%",
        ...this.getColumnSearchProps("category", "categorie")
      },
      {
        title: "Status",
        dataIndex: "status",
        key: "status",
        width: "25%",
        ...this.getColumnSearchProps("status", "status")
      }
    ];
    return (
      <div className="Window">
        <Title className="window-title">Alle Producten</Title>
        <Table
          columns={columns}
          dataSource={this.state.data}
          loading={this.state.loading}
        />
      </div>
    );
  }
}

export default AllProducts;
