import React from 'react';
import { Modal } from 'antd';

export default function OrderModal(props) {
  const { isVisible, openModal } = props;
  console.log('opa', isVisible);

  return (
    <Modal
      title='Fazer Encomenda'
      visible={isVisible}
      onOk={openModal}
      onCancel={openModal}
    >
      <p>Lista aqui...</p>
    </Modal>
  );
}
