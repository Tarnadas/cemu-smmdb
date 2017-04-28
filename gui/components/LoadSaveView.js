import React    from 'react';

import InteractiveButton from './InteractiveButton';

export default class LoadSaveView extends React.Component {
    render () {
        return <InteractiveButton type="loadSave" value="Please select your Cemu SMM folder" width="300px"/>;
    }
}