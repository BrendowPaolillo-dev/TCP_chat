import React from 'react';

import {
    Row,
    Button,
    Upload,
    Select,
} from 'antd';

import { UploadOutlined } from '@ant-design/icons';

const { Option } = Select;

const messageSelect = (clients, onChangeDestination) => (
    <Select onSelect={onChangeDestination} defaultValue='Global' bordered={false}>
        {['Global'].concat(clients).map(client => (
            <Option value={client}>{client}</Option>
        ))}
    </Select>
);

const ChatHeader = ({ onUpload, userName, clientsConnected, onChangeDestination }) => (
    <Row style={{ width: '100%' }} justify="space-between">
        {userName}
        {messageSelect(clientsConnected, onChangeDestination)}
        <Upload
            fileList={[]}
            onChange={onUpload}
        >
            <Button icon={<UploadOutlined />}>Upload</Button>
        </Upload>
    </Row>
);

export default ChatHeader;