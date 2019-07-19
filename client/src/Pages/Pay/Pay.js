import React, { useState, useEffect } from "react";

//Ant Design
import { Alert, Typography } from "antd";

//Components
import StaticInput from "./../../Components/StaticInput";
import PayModal from "../../Components/Modals/PayModal";
import GetTotalToPayButton from "../../Components/Buttons/GetTotalToPayButton";
import ActionComplete from "./../../Components/ActionComplete";
import LoadingSpinner from "./../../Components/LoadingSpinner";
const { Title } = Typography;

const Pay = () => {
  //State Management
  const [ticketNumber, setTicketNumber] = useState("");
  const [unsold, setUnsold] = useState([]);
  const [amountDue, setAmountDue] = useState(0);
  const [visible, setVisible] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [userPaid, setUserPaid] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setTicketNumber("");
  }, [userPaid]);

  const onChange = event => {
    setTicketNumber(event.target.value);
  };

  const clickHandler = () => {
    setUserPaid(false);
  };

  let content = (
    <div>
      <Title className="window-title">Uitbetalen</Title>
      <form method="POST">
        <StaticInput
          onChange={onChange}
          value={ticketNumber}
          name="ticketNumber"
        />
        <GetTotalToPayButton
          setFetching={setFetching}
          setVisible={setVisible}
          setAmountDue={setAmountDue}
          setUnsold={setUnsold}
          ticketNumber={ticketNumber}
          setError={setError}
        />
      </form>
      <PayModal
        visible={visible}
        setVisible={setVisible}
        unsold={unsold}
        amountDue={amountDue}
        ticketNumber={ticketNumber}
        setUserPaid={setUserPaid}
      />
      {fetching ? <LoadingSpinner /> : ""}
      {error ? <Alert message={error} type="error" showIcon /> : ""}
    </div>
  );

  if (userPaid) {
    content = (
      <ActionComplete
        title="De gebruiker is succesvol betaald"
        subTitle="Overhandig het geld"
        buttonText="Betaal nog een gebruiker"
        onClick={clickHandler}
      />
    );
  }

  return <div className="Window">{content}</div>;
};

export default Pay;
