import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import styles from '../styles/Home.module.css';
import React from 'react';
import AvailablesList from '../components/Availables';
import { Button, Affix } from 'antd';

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

        {/* <Affix offsetTop={50}> */}
          {/* <Link href='/reservar'> */}
            <Button
              type='primary'
              disabled={true}
              style={{
                backgroundColor: 'orange',
                borderColor: 'orange',
                marginBottom: '2rem',
              }}
            >
              Fazer Reserva (esta semana)
            </Button>
          {/* </Link> */}
        {/* </Affix> */}

        <AvailablesList />
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
