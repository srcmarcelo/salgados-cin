/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import { Button, Card, List, Modal } from 'antd';
import firebase from '../../firebase/clientApp';
import { doc, getFirestore, getDoc, updateDoc } from 'firebase/firestore';
import _ from 'lodash';

export default function BookingList({
  control,
  onConfirm,
  onConfirmPizza,
  onUndo,
}) {
  const db = getFirestore(firebase);

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [times, setTimes] = useState([]);

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
    setTimes(
      docSnap.data().time > 0
        ? docSnap.data().reversedTimes
        : docSnap.data().times
    );
    _.reverse(reverseOrders);
    setOrders(reverseOrders);
    setLoading(false);
  };

  const updateStatus = async (item, cancel) => {
    const bookingRef = doc(db, 'salgados', 'reservas');
    const docSnap = await getDoc(bookingRef);
    const newOrders = docSnap.data().booking;

    if (
      newOrders[item.id].status > 1 &&
      newOrders[item.id].status < 4 &&
      cancel
    ) {
      onUndo(item.order);
    }

    if (item.status < 4)
      newOrders[item.id].status = cancel ? 4 : item.status + 1;
    else {
      newOrders[item.id].status = 0;
    }

    if (newOrders[item.id].status === 2) {
      item.order.forEach((product) => {
        if (product.item.includes('Pizza'))
          onConfirmPizza(product.index, product.value, true);
        else onConfirm(product.index, product.value, true);
      });
    }

    await updateDoc(bookingRef, {
      booking: newOrders,
      lastUpdated: 'status',
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

  const handleResetOrders = () =>
    Modal.confirm({
      content: 'Deseja realmente zerar as reservas?',
      onOk: resetOrders,
    });

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

  const ListItem = ({ title, data, key }) => (
    <div
      key={key}
      style={{
        maxHeight: 500,
        overflow: 'auto',
        padding: '0 14px',
        border: '1px solid rgba(140, 140, 140, 0.35)',
        margin: '30px 0px',
        width: '100%',
        backgroundColor: 'white',
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
            <p style={{ color: 'grey' }}>status</p>
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

  const RenderList = (props) => <ListItem {...props} />;

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      {!control && (
        <Card
          size='small'
          title={
            <strong style={{ fontSize: '0.8rem' }}>Cancelar Reserva</strong>
          }
          style={{
            width: 350,
            margin: 10,
          }}
        >
          <div style={{ fontSize: '0.8rem' }}>
            Caso precise cancelar sua reserva, clique no botão abaixo que
            redireciona para o grupo do Whatsapp. Lá, você pode falar com o
            administrador Marcelinho.
          </div>
          <Button
            type='primary'
            style={{
              backgroundColor: '#34af23',
              borderColor: '#34af23',
              fontSize: '0.8rem',
              margin: '8px 0px',
            }}
            href='https://chat.whatsapp.com/HnPkO1kAEIa6sfDgN8Mf2a'
          >
            Grupo do WhatSapp
          </Button>
        </Card>
      )}
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
      {times.map(({ label, key }) => (
        <RenderList
          title={label}
          data={orders.filter((order) => order.time === key)}
          key={key}
        />
      ))}
    </div>
  );
}
