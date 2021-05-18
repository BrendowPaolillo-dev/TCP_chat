import React from 'react';

import {
    Row,
    Layout,
} from 'antd';

import './message.css'

const getMessage = (text, file) => {
    if (text) return text;
    return <>uma maneira de baixar o arquivo</>
};

const Message = props => {

    const {
        text,
        file,
        userName,
        messageColor,
    } = props;

    return (
        <div style={{ display: 'inline-block' }}>
            <div className="username-message">
                {userName ?? ''}
            </div>
            <div className="message" style={{ backgroundColor: messageColor ?? 'red' }} >
                {getMessage(text, file)}
            </div>
        </div>
    );
};

export default Message;