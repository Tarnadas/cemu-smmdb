import React    from 'react';
import { connect } from 'react-redux';

import LoadSaveView from '../components/LoadSaveView';
import SaveView from '../components/SaveView';

class MainView extends React.Component {
    render() {
        return (
            !this.props.save.saveData ? (
                <div>
                    <LoadSaveView />
                </div>
            ) : (
                <div>
                    <SaveView />
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