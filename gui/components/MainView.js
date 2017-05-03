import React    from 'react';
import { connect } from 'react-redux';

import LoadSaveView from '../components/LoadSaveView';
import SaveView from '../components/SaveView';

class MainView extends React.Component {
    render() {
        return (
            !this.props.save.cemuSave ? (
                <div>
                    <LoadSaveView save={this.props.save.appSaveData.cemuSavePath} />
                </div>
            ) : (
                <div>
                    <SaveView save={this.props.save.cemuSave} />
                </div>
            )
        )
    }
}
export default connect((state) => {
    return {
        save: state.save
    };
})(MainView);