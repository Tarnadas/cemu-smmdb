import React from 'react';
import { connect } from 'react-redux';
import request from 'request-promise';

import ChangeViewButton from './ChangeViewButton';
import SaveFolderView from './SaveFolderView';
import SmmdbView from './SmmdbView';
import MainMenu from './MainMenu';
import { smmdbResult } from '../actions';

const SAVE_FOLDER_VIEW = 0;
const SMMDB_VIEW = 1;

class MainView extends React.Component {
    constructor (props) {
        super(props);
        this.handleClick = this.handleClick.bind(this);
        this.state = {
            currentView: SAVE_FOLDER_VIEW
        }
    }
    handleClick () {
        (async () => {
            switch (this.state.currentView) {
                case SAVE_FOLDER_VIEW:
                    let courses = await request('http://smmdb.ddns.net/api/getcourses');
                    smmdbResult(courses);
                    this.setState({
                        currentView: SMMDB_VIEW
                    });
                    break;
                case SMMDB_VIEW:
                    this.setState({
                        currentView: SAVE_FOLDER_VIEW
                    });
            }
        })();
    }
    render () {
        switch (this.state.currentView) {
            case SAVE_FOLDER_VIEW:
                return (
                    <div>
                        <ChangeViewButton onClick={this.handleClick} view={this.state.currentView} />
                        <SaveFolderView save={this.props.save} />
                        <MainMenu />
                    </div>
                );
            case SMMDB_VIEW:
                return (
                    <div>
                        <ChangeViewButton onClick={this.handleClick} view={this.state.currentView} />
                        <SmmdbView />
                        <MainMenu />
                    </div>
                )
        }
    }
}
export default connect()(MainView);