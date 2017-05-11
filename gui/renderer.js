import React    from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import { remote } from 'electron';

import AppView from './components/AppView';
import mainApp  from './reducers';
import saveFileMiddleware from './util/SaveFileMiddleware';
import SaveFileEditor from './util/SaveFileEditor';

(async () => {
    const save = remote.getGlobal('save');
    const saveFileEditor = new SaveFileEditor(save.appSavePath);
    const store = createStore(mainApp, applyMiddleware(saveFileMiddleware(saveFileEditor)));

    ReactDOM.render(
        <Provider store={store}>
            <AppView editor={saveFileEditor} />
        </Provider>,
        document.getElementById('root')
    );
})();