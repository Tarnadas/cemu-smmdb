import React    from 'react';
import ReactCSS from 'reactcss';

import SaveFolderView from './SaveFolderView';
import MainMenu from './MainMenu';

export default class SaveView extends React.Component {
    render() {
        return (
            <div>
                <SaveFolderView save={this.props.save} />
                <MainMenu/>
            </div>
        )
    }
}