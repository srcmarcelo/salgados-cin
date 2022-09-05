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
  const [availables, setAvailables] = useState([]);
  const db = getFirestore(firebase);

  const getAvailabes = async () => {
    const docRef = doc(db, 'salgados', 'disponiveis');
    const docSnap = await getDoc(docRef);
    setAvailables(docSnap.data().disponiveis);
  };

  const resetAvailables = async () => {
    await setDoc(doc(db, 'salgados', 'disponiveis'), { disponiveis: baseData });
  };

  const decreaseAvailables = async (index) => {
    const availablesRef = doc(db, 'salgados', 'disponiveis');
    const newAvailables = availables;
    if (newAvailables[index].available > 0 || mode === 'Repor') {
      newAvailables[index].available =
        mode === 'Vender'
          ? newAvailables[index].available - 1
          : newAvailables[index].available + 1;
      console.log('newAvailables:', newAvailables);
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

  const RenderButton = ({ onClick, label }) => (
    <Button
      type='primary'
      style={{ height: '48px', marginLeft: '20px' }}
      onClick={onClick}
    >
      {label}
    </Button>
  );

  const PanelButtons = () => {
    const buttons = ['Repor', 'Vender'];
    return (
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <Menu
          theme='dark'
          mode='horizontal'
          style={{ width: '50%' }}
          onClick={(item) => setMode(buttons[item.key - 1])}
          defaultSelectedKeys={['2']}
          items={buttons.map((button, index) => {
            const key = index + 1;
            return {
              key,
              label: button,
            };
          })}
        />
        <div>
          <RenderButton onClick={resetAvailables} label='Resetar' />
          <RenderButton
            onClick={() => console.log(availables)}
            label='Atualizar'
          />
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
      <ControlPanelTable availables={availables} onClick={decreaseAvailables} />
      <PanelButtons />
    </div>
  );
}
