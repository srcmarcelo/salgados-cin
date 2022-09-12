/* eslint-disable react-hooks/exhaustive-deps */
import { Menu, Button, Dropdown } from 'antd';
import React, { useState, useEffect } from 'react';
import firebase from '../../firebase/clientApp';
import foodMock from '../../mocks/availables.json';
import sodaMock from '../../mocks/soda.json';
import ControlPanelTable from '../ControlPanelTable';
import OrderModal from '../OrderModal';
import {
  collection,
  getDoc,
  updateDoc,
  doc,
  setDoc,
  getFirestore,
  onSnapshot,
} from 'firebase/firestore';

export default function ControlPanel() {
  const [copyText, setCopyText] = useState(false);
  const [mode, setMode] = useState('Vender');
  const [mobile, setMobile] = useState(false);
  const [orderModalVisible, setOrderModalVisible] = useState(false);
  const [soda, setSoda] = useState([]);
  const [availables, setAvailables] = useState([]);
  const [totalAvailables, setTotalAvailables] = useState(0);
  const db = getFirestore(firebase);

  useEffect(() => {
    getAvailabes();
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
      const nextLine = [1, 5, 8, 10, 12];
      let textAvailables = '*Disponiveis agora*';
      availables.forEach((item, index) => {
        if (nextLine.includes(index)) textAvailables += '\n';
        textAvailables =
          textAvailables + '\n' + `${item.available} ${item.name}`;
      });
      navigator.clipboard.writeText(textAvailables);
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

  const resetAvailables = async (key) => {
    const mock = {
      disponiveis: foodMock,
      refrigerantes: sodaMock,
    };
    await setDoc(doc(db, 'salgados', key), { disponiveis: mock[key] });
    getAvailabes();
  };

  const changeAvailables = async (index) => {
    const availablesRef = doc(db, 'salgados', 'disponiveis');
    const newAvailables = availables;
    if (newAvailables[index].available > 0 || mode === 'Repor') {
      newAvailables[index].available =
        mode === 'Vender'
          ? newAvailables[index].available - 1
          : newAvailables[index].available + 1;
      await updateDoc(availablesRef, {
        disponiveis: newAvailables,
      });
      getAvailabes();
    }
  };

  const changeAvailablesSoda = async (index) => {
    const availablesRef = doc(db, 'salgados', 'refrigerantes');
    const newAvailables = soda;
    if (newAvailables[index].available > 0 || mode === 'Repor') {
      newAvailables[index].available =
        mode === 'Vender'
          ? newAvailables[index].available - 1
          : newAvailables[index].available + 1;
      await updateDoc(availablesRef, {
        disponiveis: newAvailables,
      });
      getAvailabes();
    }
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
  }

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
          style={{ width: '40%' }}
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
          <RenderButton
            onClick={() => setCopyText(true)}
            label='Gerar Disponíveis'
          />
        </div>
      </div>
    );
  };

  return (
    <div>
      <OrderModal isVisible={orderModalVisible} openModal={openOrderModal} />
      <ControlPanelTable
        availables={availables}
        soda={soda}
        onClick={changeAvailables}
        onClickSoda={changeAvailablesSoda}
        openOrderModal={openOrderModal}
      />
      <PanelButtons />
    </div>
  );
}
