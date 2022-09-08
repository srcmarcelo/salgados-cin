/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import { Card, Spin } from 'antd';
import Image from 'next/image';
import styles from '../../styles/Home.module.css';
import firebase from '../../firebase/clientApp';
import { doc, getFirestore, onSnapshot, getDoc } from 'firebase/firestore';

export default function AvailablesList() {
  const { Meta } = Card;
  const db = getFirestore(firebase);

  const [availables, setAvailables] = useState([]);

  const unsub = onSnapshot(doc(db, 'salgados', 'disponiveis'), (doc) => {
    setAvailables(doc.data().disponiveis);
  });

  const getAvailabes = async () => {
    const docRef = doc(db, 'salgados', 'disponiveis');
    const docSnap = await getDoc(docRef);
    setAvailables(docSnap.data().disponiveis);
  };

  useEffect(() => getAvailabes, []);

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

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <h2>Disponiveis AGORA</h2>
      {availables === [] ? (
        <Spin />
      ) : (
        <div className={styles.grid}>
          <RenderGroup types={['doce', 'queijo']} />
          <RenderGroup types={['frango']} />
          <RenderGroup types={['misto', 'salsicha']} />
          <RenderGroup types={['carne']} />
        </div>
      )}
    </div>
  );
}
