/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import styles from '../../styles/Home.module.css';
import BookingForm from '../../components/BookingForm';
import { BookingButton, ButtonsContainer, FormContainer } from '../../components/BookingForm/styles';

export default function Reserva() {
  const [bookingMode, setBookingMode] = useState(false);

  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <h1 className={styles.title}>
          {bookingMode
            ? 'Clique no salgado para adicionar à sacola. Adicione quantos quiser!'
            : 'Faça aqui sua reserva ou acompanhe o que reservou!'}
        </h1>
        {bookingMode ? (
          <BookingForm />
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
