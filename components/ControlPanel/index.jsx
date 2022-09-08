/* eslint-disable react-hooks/exhaustive-deps */
import { Menu, Button } from 'antd';
import React, { useState, useEffect } from 'react';
import baseData from '../../mocks/availables.json';
import ControlPanelTable from '../ControlPanelTable';
import AvailablesList from '../Availables';
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

export default function ControlPanel() {
  const [copyText, setCopyText] = useState(false);
  const [mode, setMode] = useState('Vender');
  const [mobile, setMobile] = useState(false);
  const [availables, setAvailables] = useState([]);
  const [totalAvailables, setTotalAvailables] = useState(0);
  const db = getFirestore(firebase);

  const getAvailabes = async () => {
    const docRef = doc(db, 'salgados', 'disponiveis');
    const docSnap = await getDoc(docRef);
    setAvailables(docSnap.data().disponiveis);
  };

  const resetAvailables = async () => {
    await setDoc(doc(db, 'salgados', 'disponiveis'), { disponiveis: baseData });
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

  const onHandleChangeMode = (item) => {
    const buttons = ['Vender', 'Repor'];
    setMode(buttons[item.key - 1]);
  };

  const RenderButton = ({ onClick, label, type }) => (
    <Button
      type={type || 'primary'}
      style={{ height: '48px' }}
      onClick={onClick}
    >
      {label}
    </Button>
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
          <RenderButton onClick={resetAvailables} label='Resetar' />
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
      <ControlPanelTable availables={availables} onClick={changeAvailables} />
      <PanelButtons />
    </div>
  );
}
