import React from 'react';
import Image from 'next/image';
import Head from 'next/head';
import styles from '../../styles/Home.module.css';
import ControlPanel from '../../components/ControlPanel';
import AdminCommentsCP from '../../components/AdminCommentsCP';

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

        <AdminCommentsCP />
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
