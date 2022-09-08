import Head from 'next/head';
import Image from 'next/image';
import styles from '../styles/Home.module.css';
import Link from 'next/link';
import React, { useState } from 'react';
import AvailablesList from '../components/Availables';

export default function Home() {
  const [showAvailables, setShowAvailables] = useState(false);

  return (
    <div className={styles.container}>
      <Head>
        <title>Salgados CIn!</title>
        <meta name='description' content='Marcelinho dos salgados!' />
        <link rel='icon' href='/favicon.ico' />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>Salgados CIn!</h1>

        <p className={styles.description}>Faça já sua reserva!</p>

        {/* <div className={styles.grid}>
          <Link href='/reserva'>
            <div className={styles.card}>
              <h2>Fazer reserva</h2>
              <p>Clique aqui para que Marcelo guarde seu pedido.</p>
            </div>
          </Link>
        </div> */}

        {!showAvailables && (
          <button
            className={styles.card}
            onClick={() => setShowAvailables(true)}
          >
            <h2>Mostrar salgados disponiveis AGORA</h2>
            <p>Status: Vendas acontecendo!</p>
          </button>
        )}

        {showAvailables && <AvailablesList />}
      </main>

      <footer className={styles.footer}>
        <a href='/painel' target='_blank' rel='noopener noreferrer'>
          Powered by{' '}
          <span className={styles.logo}>
            <Image src='/vercel.svg' alt='Vercel Logo' width={72} height={16} />
          </span>
        </a>
      </footer>
    </div>
  );
}
