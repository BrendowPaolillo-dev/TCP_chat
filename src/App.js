import React from 'react';

import Chat from './components/chat';
import Login from './pages/login';

import {
    BrowserRouter as Router,
    Switch,
    Route,
} from "react-router-dom";

const App = ({ history }) => (
    <Router>
        <Switch>
            <Route path="/chat">
                <Chat history={history} />
            </Route>
            <Route path="/">
                <Login history={history} />
            </Route>
            <Route path="/login">
                <Login history={history} />
            </Route>
        </Switch>
    </Router>
);


export default App;
