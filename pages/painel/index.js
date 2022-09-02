import Image from 'next/image';
import styles from '../../styles/Home.module.css';
import React, { useState, useEffect } from 'react';
import availables from '../../mocks/availables.json';

export default function Painel() {
  const [copyText, setCopyText] = useState(false);

  useEffect(() => {
    if (copyText) {
      const nextLine = [1, 5, 8, 10, 12];
      let textAvailables = '*Disponiveis agora*';
      availables.forEach((item, index) => {
        if(nextLine.includes(index)) textAvailables += '\n';
        textAvailables =
          textAvailables + '\n' + `${item.available} ${item.name}`;
      });
      navigator.clipboard.writeText(textAvailables);
      setCopyText(false);
    }
  }, [copyText]);

  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <h1 className={styles.title}>Painel de controle</h1>

        <p className={styles.description}>PAINEL DE CONTROLE DO MARCELINHO</p>

        <div className={styles.grid}>
          <button onClick={() => setCopyText(true)}>Gerar disponíveis</button>
        </div>
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
