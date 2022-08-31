import Image from 'next/image';
import styles from '../../styles/Home.module.css';
import Link from 'next/link';

export default function Home() {
  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <h1 className={styles.title}>Faça aqui sua reserva!</h1>

        <p className={styles.description}>
          Escolha os salgados colocando na sacola e confirme para deixar o seu
          pedido reservado.
        </p>

        <div className={styles.grid}>
          <button onClick={() => {}} className={styles.card}>
            <h2>Coxinha</h2>
            <p>Disponiveis: 20</p>
          </button>

          <button onClick={() => {}} className={styles.card}>
            <h2>Tortinha doce</h2>
            <p>Disponiveis: 25</p>
          </button>

          <button onClick={() => {}} className={styles.card}>
            <h2>Esfiha de frango</h2>
            <p>Disponiveis: 15</p>
          </button>

          <button onClick={() => {}} className={styles.card}>
            <h2>Esfiha de queijo</h2>
            <p>Disponiveis: 10</p>
          </button>

          <button onClick={() => {}} className={styles.card}>
            <h2>Esfiha de carne</h2>
            <p>Disponiveis: 2</p>
          </button>

          <button onClick={() => {}} className={styles.card}>
            <h2>Empada de frango</h2>
            <p>Disponiveis: 10</p>
          </button>

          <button onClick={() => {}} className={styles.card}>
            <h2>Risole misto</h2>
            <p>Disponiveis: 10</p>
          </button>

          <button onClick={() => {}} className={styles.card}>
            <h2>Risole de queijo</h2>
            <p>Disponiveis: 2</p>
          </button>

          <button onClick={() => {}} className={styles.card}>
            <h2>Risole de carne</h2>
            <p>Disponiveis: 10</p>
          </button>
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
