/* eslint-disable react-hooks/exhaustive-deps */
import { Menu, Button, Dropdown, Modal } from 'antd';
import React, { useState, useEffect } from 'react';
import firebase from '../../firebase/clientApp';
import sodaMock from '../../mocks/soda.json';
import noFoodMock from '../../mocks/notAvailables.json';
import ControlPanelTable from '../ControlPanelTable';
import OrderModal from '../OrderModal';
import BookingList from '../BookingList';
import {
  getDoc,
  updateDoc,
  doc,
  setDoc,
  getFirestore,
  increment,
} from 'firebase/firestore';
import BookingNumberButton from '../BookingNumberButton';
import { toUpper } from 'lodash';

export default function ControlPanel({ person }) {
  const [copyText, setCopyText] = useState(false);
  const [mode, setMode] = useState('Vender');
  const [mobile, setMobile] = useState(false);
  const [orderModalVisible, setOrderModalVisible] = useState(false);
  const [soda, setSoda] = useState([]);
  const [availables, setAvailables] = useState([]);
  const [totalAvailables, setTotalAvailables] = useState(0);
  const [bookingNumber, setBookingNumber] = useState(0);
  const [booking, setBooking] = useState({});
  const db = getFirestore(firebase);

  useEffect(() => {
    getAvailabes();
    getBooking();
  }, []);

  useEffect(() => {
    setMobile(window.innerWidth < 960);
  }, []);

  useEffect(() => {
    let total = 0;
    availables.forEach((item) => (total += item.available));
    setTotalAvailables(total);
  }, [availables]);

  useEffect(() => {
    if (copyText) {
      const nextLine = [1, 4, 7, 10, 12];
      let textAvailables = '*Disponiveis agora*';
      availables.forEach((item, index) => {
        if (nextLine.includes(index)) textAvailables += '\n';
        textAvailables =
          textAvailables + '\n' + `${item.available} ${item.name}`;
      });
      navigator.clipboard.writeText(textAvailables);
      Modal.success({ content: 'Texto copiado com sucesso.' });
      setCopyText(false);
    }
  }, [copyText]);

  const getAvailabes = async () => {
    const docRef = doc(db, 'salgados', 'disponiveis');
    const docSnap = await getDoc(docRef);
    setAvailables(docSnap.data().disponiveis);
    const docRef2 = doc(db, 'salgados', 'refrigerantes');
    const docSnap2 = await getDoc(docRef2);
    setSoda(docSnap2.data().disponiveis);
  };

  const increaseCounter = async () => {
    const counterRef = doc(db, 'salgados', 'contador');

    await updateDoc(counterRef, {
      [person]: increment(1),
    });
  };

  const resetAvailables = async (key) => {
    const newKey = key === 'refrigerantes' ? key : 'disponiveis';
    let backup = [];
    if (key === 'disponiveis') {
      const docRef = doc(db, 'salgados', 'backup');
      const docSnap = await getDoc(docRef);
      backup = docSnap.data().disponiveis;
    }
    const mock = {
      disponiveis: backup,
      refrigerantes: sodaMock,
      zerar: noFoodMock,
    };
    await setDoc(doc(db, 'salgados', newKey), { disponiveis: mock[key] });
    getAvailabes();
  };

  const changeAvailables = async (index, value, confirm) => {
    const availablesRef = doc(db, 'salgados', 'disponiveis');
    const docSnap2 = await getDoc(availablesRef);
    const newAvailables = docSnap2.data().disponiveis;
    const changingNumber = value || 1;
    if (newAvailables[index].available > 0 || mode === 'Repor') {
      newAvailables[index].available =
        mode === 'Vender' || confirm
          ? newAvailables[index].available - changingNumber
          : newAvailables[index].available + changingNumber;
      await updateDoc(availablesRef, {
        disponiveis: newAvailables,
      });
      mode === 'Vender' && increaseCounter();
      getAvailabes();
    }
  };

  const restoreCancelOrder = async (orders) => {
    const availablesRef = doc(db, 'salgados', 'disponiveis');
    const sodaRef = doc(db, 'salgados', 'refrigerantes');
    const docSnap1 = await getDoc(availablesRef);
    const newAvailables = docSnap1.data().disponiveis;
    const docSnap2 = await getDoc(sodaRef);
    const newAvailablesSoda = docSnap2.data().disponiveis;
    orders.forEach((order) => {
      const index = order.index;
      const value = order.value;

      if (order.item.includes('Pizza')) {
        newAvailablesSoda[index].available += value;
      } else {
        newAvailables[index].available += value;
      }
    });

    await updateDoc(availablesRef, {
      disponiveis: newAvailables,
    });
    await updateDoc(sodaRef, {
      disponiveis: newAvailablesSoda,
    });
    getAvailabes();
  };

  const changeAvailablesSoda = async (index, value, confirm) => {
    const availablesRef = doc(db, 'salgados', 'refrigerantes');
    const docSnap1 = await getDoc(availablesRef);
    const newAvailables = docSnap1.data().disponiveis;
    const changingNumber = value || 1;
    if (newAvailables[index].available > 0 || mode === 'Repor') {
      newAvailables[index].available =
        mode === 'Vender' || confirm
          ? newAvailables[index].available - changingNumber
          : newAvailables[index].available + changingNumber;
      await updateDoc(availablesRef, {
        disponiveis: newAvailables,
      });
      index !== 0 && mode === 'Vender' && increaseCounter();
      getAvailabes();
    }
  };

  const setBookingObject = (bookingData) => {
    const newBooking = {};
    bookingData.forEach((item) => {
      if (item.status === 2)
        item.order.forEach((orderItem) =>
          Object.keys(newBooking).includes(orderItem.item)
            ? (newBooking[orderItem.item] += orderItem.value)
            : (newBooking[orderItem.item] = orderItem.value)
        );
    });
    setBooking(newBooking);
  };

  const getBooking = async () => {
    const docRef = doc(db, 'salgados', 'reservas');
    const docSnap = await getDoc(docRef);
    setBookingObject(docSnap.data().booking);
    setBookingNumber(docSnap.data().booking.length);
  };

  const onHandleChangeMode = (item) => {
    const buttons = ['Vender', 'Repor'];
    setMode(buttons[item.key - 1]);
  };

  const handleReset = ({ key }) => {
    if (key === 'tudo') {
      resetAvailables('disponiveis');
      resetAvailables('refrigerantes');
    } else resetAvailables(key);
  };

  const openOrderModal = () => {
    setOrderModalVisible(!orderModalVisible);
  };

  const menuReset = (
    <Menu
      onClick={handleReset}
      items={[
        {
          label: 'Resetar tudo',
          key: 'tudo',
        },
        {
          label: 'Resetar salgados',
          key: 'disponiveis',
        },
        {
          label: 'Resetar refrigerantes',
          key: 'refrigerantes',
        },
        {
          label: 'Zerar Salgados',
          key: 'zerar',
        },
      ]}
    />
  );

  const RenderButton = ({ onClick, label, type }) => (
    <Button
      type={type || 'primary'}
      style={{ height: '48px' }}
      onClick={onClick}
    >
      {label}
    </Button>
  );

  const RenderDropdown = ({ overlay, label }) => (
    <Dropdown overlay={overlay} placement='top' arrow>
      <Button
        type='primary'
        style={{
          backgroundColor: '#021D38',
          borderColor: '#021D38',
          height: '48px',
        }}
      >
        {label}
      </Button>
    </Dropdown>
  );

  const PanelButtons = () => {
    const buttons = ['Vender', 'Repor'];
    return (
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <Menu
          theme='dark'
          mode={mobile ? 'vertical' : 'horizontal'}
          style={{ width: '35%', textAlign: 'center' }}
          onClick={(item) => onHandleChangeMode(item)}
          selectedKeys={[`${buttons.indexOf(mode) + 1}`]}
          defaultSelectedKeys={['1']}
          items={buttons.map((button, index) => {
            const key = index + 1;
            return {
              key,
              label: button,
              mobile,
            };
          })}
        />
        <RenderButton
          onClick={() => {}}
          label={`${totalAvailables} salgados`}
          type='default'
        />
        <BookingNumberButton
          bookingNumber={bookingNumber}
          setBookingNumber={(value) => setBookingNumber(value)}
          setBookingObject={(value) => setBookingObject(value)}
        />
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-around',
            flexWrap: 'wrap',
            width: '40%',
          }}
        >
          <RenderDropdown overlay={menuReset} label='Resetar' />
          <RenderButton onClick={getAvailabes} label='Atualizar' />
          {/* <RenderButton
            onClick={() => setCopyText(true)}
            label='Gerar Disponíveis'
          /> */}
        </div>
      </div>
    );
  };

  return (
    <div>
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          flexDirection: 'column',
          fontSize: '2rem',
        }}
      >
        <h2 style={{ color: 'white' }}>{toUpper(person)}</h2>
      </div>
      <OrderModal isVisible={orderModalVisible} openModal={openOrderModal} />
      <ControlPanelTable
        availables={availables}
        soda={soda}
        onClick={changeAvailables}
        onClickSoda={changeAvailablesSoda}
        openOrderModal={openOrderModal}
        booking={booking}
        mode={mode}
      />
      <PanelButtons />
      <div style={{ marginTop: 20 }}>
        <BookingList
          control={true}
          onConfirm={changeAvailables}
          onUndo={restoreCancelOrder}
          onConfirmPizza={changeAvailablesSoda}
        />
      </div>
    </div>
  );
}
