/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import { Button, List, Modal } from 'antd';
import firebase from '../../firebase/clientApp';
import { doc, getFirestore, getDoc, updateDoc } from 'firebase/firestore';
import _ from 'lodash';

export default function BookingList({ control }) {
  const db = getFirestore(firebase);

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  const statuses = [
    'Pendente',
    'Visto',
    'Reservado',
    'Finalizado',
    'Cancelado',
  ];

  const statusColor = ['orange', 'blue', 'green', '#092b00', 'red'];

  const getList = async () => {
    setLoading(true);
    const docRef = doc(db, 'salgados', 'reservas');
    const docSnap = await getDoc(docRef);
    const reverseOrders = docSnap.data().booking;
    _.reverse(reverseOrders)
    setOrders(reverseOrders);
    setLoading(false);
  };

  const updateStatus = async (item, cancel) => {
    const bookingRef = doc(db, 'salgados', 'reservas');
    const docSnap = await getDoc(bookingRef);
    const newOrders = docSnap.data().booking;
    if (item.status < 4)
      newOrders[item.id].status = cancel ? 4 : item.status + 1;
    else newOrders[item.id].status = 0;

    await updateDoc(bookingRef, {
      booking: newOrders,
    });
    getList();
  };

  const resetOrders = async () => {
    const bookingRef = doc(db, 'salgados', 'reservas');

    await updateDoc(bookingRef, {
      booking: [],
    });
    getList();
  };

  const handleResetOrders = () => (
    Modal.confirm({
      content: 'Deseja realmente zerar as reservas?',
      onOk: resetOrders
    })
  )

  useEffect(() => {
    getList();
  }, []);

  const ControlButtons = ({ item }) => (
    <div>
      <Button onClick={() => updateStatus(item, true)}>Cancelar</Button>
      <Button type='primary' onClick={() => updateStatus(item)}>
        Avançar
      </Button>
    </div>
  );

  const RenderList = ({ title, data, key }) => (
    <div
      key={key}
      style={{
        maxHeight: 500,
        overflow: 'auto',
        padding: '0 14px',
        border: '1px solid rgba(140, 140, 140, 0.35)',
        margin: '30px 0px',
        width: '100%',
      }}
    >
      <List
        itemLayout='horizontal'
        header={
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <strong>{title}</strong>
            <p style={{color: 'grey'}}>status</p>
          </div>
        }
        dataSource={data}
        loading={loading}
        renderItem={(item) => {
          const items = item.order.map((e, index) =>
            index > 0 ? `- ${e.value}x ${e.item} ` : `${e.value}x ${e.item} `
          );
          return (
            <List.Item
              actions={
                control
                  ? [<ControlButtons key={item.id} item={item} />]
                  : [
                      <p
                        key='status'
                        style={{ color: statusColor[item.status] }}
                      >
                        {statuses[item.status]}
                      </p>,
                    ]
              }
            >
              <List.Item.Meta title={item.name} description={items} />
              {control && (
                <p key='status' style={{ color: statusColor[item.status] }}>
                  {statuses[item.status]}
                </p>
              )}
            </List.Item>
          );
        }}
      />
    </div>
  );

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Button type='primary' onClick={getList} style={{ width: 200 }}>
        Atualizar
      </Button>
      {control && (
        <Button
          type='primary'
          onClick={handleResetOrders}
          style={{
            width: 200,
            backgroundColor: 'darkred',
            borderColor: 'darkred',
          }}
        >
          Zerar
        </Button>
      )}
      <RenderList
        title='Reservas da manhã (entre 10:00 e 12:00)'
        data={orders.filter((order) => order.time === 0)}
        key={0}
      />
      <RenderList
        title='Reservas da tarde (entre 14:00 e 17:30)'
        data={orders.filter((order) => order.time === 1)}
        key={1}
      />
    </div>
  );
}
