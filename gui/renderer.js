import React    from 'react';
import ReactDOM from 'react-dom';

import InteractiveButton from './elements/InteractiveButton';

ReactDOM.render(
    <InteractiveButton type="loadSave" value="Please select your Cemu SMM folder" width="300px"/>,
    document.getElementById('root')
);