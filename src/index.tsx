import * as React from 'react';
import * as ReactDOM from 'react-dom';
import registerServiceWorker from './registerServiceWorker';
import './index.css';
import { RootState } from './types';
import { Provider } from 'react-redux';
import { reducer } from './reducers';
import { applyMiddleware, createStore } from 'redux';
import { updateItem } from './actions';
import { stepCount } from './constants';
import App from './containers/App';

const initialState = {
    item: {
        id: 'demo-item',
        step: 0
    }
};

const logger = require('redux-logger').createLogger();

const store = createStore<RootState>(
    reducer,
    initialState,
    applyMiddleware(logger)
);

setInterval(() => {
    const currentItem = store.getState().item;
    const newItem = {...currentItem, step: (currentItem.step + 1) % stepCount};
    store.dispatch(updateItem(newItem));
},          1000);

ReactDOM.render(
    <Provider store={store}>
        <App/>
    </Provider>,
    document.getElementById('root') as HTMLElement
);

registerServiceWorker();
