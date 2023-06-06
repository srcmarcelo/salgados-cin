import React, { useEffect, useState } from 'react';
import { Button, Card, Spin, Modal } from 'antd';
import firebase from '../../firebase/clientApp';
import { doc, getFirestore, onSnapshot } from 'firebase/firestore';

export default function AdminComments() {
  const db = getFirestore(firebase);
  const sellings = [
    'VENDAS ACONTECENDO',
    'VENDAS ENCERRADAS POR HOJE',
    'VENDAS COMEÇARÃO EM BREVE',
  ];
  const collors = ['green', 'red', 'orange'];

  const [comments, setComments] = useState('');
  const [status, setStatus] = useState(0);
  const [loading, setLoading] = useState(true);

  const stopLoading = () => setLoading(false);

  const unsub = onSnapshot(doc(db, 'salgados', 'comentarios'), (doc) => {
    setComments(doc.data().comment);
    setStatus(doc.data().status);
    loading && stopLoading();
  });

  const RenderComments = ({ title, content }) => (
    <div
      style={{
        padding: 10,
        background: '#ececec',
        margin: 10,
      }}
    >
      {loading ? (
        <Spin />
      ) : (
        <Card
          title={title}
          size='small'
          bordered={false}
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            width: 280,
            minHeight: 130,
          }}
        >
          <p
            style={{
              margin: 0,
            }}
          >
            {content}
          </p>
        </Card>
      )}
    </div>
  );

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexWrap: 'wrap',
        marginBottom: 30,
        maxWidth: '1300px',
      }}
    >
      <RenderComments
        title={
          <p style={{ color: '#1890ff', fontWeight: 'bold', margin: 0 }}>
            PREÇOS
          </p>
        }
        content={
          <>
            <p style={{ fontSize: '0.9rem', marginBottom: 8 }}>
              Veja nossos preços!
            </p>
            <Button
              type='primary'
              style={{ marginBottom: 0 }}
              onClick={() =>
                Modal.info({
                  title: 'Tabela de preços',
                  content: (
                    <div>
                      <h2>Qualquer salgado por R$ 3,50!</h2>
                      <h2>Pizza R$ 5,00!</h2>
                      <p style={{ marginBottom: 3 }}>
                        <strong>CAFÉ:</strong>
                      </p>
                      <p style={{ margin: 0 }}>Copo pequeno (50ml) -- R$1,00</p>
                      <p style={{ marginBottom: 20 }}>
                        Copo grande (150ml) -- R$2,00
                      </p>
                      <p>Aceitamos PIX, dinheiro ou cartão!</p>
                      <p><strong>Chave PIX:</strong></p>
                      <p>marcelo.cristian.969@gmail.com</p>
                    </div>
                  ),
                })
              }
            >
              Ver Preços
            </Button>
          </>
        }
      />
      <RenderComments
        title={
          <p style={{ color: collors[status], margin: 0 }}>
            {sellings[status]}
          </p>
        }
        content={
          <div
            style={{
              textAlign: 'center',
            }}
          >
            {comments}
          </div>
        }
      />
      <RenderComments
        title={
          <p style={{ color: '#34af23', fontWeight: 'bold', margin: 0 }}>
            GRUPO DO WHATSAPP
          </p>
        }
        content={
          <>
            <p style={{ fontSize: '0.9rem', marginBottom: 8 }}>
              Fale com o Marcelinho e veja os avisos!
            </p>
            <Button
              type='primary'
              style={{
                backgroundColor: '#34af23',
                borderColor: '#34af23',
                fontSize: '0.8rem',
              }}
              href='https://chat.whatsapp.com/FzsL5qWXz6R6b2UznbtVNc'
              target='_blank'
              rel='noopener noreferrer'
            >
              Entrar no Grupo
            </Button>
          </>
        }
      />
    </div>
  );
}
