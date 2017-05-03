import React    from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux'
import { createStore } from 'redux'

import AppView from './components/AppView';
import mainApp  from './reducers';

(async () => {
    let store = createStore(mainApp);

    ReactDOM.render(
        <Provider store={store}>
            <AppView />
        </Provider>,
        document.getElementById('root')
    );
})();