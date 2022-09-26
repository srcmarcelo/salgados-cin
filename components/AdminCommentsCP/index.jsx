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

  useEffect(() => {
    getComments();
  }, []);

  const getComments = async () => {
    const docRef = doc(db, 'salgados', 'comentarios');
    const docSnap = await getDoc(docRef);
    setOption(docSnap.data().status);
  };

  const postComment = async () => {
    const commentsRef = doc(db, 'salgados', 'comentarios');

    await updateDoc(commentsRef, {
      comment: comment,
    });

    Modal.success({content: 'Comentário enviado.'})
  };

  const updateStatus = async () => {
    const commentsRef = doc(db, 'salgados', 'comentarios');

    await updateDoc(commentsRef, {
      status: option,
    });

    Modal.success({content: 'Status atualizado.'})
  };

  const changeOption = (e) => setOption(e.target.value);

  const onChangeText = (e) => setComment(e.target.value);

  return (
    <div
      style={{ backgroundColor: '#ececec', padding: '2rem', margin: '2rem' }}
    >
      <Radio.Group onChange={changeOption} value={option}>
        <Space direction='vertical'>
          <Radio value={0}>Ativar vendas</Radio>
          <Radio value={1}>Encerrar vendas</Radio>
          <Radio value={2}>Sinalizar Vendas</Radio>
        </Space>
      </Radio.Group>
      <TextArea rows={4} onChange={onChangeText} style={{ margin: '1rem 0' }} />
      <div className={styles.grid}>
        <Button type='primary' onClick={() => postComment()}>
          Enviar Mensagem
        </Button>
        <Button type='primary' onClick={() => updateStatus()} style={{margin: '10px'}}>
          Atualizar Status
        </Button>
      </div>
    </div>
  );
}
