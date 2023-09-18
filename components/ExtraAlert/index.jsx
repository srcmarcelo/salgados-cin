import React from 'react';
import { Card } from 'antd';

export default function ExtraAlert({ title, content }) {
  return (
    <div
      style={{
        padding: 10,
        background: '#ececec',
        marginBottom: 30,
      }}
    >
      <Card
        title={title}
        size='small'
        bordered={false}
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          width: 350,
          minHeight: 130,
        }}
      >
        <p
          style={{
            margin: 0,
          }}
        >
          {content}
        </p>
      </Card>
    </div>
  );
}
