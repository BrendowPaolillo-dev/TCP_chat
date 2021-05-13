import React from 'react';

import {
    Row,
    Input,
} from 'antd';

import { MenuOutlined, MessageOutlined } from '@ant-design/icons';

import Message from './message';

import './chat.css';

const Chat = props => {
    const {
        userName,
        sendFile,
        sendMessage,
    } = props;

    const buttonSuffix = (
        <span className="link-enviar">
            Enviar
            <MessageOutlined style={{ marginLeft: 5 }}/>
        </span>
    );

    return (
        <div className="chat">
            <Row justify="space-between" className="chat-header">
                Fulano
                <MenuOutlined className="menu-icon" />
            </Row>
            <div className="chat-body">
                <Message text="Mensagem de alguém" />
            </div>
            <div className="chat-footer">
                <Input
                    suffix={buttonSuffix}
                    className="footer-input"
                    placeholder="Insira a mensagem"
                />
            </div>
        </div>
    );
};

export default Chat;