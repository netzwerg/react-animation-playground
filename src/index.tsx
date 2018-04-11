import * as React from 'react';
import * as ReactDOM from 'react-dom';
import registerServiceWorker from './registerServiceWorker';
import './index.css';
import { RootState } from './types';
import { Provider } from 'react-redux';
import { reducer } from './reducers';
import { applyMiddleware, createStore } from 'redux';
import { updateItem } from './actions';
import App from './containers/App';

const initialState = {
    item: {
        id: 'demo-item',
        row: 0,
        column: 0
    }
};

const logger = require('redux-logger').createLogger();

const store = createStore<RootState>(
    reducer,
    initialState,
    applyMiddleware(logger)
);

let itemStateIndex = 0;

setInterval(() => {
    const itemStates = [
        {
            id: 'demo-item',
            row: 0,
            column: 0
        },
        {
            id: 'demo-item',
            row: 0,
            column: 1
        },
        {
            id: 'demo-item',
            row: 0,
            column: 2
        },
        {
            id: 'demo-item',
            row: 1,
            column: 0
        },
        {
            id: 'demo-item',
            row: 1,
            column: 1
        },
        {
            id: 'demo-item',
            row: 1,
            column: 2
        }
    ];

    const newItem = itemStates[itemStateIndex++ % itemStates.length];
    store.dispatch(updateItem(newItem));
},          1000);

ReactDOM.render(
    <Provider store={store}>
        <App/>
    </Provider>,
    document.getElementById('root') as HTMLElement
);

registerServiceWorker();
