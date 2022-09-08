import Image from 'next/image';
import Head from 'next/head';
import styles from '../../styles/Home.module.css';
import React from 'react';
import ControlPanel from '../../components/ControlPanel';


export default function Painel() {
  return (
    <div className={styles.container}>
      <Head>
        <title>Salgados CIn!</title>
        <meta name='description' content='Marcelinho dos salgados!' />
        <link rel='icon' href='/favicon.ico' />
      </Head>
      <main className={styles.main}>
        <h1 className={styles.title}>Painel de controle</h1>

        <p className={styles.description}>PAINEL DE CONTROLE DO MARCELINHO</p>

        <ControlPanel />

      </main>

      <footer className={styles.footer}>
        <a
          href='https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app'
          target='_blank'
          rel='noopener noreferrer'
        >
          Powered by{' '}
          <span className={styles.logo}>
            <Image src='/vercel.svg' alt='Vercel Logo' width={72} height={16} />
          </span>
        </a>
      </footer>
    </div>
  );
}
