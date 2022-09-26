import React, { useEffect, useState } from 'react';
import { Card, Spin } from 'antd';
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

  const stopLoading = () => setLoading(false)

  const unsub = onSnapshot(doc(db, 'salgados', 'comentarios'), (doc) => {
    setComments(doc.data().comment);
    setStatus(doc.data().status);
    loading && stopLoading();
  });


  return (
    <div>
      <div style={{ padding: 10, background: '#ececec', marginBottom: '2rem' }}>
        {loading ? (
          <Spin />
        ) : (
          <Card
            title={
              <p style={{ color: collors[status], margin: 0 }}>
                {sellings[status]}
              </p>
            }
            size='small'
            bordered={false}
            style={{
              width: 320,
            }}
          >
            <p>{comments}</p>
          </Card>
        )}
      </div>
    </div>
  );
}
