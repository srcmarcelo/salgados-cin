/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import { Button, Card, Spin } from 'antd';
import Image from 'next/image';
import styles from '../../styles/Home.module.css';

export default function ControlPanelTable(props) {
  const { Meta } = Card;
  const { availables, soda, openOrderModal } = props;

  const RenderList = ({ data }) => {
    const components = data.map((item, index) => (
      <Card
        hoverable
        key={`${item.type}_${index}`}
        style={{
          width: 240,
          margin: '10px 0px',
          border: item.available === 0 && '2px solid red',
          backgroundColor: item.available === 0 && 'red',
        }}
        cover={<Image alt={item.name} src={item.media} />}
        onClick={() => props.onClick(availables.indexOf(item))}
      >
        <Meta
          title={
            <h3
              style={{ margin: '4px', fontSize: '0.9rem', fontWeight: 'bold' }}
            >
              {item.name}
            </h3>
          }
          description={`${item.available} unidades - ${props.booking[item.name] || 0} dentro`}
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
        key={`${item.type}_${index}`}
        style={{
          width: 225,
          margin: '10px 20px',
          border: item.available === 0 && '2px solid red',
          backgroundColor: item.available === 0 && 'red',
        }}
        onClick={() => props.onClickSoda(soda.indexOf(item))}
        cover={<Image alt={item.type} src={item.media} />}
      >
        <Meta
          title={
            <h3
              style={{ margin: '4px', fontSize: '0.9rem', fontWeight: 'bold' }}
            >
              {item.type}
            </h3>
          }
          description={`Disponiveis: ${item.available} unidades`}
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
          <RenderGroup types={['queijo']} />
        </div>
      )}
      {soda === [] ? (
        <Spin />
      ) : (
        <div className={styles.grid}>
          <RenderSodaList data={soda} />
        </div>
      )}
    </div>
  );
}
