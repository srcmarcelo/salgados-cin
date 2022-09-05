/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import { Card } from 'antd';
import Image from 'next/image';
import styles from '../../styles/Home.module.css';

export default function ControlPanelTable(props) {
  const { Meta } = Card;
  const {availables} = props;

  const RenderList = ({ data }) => {
    const components = data.map((item, index) => (
      <Card
        hoverable
        key={`${item.type}_${index}`}
        style={{
          width: 240,
          margin: '10px 0px',
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
          description={`Disponiveis: ${item.available} unidades`}
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

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <h2>Disponiveis AGORA</h2>
      <div className={styles.grid}>
        <RenderGroup types={['doce', 'queijo']} />
        <RenderGroup types={['frango']} />
        <RenderGroup types={['misto', 'salsicha']} />
        <RenderGroup types={['carne']} />
      </div>
    </div>
  );
}
