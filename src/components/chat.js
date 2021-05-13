import React from 'react';

import {
    Row,
    Input,
    Layout,
} from 'antd';

import { MenuOutlined, MessageOutlined } from '@ant-design/icons';

import Message from './message';

import './chat.css';

const buttonSuffix = (
    <>
        Enviar
        <MessageOutlined style={{ marginLeft: 5 }}/>
    </>
);

const Chat = props => {
    const {
        userName,
    } = props;

    return (
        <div className="chat">
            <Row justify="space-between" className="chat-header">
                usuário tal
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