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

  useEffect(() => {
    getComments();
  }, []);

  const getComments = async () => {
    const docRef = doc(db, 'salgados', 'comentarios');
    const docSnap = await getDoc(docRef);
    const docRef2 = doc(db, 'salgados', 'reservas');
    const docSnap2 = await getDoc(docRef2);
    setOption(docSnap.data().status);
    setTime(
      docSnap2.data().afternoon ? 1 : docSnap2.data().special.enabled ? 2 : 0
    );
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
      afternoon: time === 1,
      special: time === 2,
    });

    Modal.success({ content: 'Período atualizado.' });
  };

  const changeOption = (e) => setOption(e.target.value);
  const onChangeTime = (e) => setTime(e.target.value);

  const onChangeText = (e) => setComment(e.target.value);

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
            <Radio value={0}>Manhã</Radio>
            <Radio value={1}>Tarde</Radio>
            <Radio value={2}>Especial</Radio>
          </Space>
        </Radio.Group>
      </div>
      <TextArea rows={4} onChange={onChangeText} style={{ margin: '1rem 0' }} />
      <div className={styles.grid}>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <Button
            type='primary'
            onClick={() => postComment()}
            style={{ margin: '10px' }}
          >
            Enviar Mensagem
          </Button>
          <Button
            type='primary'
            onClick={() => updateStatus()}
            style={{ margin: '10px' }}
          >
            Atualizar Status
          </Button>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <Button
            type='primary'
            onClick={() => {
              postComment();
              updateStatus();
            }}
            style={{ margin: '10px' }}
          >
            Atualizar Ambos
          </Button>
          <Button
            type='primary'
            onClick={() => updateTime()}
            style={{ margin: '10px' }}
          >
            Atualizar Período
          </Button>
        </div>
      </div>
    </div>
  );
}
