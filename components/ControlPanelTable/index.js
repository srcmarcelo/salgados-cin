/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import { Button, Card, Spin } from 'antd';
import Image from 'next/image';
import styles from '../../styles/Home.module.css';
import { useState } from 'react';
import { MinusCircleOutlined, PlusCircleOutlined } from '@ant-design/icons';

export default function ControlPanelTable(props) {
  const { Meta } = Card;
  const { availables, soda, openOrderModal, mode } = props;
  const [isShown, setIsShown] = useState('');

  const RenderList = ({ data }) => {
    const components = data.map((item, index) => (
      <Card
        hoverable
        key={`${item.name}_${index}`}
        style={{
          width: 240,
          margin: '10px 0px',
          border: item.available === 0 && '2px solid red',
          backgroundColor: item.available === 0 && 'red',
        }}
        onMouseEnter={() => setIsShown(item.name)}
        onMouseLeave={() => setIsShown('')}
        cover={<Image alt={item.name} src={item.media} />}
        onClick={() => {
          props.onClick(availables.indexOf(item));
          setIsShown('');
        }}
      >
        {isShown && item.name === isShown && (
          <div
            style={{
              position: 'absolute',
              top: 0,
              bottom: 0,
              left: 0,
              right: 0,
              backgroundColor: 'rgba(0, 0, 0, 0.4)',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            {mode === 'Vender' ? (
              <MinusCircleOutlined
                style={{ fontSize: '100px', color: ' rgb(184, 184, 27)' }}
              />
            ) : (
              <PlusCircleOutlined
                style={{ fontSize: '100px', color: 'rgb(51, 141, 37)' }}
              />
            )}
          </div>
        )}
        <Meta
          title={
            <h3
              style={{ margin: '4px', fontSize: '0.9rem', fontWeight: 'bold' }}
            >
              {item.name}
            </h3>
          }
          description={`${item.available} unidades - ${
            props.booking[item.name] || 0
          } dentro`}
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

  const RenderSodaList = ({ data }) => {
    const components = data.map((item, index) => (
      <Card
        hoverable
        key={`${item.name}_${index}`}
        style={{
          width: 225,
          margin: '10px 20px',
          border: item.available === 0 && '2px solid red',
          backgroundColor: item.available === 0 && 'red',
        }}
        onMouseEnter={() => setIsShown(item.name)}
        onMouseLeave={() => setIsShown('')}
        onClick={() => {
          props.onClickSoda(soda.indexOf(item));
          setIsShown('');
        }}
        cover={<Image alt={item.name} src={item.media} />}
      >
        {isShown && item.name === isShown && (
          <div
            style={{
              position: 'absolute',
              top: 0,
              bottom: 0,
              left: 0,
              right: 0,
              backgroundColor: 'rgba(0, 0, 0, 0.4)',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            {mode === 'Vender' ? (
              <MinusCircleOutlined
                style={{ fontSize: '100px', color: 'rgb(184, 184, 27)' }}
              />
            ) : (
              <PlusCircleOutlined
                style={{ fontSize: '100px', color: 'rgb(51, 141, 37)' }}
              />
            )}
          </div>
        )}
        <Meta
          title={
            <h3
              style={{ margin: '4px', fontSize: '0.9rem', fontWeight: 'bold' }}
            >
              {item.name}
            </h3>
          }
          description={`${item.available} unidades - ${
            props.booking[item.name] || 0
          } dentro`}
        />
      </Card>
    ));

    return components;
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Button type='primary' onClick={openOrderModal}>
        Fazer Encomenda
      </Button>
      {availables === [] ? (
        <Spin />
      ) : (
        <div className={styles.grid}>
          <RenderGroup types={['doce', 'misto']} />
          <RenderGroup types={['frango']} />
          <RenderGroup types={['frango2', 'carne', 'salsicha']} />
          <RenderGroup types={['queijo', 'especial']} />
        </div>
      )}
      {/* {soda === [] ? (
        <Spin />
      ) : (
        <div className={styles.grid}>
          <RenderSodaList data={soda} />
        </div>
      )} */}
    </div>
  );
}
