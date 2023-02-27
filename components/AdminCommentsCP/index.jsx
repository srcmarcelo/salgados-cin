/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import { Radio, Space, Input, Button, Modal } from 'antd';
import styles from '../../styles/Home.module.css';
import firebase from '../../firebase/clientApp';
import {
  getDoc,
  updateDoc,
  doc,
  setDoc,
  getFirestore,
} from 'firebase/firestore';

export default function AdminCommentsCP() {
  const { TextArea } = Input;
  const db = getFirestore(firebase);

  const [option, setOption] = useState(0);
  const [comment, setComment] = useState('');
  const [time, setTime] = useState(0);

  const modes = [
    'Entre 09:45 e 10:15',
    'Entre 11:45 e 12:30',
    'Entre 14:30 e 15:30',
    'Entre 16:45 e 17:15',
  ];

  useEffect(() => {
    getComments();
  }, []);

  const getComments = async () => {
    const docRef = doc(db, 'salgados', 'comentarios');
    const docSnap = await getDoc(docRef);
    const docRef2 = doc(db, 'salgados', 'reservas');
    const docSnap2 = await getDoc(docRef2);
    setOption(docSnap.data().status);
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

  const changeOption = (e) => setOption(e.target.value);
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
      style={{ backgroundColor: '#ececec', padding: '2rem', margin: '2rem' }}
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
            {modes.map((mode, index) => (
              <Radio key={`modes_${index}`} value={index}>
                {mode}
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
      <div className={styles.grid}>
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
          />
          <RenderControlButton
            onClick={updateTime}
            label='Atualizar Período'
            color='purple'
          />
        </div>
      </div>
    </div>
  );
}
