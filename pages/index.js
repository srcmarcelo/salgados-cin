import Head from 'next/head';
import Image from 'next/image';
import styles from '../styles/Home.module.css';
import Link from 'next/link';
import React from 'react';
import AvailablesList from '../components/Availables';
import { Button } from 'antd';

export default function Home() {

  return (
    <div className={styles.container}>
      <Head>
        <title>Salgados CIn!</title>
        <meta name='description' content='Marcelinho dos salgados!' />
        <link rel='icon' href='/favicon.ico' />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>Salgados CIn!</h1>

        <p className={styles.description}>Marcelinho dos Salgados</p>
        
        <Button>Fazer Reserva (Em breve)</Button>

        {/* <div className={styles.grid}>
          <Link href='/reserva'>
            <div className={styles.card}>
              <h2>Fazer reserva</h2>
              <p>Clique aqui para que Marcelo guarde seu pedido.</p>
            </div>
          </Link>
        </div> */}

        <AvailablesList />
      </main>

      {/* <footer className={styles.footer}>
        <a href='/painel' target='_blank' rel='noopener noreferrer'>
          Painel de Controle{' '}
          <span className={styles.logo}>
            <Image src='/icone.jpg' alt='Marcelinho dos Salgados Logo' width={50} height={50} />
          </span>
        </a>
      </footer> */}
    </div>
  );
}
