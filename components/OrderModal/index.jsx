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
  const [meatPizza, setMeatPizza] = useState(10);
  const [chickenPizza, setChickenPizza] = useState(6);
  const [cheesePizza, setCheesePizza] = useState(4);

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
      const nextLine = [2, 3, 5, 8, 11, 13, 14, 15];
      let textAvailables = `Pedido da *${mode}*\n`;
      orderList.forEach((item, index) => {
        if (nextLine.includes(index)) textAvailables += '\n';
        textAvailables =
          index === 15
            ? textAvailables + '\n' + `${item} ${backup[index].name} (especial)`
            : textAvailables + '\n' + `${item} ${backup[index].name}`;
      });
      textAvailables += '\n\n';
      textAvailables += `*${totalAvailables} salgados.*\n`;
      textAvailables += `Valor: R$${parseFloat(totalAvailables * 2.5).toFixed(
        2
      )}.`;
      // textAvailables += `\n${meatPizza} pizza${
      //   meatPizza > 1 ? 's' : ''
      // } de calabresa.\n`;
      // textAvailables += `\n${chickenPizza} pizza${
      //   chickenPizza > 1 ? 's' : ''
      // } de frango.\n`;
      // textAvailables += `\n${cheesePizza} pizza${
      //   cheesePizza > 1 ? 's' : ''
      // } de mussarela.\n`;
      // textAvailables += `\n*${
      //   meatPizza + chickenPizza + cheesePizza
      // } pizzas.*\n`;
      // textAvailables += `Valor: R$${parseFloat(
      //   (meatPizza + chickenPizza + cheesePizza) * 3.5
      // ).toFixed(2)}.\n\n`;
      // textAvailables += `Valor total: *R$${parseFloat(
      //   totalAvailables * 2.5 + (meatPizza + chickenPizza + cheesePizza) * 3.5
      // ).toFixed(2)}*.`;
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
        <h4>{backup[index].name}</h4>
        <div style={{ display: 'flex' }}>
          <Slider
            defaultValue={item}
            onAfterChange={(value) => onChangeValue(value, index)}
            style={{ flex: 1 }}
            min={0}
            max={index === 5 || index === 1 ? 30 : 20}
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

    // elements.push(
    //   <div key='meat_pizza_item'>
    //     <h4>Pizza de calabresa</h4>
    //     <div style={{ display: 'flex' }}>
    //       <Slider
    //         defaultValue={meatPizza}
    //         onAfterChange={(value) => setMeatPizza(value)}
    //         style={{ flex: 1 }}
    //         min={0}
    //         max={20}
    //       />
    //       <InputNumber
    //         defaultValue={meatPizza}
    //         style={{
    //           margin: '0 0px 0px 16px',
    //         }}
    //         onChange={(value) => setMeatPizza(value)}
    //       />
    //     </div>
    //   </div>
    // );

    // elements.push(
    //   <div key='chicken_pizza_item'>
    //     <h4>Pizza de frango</h4>
    //     <div style={{ display: 'flex' }}>
    //       <Slider
    //         defaultValue={chickenPizza}
    //         onAfterChange={(value) => setChickenPizza(value)}
    //         style={{ flex: 1 }}
    //         min={0}
    //         max={20}
    //       />
    //       <InputNumber
    //         defaultValue={chickenPizza}
    //         style={{
    //           margin: '0 0px 0px 16px',
    //         }}
    //         onChange={(value) => setChickenPizza(value)}
    //       />
    //     </div>
    //   </div>
    // );

    // elements.push(
    //   <div key='cheese_pizza_item'>
    //     <h4>Pizza de mussarela</h4>
    //     <div style={{ display: 'flex' }}>
    //       <Slider
    //         defaultValue={cheesePizza}
    //         onAfterChange={(value) => setCheesePizza(value)}
    //         style={{ flex: 1 }}
    //         min={0}
    //         max={20}
    //       />
    //       <InputNumber
    //         defaultValue={cheesePizza}
    //         style={{
    //           margin: '0 0px 0px 16px',
    //         }}
    //         onChange={(value) => setCheesePizza(value)}
    //       />
    //     </div>
    //   </div>
    // );

    return elements;
  };

  const RenderButton = ({ onClick, label, type }) => (
    <Button
      type={type || 'primary'}
      style={{ height: '48px', marginTop: 20 }}
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
