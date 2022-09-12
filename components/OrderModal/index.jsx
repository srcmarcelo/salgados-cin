import React, { useState, useEffect } from 'react';
import { Button, InputNumber, Radio, Slider } from 'antd';
import foodMock from '../../mocks/availables.json';
import { Modal } from 'antd';

export default function OrderModal(props) {
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
    let total = 0;
    orderList.forEach((item) => (total += parseInt(item)));
    setTotalAvailables(total);
  }, [orderList, didRetry]);

  useEffect(() => {
    if (copyText) {
      const nextLine = [1, 5, 8, 10, 12];
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
      setCopyText(false);
    }
  }, [copyText]);

  const onChangeValue = (value, index) => {
    const updatedOrderList = orderList;
    updatedOrderList[index] = value;
    setOrderList(updatedOrderList);
    setDidRetry(!didRetry);
  };

  const FormList = ({ data }) => {
    const elements = data.map((item, index) => (
      <div key={`order_${item.type}_${index}`}>
        <h4>{foodMock[index].name}</h4>
        <div style={{ display: 'flex' }}>
          <Slider
            defaultValue={item}
            onChange={(value) => onChangeValue(value, index)}
            style={{ flex: 1 }}
            min={0}
            max={index > 9 ? 10 : index < 2 ? 40 : 20}
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
