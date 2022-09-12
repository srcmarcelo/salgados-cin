/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import { Card, Meta } from 'antd';
import Image from 'next/image';
import Link from 'next/link';
import styles from '../../styles/Home.module.css';
import { BookingButton, ButtonsContainer, FormContainer } from './styles';
import firebase from '../../firebase/clientApp'
import {
  collection,
  getDoc,
  updateDoc,
  doc,
  setDoc,
  getFirestore,
  onSnapshot,
} from 'firebase/firestore';

export default function Reserva() {
  const [bookingMode, setBookingMode] = useState(false);
  const [availables, setAvailables] = useState([]);
  const [booking, setBooking] = useState([])
  const db = getFirestore(firebase);

  useEffect(() => {
    getAvailabes();
  }, []);

  const getAvailabes = async () => {
    const docRef = doc(db, 'salgados', 'disponiveis');
    const docSnap = await getDoc(docRef);
    setAvailables(docSnap.data().disponiveis);
  };

  const handleAddItem = ({item}) => {
    const order = {name: item};
  }

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
        cover={
          <Image
            alt={item.name}
            src={item.media.src}
            height={item.media.height - 20}
            width={item.media.width - 20}
          />
        }
        onClick={() => handleAddItem(item.name)}
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

  const Form = () => (
    <div className={styles.grid}>
      <RenderGroup types={['doce', 'queijo']} />
      <RenderGroup types={['frango']} />
      <RenderGroup types={['misto', 'salsicha']} />
      <RenderGroup types={['carne']} />
    </div>
  );

  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <h1 className={styles.title}>
          {bookingMode
            ? 'Clique no salgado para adicionar à sacola. Adicione quantos quiser!'
            : 'Faça aqui sua reserva ou acompanhe o que reservou!'}
        </h1>
        {bookingMode ? (
          <FormContainer>
            <Form />
          </FormContainer>
        ) : (
          <>
            <div style={{ maxWidth: '800px' }}>
              <p className={styles.description}>
                Escolha se quer que Marcelinho separe seus salgados para não
                ficar sem ou acompanhe uma reserva já feita anteriormente
                clicando em um dos botões abaixo.
              </p>
            </div>
            <ButtonsContainer>
              <BookingButton type='primary' color='orange'>
                Reservar Salgados
              </BookingButton>
              <BookingButton type='primary'>Acompanhar Reserva</BookingButton>
            </ButtonsContainer>
          </>
        )}
      </main>

      <footer className={styles.footer}>
        <a
          href='https://www.linkedin.com/in/srcmarcelo/'
          target='_blank'
          rel='noopener noreferrer'
          className={styles.linkedin}
        >
          srcmarcelo{' '}
          <span className={styles.logo}>
            <Image
              src='/icons8-linkedin.svg'
              alt='LinkedIn'
              width={30}
              height={30}
            />
          </span>
        </a>
      </footer>
    </div>
  );
}
