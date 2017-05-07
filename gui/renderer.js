import React    from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import { remote } from 'electron';

import AppView from './components/AppView';
import mainApp  from './reducers';
import downloaderMiddleware from './util/DownloaderMiddleware';
import CourseDownloader from './util/CourseDownloader';

(async () => {
    const save = remote.getGlobal('save');
    const store = createStore(mainApp, applyMiddleware(downloaderMiddleware(new CourseDownloader(save.appSavePath))));

    ReactDOM.render(
        <Provider store={store}>
            <AppView />
        </Provider>,
        document.getElementById('root')
    );
})();