import { Menu, Button } from 'antd';
import React, { useState, useEffect } from 'react';
import availables from '../../mocks/availables.json';
import AvailablesList from '../Availables';

export default function ControlPanel() {
  const [copyText, setCopyText] = useState(false);
  const [mode, setMode] = useState('Vender');

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

  const RenderButton = ({onClick, label}) => (
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
          <RenderButton onClick={() => {}} label='Atualizar' />
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
      <AvailablesList />
      <PanelButtons />
    </div>
  );
}
