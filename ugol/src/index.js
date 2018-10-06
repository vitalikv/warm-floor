import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { AppContainer } from 'react-hot-loader'

import App from './containers/App';
import configureStore from './store';

import './css/style.css';

const store = configureStore();


ReactDOM.render(
    <Provider store={store}>
        <AppContainer>
            <App />
        </AppContainer>
    </Provider>,
    document.getElementById('root')
);


if (module.hot) {
    module.hot.accept('./containers/App', () => { ReactDOM.render(
        <Provider store={store}>
            <AppContainer>
                <App />
            </AppContainer>
        </Provider>,
        document.getElementById('root')
    ); })
}