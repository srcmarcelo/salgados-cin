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
        <title>Salgados CIn!</title>
        <meta name='description' content='Marcelinho dos salgados!' />
        <link rel='icon' href='/favicon.ico' />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>Salgados CIn!</h1>

        <p className={styles.description}>Marcelinho dos Salgados</p>

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
