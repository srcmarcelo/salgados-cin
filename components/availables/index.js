import React from 'react';
import { List } from 'antd';
import data from '../../mocks/availables.json';
import Image from 'next/image';

export default function AvailablesList() {
  const RenderList = ({data}) => {
    return (
      <List
        itemLayout='vertical'
        size='small'
        dataSource={data}
        renderItem={(item) => (
          <List.Item
            key={item.name}
            // actions={[
            //   <IconText icon={StarOutlined} text="156" key="list-vertical-star-o" />,
            //   <IconText icon={LikeOutlined} text="156" key="list-vertical-like-o" />,
            //   <IconText icon={MessageOutlined} text="2" key="list-vertical-message" />,
            // ]}
            // extra={
            //   <Image
            //     width={272}
            //     height={272}
            //     alt='logo'
            //     src='https://gw.alipayobjects.com/zos/rmsportal/mqaQswcyDLcXyDKnZfES.png'
            //   />
            // }
          >
            <List.Item.Meta
              title={item.name}
              description={`Disponiveis: ${item.available}`}
              style={{ listStyleType: 'none' }}
            />
            {`Sabor: ${item.type}`}
          </List.Item>
        )}
      />
    );
  };

  return (
    <div style={{ display: 'flex' }}>
      <RenderList data={data.filter((value) => value.type === 'frango')} />
      <RenderList data={data.filter((value) => value.type === 'queijo')} />
      <RenderList data={data.filter((value) => value.type === 'misto')} />
      <RenderList data={data.filter((value) => value.type === 'salsicha')} />
      <RenderList data={data.filter((value) => value.type === 'carne')} />
    </div>
  );
}
