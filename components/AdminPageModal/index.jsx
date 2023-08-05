import { Input, Modal } from 'antd';
import React, { useState } from 'react';

export default function AdminPageModal({ visible, success }) {
  const [password, setPassword] = useState('');

  const NotAdmin = () => {
    Modal.info({
      title: 'Em breve...',
      content: (
        <div>
          <p>
            Em breve postarei um vídeo explicando como funciona a plataforma dos
            salgados do Centro de Informática!
          </p>
        </div>
      ),
      onOk() {},
    });
  };

  const VerifyPassword = () => {
    const secrets = {
      1448: 'larissa',
      '0523': 'ricardo',
      3369: 'will',
      7993: 'pedro',
      evodia: 'marcelo',
    };
    //Sim, entendo que este tipo de verificação é vulnerável, pois pessoas como você tem acesso à ela.
    //Peço que não faça alterações nos dados. Nunca tive problemas com usando este método, e como
    //os dados aqui presentes não são sensíveis, deixarei assim até que eu enfrente algum.
    Object.keys(secrets).includes(password) ? success(secrets[password]) : NotAdmin();
  };

  return (
    <Modal
      visible={visible}
      closable={false}
      onCancel={NotAdmin}
      onOk={VerifyPassword}
      centered
      cancelText='Não, sou visitante do site'
      okText='Entrar'
      title={
        <div style={{ textAlign: 'center' }}>
          Deseja fazer alterações nos dados?
        </div>
      }
    >
      <div style={{ textAlign: 'center', marginBottom: '20px' }}>
        Digite a senha para ter acesso aos controles do painel de controle:
      </div>
      <Input
        onChange={(e) => setPassword(e.target.value)}
        onPressEnter={VerifyPassword}
      />
    </Modal>
  );
}
