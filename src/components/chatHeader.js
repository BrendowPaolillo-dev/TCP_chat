import React from 'react';

import { Row, Select } from 'antd';

import { MenuOutlined } from '@ant-design/icons';

const { Option } = Select;

const messageSelect = (clients, onChangeDestination) => (
    <Select onSelect={onChangeDestination} defaultValue='Global' bordered={false}>
        {['Global'].concat(clients).map(client => (
            <Option value={client}>{client}</Option>
        ))}
    </Select>
);

const ChatHeader = ({ userName, clientsConnected, onChangeDestination }) => (
    <Row style={{ width: '100%' }} justify="space-between">
        {userName}
        {messageSelect(clientsConnected, onChangeDestination)}
        <MenuOutlined className="menu-icon" />
    </Row>
);

export default ChatHeader;