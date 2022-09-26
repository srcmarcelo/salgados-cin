/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import firebase from '../../firebase/clientApp';
import { Button, InputNumber, Radio, Slider } from 'antd';
import foodMock from '../../mocks/availables.json';
import { Modal } from 'antd';
import { getDoc, doc, setDoc, getFirestore } from 'firebase/firestore';

export default function OrderModal(props) {
  const db = getFirestore(firebase);
  const [backup, setBackup] = useState(foodMock);
  const formattedFoodMock = foodMock.map((item) => {
    return item.available;
  });
  const { isVisible, openModal } = props;
  const [orderList, setOrderList] = useState(formattedFoodMock);
  const [totalAvailables, setTotalAvailables] = useState(0);
  const [didRetry, setDidRetry] = useState(false);
  const [copyText, setCopyText] = useState(false);
  const [mode, setMode] = useState('manhã');

  useEffect(() => {
    getBackup();
  }, [isVisible]);

  useEffect(() => {
    let total = 0;
    orderList.forEach((item) => (total += parseInt(item)));
    setTotalAvailables(total);
  }, [orderList, didRetry]);

  useEffect(() => {
    if (copyText) {
      const nextLine = [1, 4, 7, 10, 12];
      let textAvailables = `Pedido da *${mode}*\n`;
      orderList.forEach((item, index) => {
        if (nextLine.includes(index)) textAvailables += '\n';
        textAvailables =
          textAvailables + '\n' + `${item} ${foodMock[index].name}`;
      });
      textAvailables += '\n\n';
      textAvailables += `${totalAvailables} salgados.\n`;
      textAvailables += `Valor: *R$${parseInt(totalAvailables * 2.2)},00*.`;
      navigator.clipboard.writeText(textAvailables);
      updateBackup();
      setCopyText(false);
    }
  }, [copyText]);

  const updateBackup = async () => {
    await setDoc(doc(db, 'salgados', 'backup'), { disponiveis: backup });
    Modal.success({ content: 'Texto copiado e backup atualizado.' });
  };

  const getBackup = async () => {
    console.log('abriu');
    const docRef = doc(db, 'salgados', 'backup');
    const docSnap = await getDoc(docRef);
    setBackup(docSnap.data().disponiveis);
    const formattedBackup = docSnap.data().disponiveis.map((item) => {
      return item.available;
    });
    setOrderList(formattedBackup);
  };

  const onChangeValue = (value, index) => {
    const updatedOrderList = orderList;
    const newBackup = backup;
    updatedOrderList[index] = value;
    newBackup[index].available = value;
    setOrderList(updatedOrderList);
    setDidRetry(!didRetry);
    setBackup(newBackup);
  };

  const FormList = ({ data }) => {
    const elements = data.map((item, index) => (
      <div key={`order_${index}`}>
        <h4>{foodMock[index].name}</h4>
        <div style={{ display: 'flex' }}>
          <Slider
            defaultValue={item}
            onAfterChange={(value) => onChangeValue(value, index)}
            style={{ flex: 1 }}
            min={0}
            max={index === 0 || index === 5 ? 30 : 20}
          />
          <InputNumber
            defaultValue={item}
            style={{
              margin: '0 0px 0px 16px',
            }}
            onChange={(value) => onChangeValue(value, index)}
          />
        </div>
      </div>
    ));

    return elements;
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

  return (
    <Modal
      title='Fazer Encomenda'
      visible={isVisible}
      onOk={() => {
        setCopyText(true);
        openModal();
      }}
      onCancel={openModal}
    >
      <FormList data={orderList} didRetry={didRetry} />
      <RenderButton
        didRetry={didRetry}
        label={`${totalAvailables} salgados`}
        type='default'
      />
      <Radio.Group
        style={{ marginLeft: '20px' }}
        onChange={(e) => setMode(e.target.value)}
        defaultValue={mode}
      >
        <Radio value={'manhã'}>Manhã</Radio>
        <Radio value={'tarde'}>Tarde</Radio>
      </Radio.Group>
    </Modal>
  );
}
