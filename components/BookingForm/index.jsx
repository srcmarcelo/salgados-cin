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
import Link from 'next/link';

export default function BookingForm() {
  const db = getFirestore(firebase);
  const router = useRouter();

  const [didRetry, setDidRetry] = useState(false);
  const [confirmModalVisible, setConfirmModalVisible] = useState(false);
  const [userModalVisible, setUserModalVisible] = useState(false);
  const [order, setOrder] = useState([]);
  const [totalOrder, setTotalOrder] = useState(0);
  const [userData, setUserData] = useState({});
  const [afternoon, setAfternoon] = useState(false);
  const [special, setSpecial] = useState({});
  const [mode, setMode] = useState(0);
  const [loading, setLoading] = useState(true);

  const modes = ['Manhã (entre 10:00 e 12:00)', 'Tarde (entre 14:00 e 17:30)'];
  const docs = ['disponiveis', 'backup'];

  const { Column } = Table;

  useEffect(() => {
    getAvailabes();
  }, [mode]);

  useEffect(() => {
    getAfternoon();
  }, []);

  useEffect(() => {
    let total = 0;
    order.forEach((item) => (total += parseInt(item.value)));
    setTotalOrder(total);
  }, [order, didRetry]);

  const getAfternoon = async () => {
    const docRef = doc(db, 'salgados', 'reservas');
    const docSnap = await getDoc(docRef);
    if (docSnap.data().afternoon) setMode(1);
    setAfternoon(docSnap.data().afternoon);
    setSpecial(docSnap.data().special);
    setLoading(false);
  };

  const getAvailabes = async () => {
    const docRef = doc(db, 'salgados', afternoon ? docs[0] : docs[mode]);
    const docSnap = await getDoc(docRef);
    const availables = docSnap.data().disponiveis;
    availables.forEach((item, index) => (availables[index].value = 0));
    setOrder(availables);
  };

  const updateAvailabes = async () => {
    const docRef = doc(db, 'salgados', afternoon ? docs[0] : docs[mode]);
    const docSnap = await getDoc(docRef);
    const availables = docSnap.data().disponiveis;
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

  const handleOpenModal = () => setConfirmModalVisible(!confirmModalVisible);

  const handleOpenUserModal = () => {
    setConfirmModalVisible(false), setUserModalVisible(!userModalVisible);
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
      price: `R$ ${totalOrder * 3},00`,
      status: 0,
      time: mode,
    };
    orders.push(newOrder);

    try {
      await updateDoc(docRef, {
        booking: orders,
      });

      Modal.confirm({
        content: 'Pedido enviado com sucesso!',
        icon: <CheckCircleOutlined style={{ color: 'green' }} />,
        onCancel: () => router.push('/reservar/status'),
        onOk: getAvailabes,
        okText: 'Fazer outra reserva',
        cancelText: 'Acompanhar status',
      });
      handleOpenUserModal();
    } catch (error) {
      Modal.success({
        content:
          'Algo deu errado ao fazer a reserva. Por favor, tente novamente. Caso o erro persista, fale com Marcelinho no pelo Whatsapp (87) 98817-5129.',
      });
    }
  };

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
          <Card
            size='small'
            title={
              special.enabled
                ? 'Hoje as reservas funcionarão em horário especial'
                : 'Defina o horário de retirada'
            }
            style={{
              width: special.enabled ? 350 : 250,
            }}
          >
            <Radio.Group
              onChange={(e) => setMode(e.target.value)}
              value={mode}
              style={{ display: 'flex', justifyContent: 'center' }}
            >
              {special.enabled ? (
                <Radio value={0}>{special.label}</Radio>
              ) : (
                <Space direction='vertical'>
                  <Radio value={0} disabled={afternoon}>
                    {modes[0]}
                  </Radio>
                  <Radio value={1}>{modes[1]}</Radio>
                </Space>
              )}
            </Radio.Group>
          </Card>
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
                <Button
                  type='primary'
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: '#7E92B5',
                    borderColor: '#65789B',
                    width: '12px',
                    height: '30px',
                  }}
                  onClick={() => handleChangeItem(item, 'dec')}
                >
                  <MinusCircleOutlined />
                </Button>
                <Button
                  type='primary'
                  disabled={value === item.available}
                  onClick={() => handleChangeItem(item)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    textAlign: 'center',
                    width: '12px',
                    height: '30px',
                    marginLeft: 5,
                  }}
                >
                  <PlusCircleOutlined />
                </Button>
              </div>
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
      <Button
        type='primary'
        onClick={handleOpenUserModal}
        disabled={totalOrder < 1}
      >
        Confirmar
      </Button>
    </div>
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
        cancelText='Cancelar'
        onOk={() => handleSubmitOrder(sendOrder)}
        onCancel={handleOpenUserModal}
      >
        <div style={{ fontSize: '1.2rem' }}>
          Pedido de <strong>{userData.name}</strong>
        </div>
        <div style={{ fontSize: '1rem' }}>
          {special.enabled ? special.label : modes[mode]}
        </div>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            margin: 20,
          }}
        >
          {order.map((item, index) => {
            if (item.value > 0) {
              sendOrder.push({ item: item.name, value: item.value });
              return (
                <div
                  key={`${item.name}_${index}`}
                  style={{ fontSize: '1.2rem' }}
                >{`${item.value} ${item.name}`}</div>
              );
            }
          })}
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
      <Form didRetry={didRetry} />
      <Footer />
    </FormContainer>
  );
}
