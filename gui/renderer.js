import React    from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux'
import { createStore } from 'redux'

import MainView from './components/MainView';
import mainApp  from './reducers';

let store = createStore(mainApp);

ReactDOM.render(
    <Provider store={store}>
        <MainView />
    </Provider>,
    document.getElementById('root')
);