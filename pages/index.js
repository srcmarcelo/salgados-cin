import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import styles from '../styles/Home.module.css';
import React from 'react';
import AvailablesList from '../components/Availables';
import AdminComments from '../components/AdminComments';
import { Button, Affix, Collapse } from 'antd';

export default function Home() {
  return (
    <div className={styles.container}>
      <Head>
        <title>Marcelinho dos Salgados</title>
        <meta
          name='google-site-verification'
          content='fsWu403nKM_dN5xMNZ61YSDli-w5kUUAwTXJZzy9MvQ'
        />
        <meta
          name='description'
          content='Faça reservas e veja salgados disponíveis em tempo real!'
        />
        <script
          async
          src='https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-3814344175379935'
          crossOrigin='anonymous'
        ></script>
        <link rel='icon' href='/favicon.ico' />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>Marcelinho dos Salgados</h1>

        <p className={styles.description}>
          Faça reservas e veja salgados disponíveis em tempo real!
        </p>

        <Affix offsetTop={30}>
          <Link href='/reservar'>
            <Button
              type='primary'
              style={{
                backgroundColor: 'orange',
                borderColor: 'orange',
                marginBottom: '2rem',
              }}
            >
              Fazer Reserva
            </Button>
          </Link>
        </Affix>

        <div className={styles.grid}>
          <AdminComments />
          {/* <Collapse style={{margin: '10px'}}>
            <Collapse.Panel header='Preços e combos' key='1'>
              <p>Qualquer salgado por apenas R$ 3,00!</p>
            </Collapse.Panel>
            <Collapse.Panel header='Entrar no grupo do Whatsapp' key='2'>
              <p>Entrar no grupo</p>
            </Collapse.Panel>
          </Collapse> */}
        </div>

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
            <Image src='/linkedin.png' alt='LinkedIn' width={30} height={30} />
          </span>
        </a>
      </footer>
    </div>
  );
}
