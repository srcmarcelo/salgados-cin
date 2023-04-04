/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import {
  CheckCircleOutlined,
  MinusCircleOutlined,
  PlusCircleOutlined,
} from '@ant-design/icons';
import { useRouter } from 'next/router';
import {
  Button,
  Card,
  Input,
  Modal,
  Radio,
  Space,
  Spin,
  Statistic,
  Table,
} from 'antd';
import styles from '../../styles/Home.module.css';
import firebase from '../../firebase/clientApp';
import { getDoc, updateDoc, doc, getFirestore } from 'firebase/firestore';
import {
  ActionButton,
  FooterContainer,
  FormContainer,
  ModalConfirmContent,
  ModalConfirmStatisticContainer,
} from './styles';
import ExtraAlert from '../ExtraAlert';

export default function BookingForm() {
  const db = getFirestore(firebase);
  const router = useRouter();

  const [didRetry, setDidRetry] = useState(false);
  const [confirmModalVisible, setConfirmModalVisible] = useState(false);
  const [userModalVisible, setUserModalVisible] = useState(false);
  const [order, setOrder] = useState([]);
  const [modes, setModes] = useState([]);
  const [totalOrder, setTotalOrder] = useState(0);
  const [totalPizzaOrder, setTotalPizzaOrder] = useState(0);
  const [userData, setUserData] = useState({});
  const [mode, setMode] = useState(0);
  const [time, setTime] = useState(0);
  const [enabled, setEnabled] = useState(true);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  const docs = ['disponiveis', 'backup'];

  const { Column } = Table;

  useEffect(() => {
    getAvailabes();
  }, [mode]);

  useEffect(() => {
    getTime();
  }, []);

  useEffect(() => {
    let total = 0;
    let pizzas = 0;
    order.forEach((item) => {
      if (item.type === 'pizza') pizzas += parseInt(item.value);
      else total += parseInt(item.value);
    });
    setTotalOrder(total);
    setTotalPizzaOrder(pizzas);
  }, [order, didRetry]);

  const getTime = async () => {
    const docRef = doc(db, 'salgados', 'reservas');
    const docSnap = await getDoc(docRef);
    setEnabled(docSnap.data().enabled);
    setModes(docSnap.data().times);
    setMode(docSnap.data().time);
    setTime(docSnap.data().time);
    setLoading(false);
  };

  const getAvailabes = async () => {
    const docRef = doc(
      db,
      'salgados',
      time > 0 ? docs[0] : docs[mode > 0 ? 1 : 0]
    );
    const docRef2 = doc(db, 'salgados', 'refrigerantes');
    const docSnap = await getDoc(docRef);
    const docSnap2 = await getDoc(docRef2);
    const pizzas = docSnap2
      .data()
      .disponiveis.filter((item) => item.type === 'pizza');
    const availables = [...pizzas, ...docSnap.data().disponiveis];
    availables.forEach((item, index) => (availables[index].value = 0));
    setOrder(availables);
  };

  const updateAvailabes = async () => {
    const docRef = doc(
      db,
      'salgados',
      time > 0 ? docs[0] : docs[mode > 0 ? 1 : 0]
    );
    const docRef2 = doc(db, 'salgados', 'refrigerantes');
    const docSnap = await getDoc(docRef);
    const docSnap2 = await getDoc(docRef2);
    const pizzas = docSnap2
      .data()
      .disponiveis.filter((item) => item.type === 'pizza');
    const availables = [...pizzas, ...docSnap.data().disponiveis];
    order.forEach(
      (item, index) => (availables[index].value = order[index].value)
    );
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

  const handleOpenModal = () => {
    if (Boolean(userData.name)) setConfirmModalVisible(!confirmModalVisible);
  };

  const handleOpenUserModal = () => {
    setConfirmModalVisible(false);
    enabled
      ? setUserModalVisible(!userModalVisible)
      : Modal.error({
          title: (
            <p style={{ fontWeight: 'bold', margin: 0 }}>
              Reservas momentaneamente desativadas
            </p>
          ),
          content:
            'O fluxo de pessoas presencialmente neste momento está muito alto! Isso ocorre geralmente entre 09:30 e 10:30. Venha você também comprar presencialmente ou espere o fluxo abaixar um pouco para fazer sua reserva!',
        });
  };

  const onChangeUserData = (e) => {
    const newUserData = userData;
    newUserData.name = e.target.value;
    setUserData(newUserData);
  };

  const handleSubmitOrder = async (sendOrder) => {
    const docRef = doc(db, 'salgados', 'reservas');
    const docSnap = await getDoc(docRef);
    const orders = docSnap.data().booking;

    const newOrder = {
      id: orders.length,
      name: userData.name,
      order: sendOrder,
      price: `R$ ${totalOrder * 3 + totalPizzaOrder * 5},00`,
      status: 0,
      time: mode,
    };
    orders.push(newOrder);

    try {
      await updateDoc(docRef, {
        booking: orders,
        lastUpdated: 'number',
      });

      Modal.confirm({
        content: (
          <div>
            <h3>Pedido enviado com sucesso!</h3>
            <div style={{ fontSize: '0.8rem' }}>
              Favor comparecer dentro do prazo. Caso precise atrasar um pouco ou
              queira cancelar o pedido, clique no botão abaixo para entrar no
              grupo do whatsapp e entrar em contato com Marcelinho(administrador
              do grupo).
            </div>
            <Button
              type='primary'
              style={{
                backgroundColor: '#34af23',
                borderColor: '#34af23',
                fontSize: '0.8rem',
                margin: '8px 0px',
              }}
              href='https://chat.whatsapp.com/IBnR0TXPM0e8zO59dcHsHI'
            >
              Grupo do WhatSapp
            </Button>
          </div>
        ),
        icon: <CheckCircleOutlined style={{ color: 'green' }} />,
        onCancel: () => router.push('/reservar/status'),
        onOk: getAvailabes,
        okText: 'Fazer outra reserva',
        cancelText: 'Acompanhar status',
      });
      handleOpenUserModal();
    } catch (error) {
      Modal.error({
        content:
          'Algo deu errado ao fazer a reserva. Por favor, tente novamente. Caso o erro persista, fale com Marcelinho no pelo Whatsapp (87) 98817-5129.',
      });
    }
    setSending(false);
  };

  const BookingTimeCard = () => (
    <Card
      size='small'
      title={'Defina o horário de retirada'}
      style={{
        width: 250,
      }}
    >
      <Radio.Group
        onChange={(e) => setMode(e.target.value)}
        value={mode}
        style={{ display: 'flex', justifyContent: 'center' }}
      >
        <Space direction='vertical'>
          {modes.map(({ label }, index) => (
            <Radio key={`radio_${index}`} value={index} disabled={index < time}>
              {label}
            </Radio>
          ))}
        </Space>
      </Radio.Group>
    </Card>
  );

  const DisabledBookingCard = () => (
    <Card
      size='small'
      title={
        <p style={{ color: 'red', fontWeight: 'bold', margin: 0 }}>
          Reservas momentaneamente desativadas
        </p>
      }
      style={{ width: 350 }}
    >
      <div>
        O fluxo de pessoas presencialmente neste momento está muito alto! Venha
        você também comprar presencialmente ou espere o fluxo abaixar um pouco
        para fazer sua reserva!
      </div>
    </Card>
  );

  const Controls = () => (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        margin: 20,
      }}
    >
      {loading ? (
        <Spin />
      ) : (
        <>
          {enabled ? <BookingTimeCard /> : <DisabledBookingCard />}
          <Button type='primary' onClick={updateAvailabes}>
            Atualizar Disponíveis
          </Button>
        </>
      )}
    </div>
  );

  const Form = () => (
    <div style={{ display: 'flex' }}>
      <Table dataSource={order} pagination={false}>
        <Column title='Salgados' width={110} dataIndex='name' key='name' />
        <Column
          title='Disponiveis'
          ellipsis={true}
          width={100}
          dataIndex='available'
          key='available'
          align='center'
          render={(item) => (
            <div
              style={{
                fontSize: '1.2rem',
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
          width={75}
          align='center'
          render={(item, obj) => (
            <div
              style={{
                backgroundColor: item > 0 && 'orange',
                fontSize: '1.2rem',
              }}
            >
              {item}
            </div>
          )}
        />
        <Column
          dataIndex='value'
          key='inputIncButton'
          title={
            <div
              style={{
                fontSize: 12,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              Remover / Adicionar
            </div>
          }
          width={70}
          align='center'
          render={(value, item) => {
            return (
              <div style={{ display: 'flex', justifyContent: 'center' }}>
                <ActionButton
                  type='primary'
                  onClick={() => handleChangeItem(item, 'dec')}
                >
                  <MinusCircleOutlined />
                </ActionButton>
                <ActionButton
                  type='primary'
                  disabled={value === item.available}
                  onClick={() => handleChangeItem(item)}
                  plus={true}
                >
                  <PlusCircleOutlined />
                </ActionButton>
              </div>
            );
          }}
        />
      </Table>
    </div>
  );

  const StatisticSection = () => (
    <div style={{ width: '50%' }}>
      <div
        style={{
          display: 'flex',
          width: '100%',
          justifyContent: 'space-between',
          margin: '10px 0px 5px 0px',
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
      <div
        style={{
          display: 'flex',
          width: '100%',
          justifyContent: 'space-between',
          marginBottom: '15px',
        }}
      >
        <Statistic
          title='Quantidade'
          value={totalPizzaOrder}
          suffix='pizzas'
          valueStyle={{ fontSize: '1.2rem' }}
        />
        <Statistic
          title='Valor'
          value={totalPizzaOrder * 5}
          prefix='R$'
          precision={2}
          valueStyle={{ fontSize: '1.2rem' }}
        />
      </div>
      <div
        style={{
          display: 'flex',
          width: '100%',
          justifyContent: 'space-between',
        }}
      >
        <Statistic
          title='Quantidade'
          value={totalOrder + totalPizzaOrder}
          suffix='items'
          valueStyle={{ fontSize: '1.2rem' }}
        />
        <Statistic
          title='Valor total'
          value={totalOrder * 3 + totalPizzaOrder * 5}
          prefix='R$'
          precision={2}
          valueStyle={{ fontSize: '1.5rem' }}
        />
      </div>
    </div>
  );

  const Footer = () => (
    <FooterContainer>
      <StatisticSection />
      <Button
        type='primary'
        onClick={handleOpenUserModal}
        disabled={totalOrder < 1}
      >
        Confirmar
      </Button>
    </FooterContainer>
  );

  const UserModal = () => {
    return (
      <Modal
        visible={userModalVisible}
        title='Escreva aqui como te identificar!'
        okText='Continuar'
        cancelText='Cancelar'
        onOk={handleOpenModal}
        onCancel={handleOpenUserModal}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            Digite aqui seu nome:
            <Input
              style={{ flex: 1, margin: 10 }}
              onChange={onChangeUserData}
              onPressEnter={handleOpenModal}
            />
          </div>
        </div>
      </Modal>
    );
  };

  const ModalConfirm = () => {
    let sendOrder = [];
    return (
      <Modal
        visible={confirmModalVisible}
        title='Revise os itens do seu pedido'
        okText='Confirmar'
        confirmLoading={sending}
        cancelText='Cancelar'
        onOk={() => {
          setSending(true), handleSubmitOrder(sendOrder);
        }}
        onCancel={handleOpenUserModal}
      >
        <div style={{ fontSize: '1.2rem' }}>
          Pedido de <strong>{userData.name}</strong>
        </div>
        <div style={{ fontSize: '1rem' }}>{modes[mode]?.label}</div>
        <ModalConfirmContent>
          {order.map((item, index) => {
            const rightIndex = item.name.includes('Pizza') ? index + 1 : index - 3;
            if (item.value > 0) {
              sendOrder.push({
                item: item.name,
                value: item.value,
                index: rightIndex,
              });
              return (
                <div
                  key={`${item.name}_${rightIndex}`}
                  style={{ fontSize: '1.2rem' }}
                >{`${item.value} ${item.name}`}</div>
              );
            }
          })}
        </ModalConfirmContent>
        <ModalConfirmStatisticContainer>
          <StatisticSection />
        </ModalConfirmStatisticContainer>
      </Modal>
    );
  };

  return (
    <FormContainer>
      <UserModal />
      <ModalConfirm />
      <div style={{ maxWidth: '800px' }}>
        <p
          className={styles.description}
          style={{ marginBottom: 0, fontSize: '1.3rem' }}
        >
          Selecione a quantidade de cada salgado que quer e clique em confirmar
          para concluir o pedido!
        </p>
      </div>
      <Controls />
      <ExtraAlert
        title={
          <p style={{ color: 'green', margin: 0 }}>
            RESERVAS DE PIZZAS LIBERADAS!
          </p>
        }
        content={
          <div
            style={{
              textAlign: 'center',
            }}
          >
            Agora você pode reservar também pizzas dos seus sabores favoritos!
          </div>
        }
      />
      <Form didRetry={didRetry} />
      <Footer />
    </FormContainer>
  );
}
