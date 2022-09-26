/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState } from 'react';
import Image from 'next/image';
import styles from '../../../styles/Home.module.css';
import BookingList from '../../../components/BookingList';
import Head from 'next/head';
import { Breadcrumb } from 'antd';
import Link from 'next/link';

export default function Reserva() {

  const RenderBreadcrumb = () => (
    <Breadcrumb style={{ position: 'absolute', top: 10, left: 20, fontSize: '1rem' }}>
      <Breadcrumb.Item>
        <Link href='/'>Inicio</Link>
      </Breadcrumb.Item>
      <Breadcrumb.Item>
        <Link href='/reservar'>Reservar</Link>
      </Breadcrumb.Item>
      <Breadcrumb.Item>Acompanhar reserva</Breadcrumb.Item>
    </Breadcrumb>
  );

  return (
    <div className={styles.container}>
      <Head>
        <title>Reservas</title>
        <meta name='description' content='Marcelinho dos salgados!' />
        <link rel='icon' href='/favicon.ico' />
      </Head>
      <RenderBreadcrumb />
      <main className={styles.main}>
        <h1 className={styles.title}>
          Acompanhe sua reserva!
        </h1>
        <div style={{ maxWidth: '800px' }}>
          <p className={styles.description}>
            Todas as reservas feitas estão listadas abaixo.
          </p>
          <BookingList />
        </div>
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
              src='/linkedin.png'
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
