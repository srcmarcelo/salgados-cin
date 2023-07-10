/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import { Radio, Space, Input, Button, Modal } from 'antd';
import styles from '../../styles/Home.module.css';
import firebase from '../../firebase/clientApp';
import { getDoc, updateDoc, doc, getFirestore } from 'firebase/firestore';

const DefaultMessages = {
  0: [
    'Salgados acabaram de chegar! Estamos nas mesas da área externa do bloco E (prédio branco).',
    'Amanhã tem mais, pessoal!',
    'Salgados previstos para chegar às 09:30!',
  ],
  1: [
    'Salgados da tarde acabaram de chegar! Estamos nas mesas da área externa do bloco E (prédio branco).',
    'Amanhã tem mais, pessoal!',
    'Salgados previstos para chegar às 14:30!',
  ],
};

const DefaultWhatsappMessages = [
  '*Salgados acabaram de chegar!* Estamos nas mesas da *área externa do bloco* E (prédio branco).',
  '*Salgados da tarde acabaram de chegar!* Estamos nas mesas da *área externa do bloco* E (prédio branco).',
];

export default function AdminCommentsCP() {
  const { TextArea } = Input;
  const db = getFirestore(firebase);

  const [option, setOption] = useState(0);
  const [comment, setComment] = useState('');
  const [time, setTime] = useState(0);
  const [modes, setModes] = useState([]);

  useEffect(() => {
    getComments();
  }, []);

  const getComments = async () => {
    const docRef = doc(db, 'salgados', 'comentarios');
    const docSnap = await getDoc(docRef);
    const docRef2 = doc(db, 'salgados', 'reservas');
    const docSnap2 = await getDoc(docRef2);
    setOption(docSnap.data().status);
    setModes(docSnap2.data().times);
    setTime(docSnap2.data().time);
    setComment(docSnap.data().comment);
  };

  const postComment = async () => {
    const commentsRef = doc(db, 'salgados', 'comentarios');

    await updateDoc(commentsRef, {
      comment: comment,
    });

    Modal.success({ content: 'Comentário enviado.' });
  };

  const updateStatus = async () => {
    const commentsRef = doc(db, 'salgados', 'comentarios');

    await updateDoc(commentsRef, {
      status: option,
    });

    Modal.success({ content: 'Status atualizado.' });
  };

  const updateTime = async () => {
    const bookingRef = doc(db, 'salgados', 'reservas');

    await updateDoc(bookingRef, {
      time: time,
    });

    Modal.success({ content: 'Período atualizado.' });
  };

  const updateBooking = async (value) => {
    const bookingRef = doc(db, 'salgados', 'reservas');

    await updateDoc(bookingRef, {
      enabled: value,
    });

    Modal.success({
      content: `Reservas ${value ? 'liberadas' : 'bloqueadas'}.`,
    });
  };

  const changeOption = (e) => {
    setOption(e.target.value);
    setComment(DefaultMessages[time][e.target.value]);
  };
  const onChangeTime = (e) => setTime(e.target.value);
  const onChangeText = (e) => setComment(e.target.value);

  const RenderControlButton = ({ onClick, color, label }) => (
    <Button
      type='primary'
      onClick={onClick}
      style={{
        margin: '10px',
        backgroundColor: color || null,
        borderColor: color || null,
      }}
    >
      {label}
    </Button>
  );

  return (
    <div
      style={{
        backgroundColor: '#ececec',
        padding: '2rem',
        margin: '2rem',
        display: 'flex',
        justifyContent: 'center',
        flexDirection: 'column',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <Radio.Group onChange={changeOption} value={option}>
          <Space direction='vertical'>
            <Radio value={0}>Ativar vendas</Radio>
            <Radio value={1}>Encerrar vendas</Radio>
            <Radio value={2}>Sinalizar Vendas</Radio>
          </Space>
        </Radio.Group>
        <Radio.Group onChange={onChangeTime} value={time}>
          <Space direction='vertical'>
            {modes.map(({ label }, index) => (
              <Radio key={`modes_${index}`} value={index}>
                {label}
              </Radio>
            ))}
          </Space>
        </Radio.Group>
      </div>
      <TextArea
        rows={4}
        onChange={onChangeText}
        value={comment}
        style={{ margin: '1rem 0' }}
      />
      <div className={styles.grid} style={{ justifyContent: 'center' }}>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <RenderControlButton onClick={postComment} label='Enviar Mensagem' />
          <RenderControlButton
            onClick={updateStatus}
            label='Atualizar Status'
          />
          <RenderControlButton
            onClick={() => {
              postComment();
              updateStatus();
            }}
            label='Atualizar Ambos'
            color='darkblue'
          />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <RenderControlButton
            onClick={() => updateBooking(false)}
            label='Bloquear Reservas'
            color='darkred'
          />
          <RenderControlButton
            onClick={() => updateBooking(true)}
            label='Liberar Reservas'
            color='darkgreen'
            border='solid'
            border-width='3px'
          />
          <RenderControlButton
            onClick={updateTime}
            label='Atualizar Período'
            color='purple'
          />
        </div>
      </div>
      <div style={{ padding: 10 }}>
        <Button
          type='primary'
          onClick={() =>
            navigator.clipboard.writeText(DefaultWhatsappMessages[time])
          }
          style={{
            backgroundColor: '#33A884',
            borderColor: '#33A884',
            width: '100%',
          }}
        >
          Gerar Mensagem Whatsapp
        </Button>
      </div>
    </div>
  );
}
