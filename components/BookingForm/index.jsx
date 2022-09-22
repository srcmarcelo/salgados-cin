/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Button, InputNumber, Modal, Statistic, Table } from 'antd';
import styles from '../../styles/Home.module.css';
import userOrder from '../../mocks/userOrder.json';
import firebase from '../../firebase/clientApp';
import {
  collection,
  getDoc,
  updateDoc,
  doc,
  setDoc,
  getFirestore,
  onSnapshot,
} from 'firebase/firestore';
import { BookingButton, ButtonsContainer, FormContainer } from './styles';

export default function BookingForm() {
  const [didRetry, setDidRetry] = useState(false);
  const [confirmModalVisible, setConfirmModalVisible] = useState(false);
  const [order, setOrder] = useState([]);
  const [totalOrder, setTotalOrder] = useState(0);
  const db = getFirestore(firebase);

  const { Column } = Table;

  useEffect(() => {
    getAvailabes();
  }, []);

  useEffect(() => {
    let total = 0;
    order.forEach((item) => (total += parseInt(item.value)));
    setTotalOrder(total);
  }, [order, didRetry]);

  const getAvailabes = async () => {
    const docRef = doc(db, 'salgados', 'disponiveis');
    const docSnap = await getDoc(docRef);
    const availables = docSnap.data().disponiveis;
    availables.forEach((item, index) => (availables[index].value = 0));
    setOrder(availables);
  };

  const handleChangeItem = (item, mode) => {
    const newOrder = order;
    const index = order.findIndex((value) => value.name === item.name);
    newOrder[index].value =
      mode === 'dec'
        ? item.value === 0
          ? item.value
          : item.value - 1
        : item.value + 1;
    setOrder(newOrder);
    setDidRetry(!didRetry);
  };

  const handleOpenModal = () => setConfirmModalVisible(!confirmModalVisible);

  const Form = () => (
    <div style={{ display: 'flex' }}>
      <Table dataSource={order} pagination={false}>
        <Column title='Salgados' dataIndex='name' key='name' />
        <Column
          title='Disponiveis'
          dataIndex='available'
          key='available'
          align='center'
          render={(item) => (
            <div
              style={{
                fontSize: '1.3rem',
              }}
            >
              {item}
            </div>
          )}
        />
        <Column
          title='Seu pedido'
          dataIndex='value'
          key='value'
          align='center'
          render={(item) => (
            <div
              style={{
                backgroundColor: item > 0 && 'orange',
                fontSize: '1.3rem',
              }}
            >
              {item}
            </div>
          )}
        />
        <Column
          title='Remover'
          dataIndex='value'
          key='inputIncButton'
          align='center'
          render={(value, item) => {
            return (
              <Button
                type='primary'
                style={{ backgroundColor: '#7E92B5', borderColor: '#65789B' }}
                onClick={() => handleChangeItem(item, 'dec')}
              >
                -
              </Button>
            );
          }}
        />
        <Column
          title='Adicionar'
          dataIndex='value'
          key='inputDecButton'
          align='center'
          render={(value, item) => {
            return (
              <Button type='primary' onClick={() => handleChangeItem(item)}>
                +
              </Button>
            );
          }}
        />
      </Table>
    </div>
  );

  const Footer = () => (
    <div
      style={{
        display: 'flex',
        margin: '20px',
        width: '100%',
        justifyContent: 'space-around',
        alignItems: 'center',
      }}
    >
      <Statistic
        title='Pedido'
        value={totalOrder}
        suffix='salgados'
        valueStyle={{ fontSize: '1.2rem' }}
      />
      <Statistic
        title='Preço'
        value={totalOrder * 3}
        prefix='R$'
        precision={2}
        valueStyle={{ fontSize: '1.2rem' }}
      />
      <Button type='primary' onClick={handleOpenModal}>
        Confirmar
      </Button>
    </div>
  );

  const ModalConfirm = () => {
    let sendOrder = [];
    return (
      <Modal
        visible={confirmModalVisible}
        title='Revise os itens do seu pedido'
        okText='Confirmar'
        cancelText='Cancelar'
        onCancel={handleOpenModal}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          {order.map((item, index) => {
            sendOrder.push({item: item.name, value: item.value})
            if (item.value > 0)
              return (
                <div
                  key={item.name + index}
                  style={{ fontSize: '1.3rem' }}
                >{`${item.value} ${item.name}`}</div>
              );
          })}
        </div>
        <div
          style={{
            display: 'flex',
            marginTop: '20px',
            width: '100%',
            justifyContent: 'space-between',
          }}
        >
          <Statistic
            title='Quantidade'
            value={totalOrder}
            suffix='salgados'
            valueStyle={{ fontSize: '1.2rem' }}
          />
          <Statistic
            title='Valor'
            value={totalOrder * 3}
            prefix='R$'
            precision={2}
            valueStyle={{ fontSize: '1.2rem' }}
          />
        </div>
      </Modal>
    );
  };

  return (
    <FormContainer>
      <ModalConfirm />
      <div style={{ maxWidth: '800px' }}>
        <p className={styles.description}>
          Selecione a quantidade de cada salgado que quer e clique em confirmar
          para concluir o pedido!
        </p>
      </div>
      <Form didRetry={didRetry} />
      <Footer />
    </FormContainer>
  );
}
