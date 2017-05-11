import React    from 'react';
import { connect } from 'react-redux';

import LoadSaveView from '../components/LoadSaveView';
import MainView from './MainView';

class AppView extends React.Component {
    render () {
        return (
            !this.props.cemuSave ? (
                <div>
                    <LoadSaveView save={this.props.cemuSavePath} />
                </div>
            ) : (
                <div>
                    <MainView editor={this.props.editor} />
                </div>
            )
        )
    }
}
export default connect((state) => {
    let cemuSavePath = state.get('appSaveData').get('cemuSavePath');
    return {
        cemuSavePath: !cemuSavePath ? [] : cemuSavePath.toArray(),
        cemuSave: state.get('cemuSave')
    };
})(AppView);