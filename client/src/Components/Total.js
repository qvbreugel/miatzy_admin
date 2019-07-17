import React from "react";

const Total = props => {
  const setConfirmLoading = props.setConfirmLoading;
  const setVisible = props.setVisible;
  return (
    <div>
      <Modal
        title="Title"
        visible={props.visible}
        onOk={props.onOk}
        confirmLoading={props.confirmLoading}
        onCancel={this.handleCancel}
      >
        <p>{ModalText}</p>
      </Modal>
    </div>
  );
};

export default Total;
