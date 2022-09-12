import React from 'react';
import Image from 'next/image';
import { Card } from 'antd';
import firebase from '../../firebase/clientApp';
import {
  collection,
  getDoc,
  updateDoc,
  doc,
  setDoc,
  getFirestore,
  onSnapshot,
} from 'firebase/firestore';
import { BookingButton, ButtonsContainer, FormContainer } from './styles';

export default function BookingForm() {
  const { Meta } = Card;

  const [availables, setAvailables] = useState([]);
  const [booking, setBooking] = useState([]);
  const db = getFirestore(firebase);

  useEffect(() => {
    getAvailabes();
  }, []);

  const getAvailabes = async () => {
    const docRef = doc(db, 'salgados', 'disponiveis');
    const docSnap = await getDoc(docRef);
    setAvailables(docSnap.data().disponiveis);
  };

  const handleAddItem = ({ item }) => {
    const order = { name: item };
  };

  const RenderList = ({ data }) => {
    const components = data.map((item, index) => (
      <Card
        hoverable
        key={`${item.type}_${index}`}
        style={{
          width: 240,
          margin: '10px 0px',
          border: item.available === 0 && '2px solid red',
          backgroundColor: item.available === 0 && 'red',
        }}
        cover={
          <Image
            alt={item.name}
            src={item.media.src}
            height={item.media.height - 20}
            width={item.media.width - 20}
          />
        }
        onClick={() => handleAddItem(item.name)}
      >
        <Meta
          title={
            <h3
              style={{ margin: '4px', fontSize: '0.9rem', fontWeight: 'bold' }}
            >
              {item.name}
            </h3>
          }
          description={`Disponiveis: ${item.available} unidades`}
        />
      </Card>
    ));

    return components;
  };

  const RenderGroup = ({ types }) => (
    <div
      style={{ display: 'flex', flexDirection: 'column', margin: '0px 20px' }}
    >
      <RenderList
        data={availables.filter((value) => types.includes(value.type))}
      />
    </div>
  );

  const Form = () => (
    <div className={styles.grid}>
      <RenderGroup types={['doce', 'queijo']} />
      <RenderGroup types={['frango']} />
      <RenderGroup types={['misto', 'salsicha']} />
      <RenderGroup types={['carne']} />
    </div>
  );
  return (
    <FormContainer>
      <Form />
    </FormContainer>
  );
}
