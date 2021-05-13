import React from 'react';

import {
    Row,
    Layout,
} from 'antd';

const { Header, Content } = Layout;

const MainLayout = props => {

    const {
        children,
        ...otherProps
    } = props;

    return (
        <Layout style={{ height: '100%' }} {...otherProps}>
            <Header>
                <Row justify="center" style={{ width: '100%' }}>
                    <h1 style={{ color: 'white' }}>
                        Chat
                    </h1>
                </Row>
            </Header>
            <Content
                style={{
                    padding: 24,
                    height: 1080,
            }}>
                {children}
            </Content>
        </Layout>
    );
};

export default MainLayout;