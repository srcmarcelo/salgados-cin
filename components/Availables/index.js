/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import { Card, Spin, Button, Affix } from 'antd';
import Image from 'next/image';
import styles from '../../styles/Home.module.css';
import firebase from '../../firebase/clientApp';
import { doc, getFirestore, onSnapshot, getDoc } from 'firebase/firestore';

export default function AvailablesList() {
  const { Meta } = Card;
  const db = getFirestore(firebase);

  const [availables, setAvailables] = useState([]);
  const [soda, setSoda] = useState([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState(0);

  const getAvailabes = async () => {
    setLoading(true);
    const docRef = doc(db, 'salgados', 'disponiveis');
    const docSnap = await getDoc(docRef);
    setAvailables(docSnap.data().disponiveis);
    const docRef2 = doc(db, 'salgados', 'refrigerantes');
    const docSnap2 = await getDoc(docRef2);
    setSoda(docSnap2.data().disponiveis);
    const docRef3 = doc(db, 'salgados', 'comentarios');
    const docSnap3 = await getDoc(docRef3);
    setStatus(docSnap3.data().status);
    setLoading(false);
  };

  useEffect(() => {
    getAvailabes();
  }, []);

  const RenderList = ({ data }) => {
    const components = data.map((item, index) => (
      <Card
        hoverable
        key={`${item.type}_${index}`}
        style={{
          width: 240,
          margin: '10px 0px',
          border: item.available === 0 && '2px solid red',
          backgroundColor: item.available === 0 && 'red',
        }}
        cover={<Image alt={item.name} src={item.media} />}
      >
        <Meta
          title={
            <h3
              style={{ margin: '4px', fontSize: '0.9rem', fontWeight: 'bold' }}
            >
              {item.name}
            </h3>
          }
          description={`Disponiveis: ${item.available} unidades`}
        />
      </Card>
    ));

    return components;
  };

  const RenderGroup = ({ types }) => (
    <div
      style={{ display: 'flex', flexDirection: 'column', margin: '0px 20px' }}
    >
      <RenderList
        data={availables.filter((value) => types.includes(value.type))}
      />
    </div>
  );

  const RenderSodaList = ({ data }) => {
    const components = data.map((item, index) => (
      <Card
        hoverable
        key={`${item.type}_${index}`}
        style={{
          width: 225,
          margin: '10px 20px',
          border: item.available === 0 && '2px solid red',
          backgroundColor: item.available === 0 && 'red',
        }}
        cover={<Image alt={item.type} src={item.media} />}
      >
        <Meta
          title={
            <h3
              style={{ margin: '4px', fontSize: '0.9rem', fontWeight: 'bold' }}
            >
              {item.type}
            </h3>
          }
          description={
            item.type === 'Café'
              ? item.available > 0
                ? 'Disponível'
                : 'Não disponível'
              : `Disponiveis: ${item.available} unidades`
          }
        />
      </Card>
    ));

    return components;
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Affix offsetTop={70}>
        <Button
          type='primary'
          onClick={getAvailabes}
          style={{ marginBottom: 10 }}
        >
          Atualizar listas
        </Button>
      </Affix>
      <h2>Salgados Disponíveis {status === 2 && '(apenas para reservas)'}</h2>
      {loading ? (
        <Spin />
      ) : (
        <>
          <div className={styles.grid}>
            <RenderGroup types={['doce', 'misto']} />
            <RenderGroup types={['frango']} />
            <RenderGroup types={['frango2', 'carne', 'salsicha']} />
            <RenderGroup types={['queijo']} />
          </div>
          <div className={styles.grid}>
            <RenderSodaList data={soda} />
          </div>
        </>
      )}
    </div>
  );
}
