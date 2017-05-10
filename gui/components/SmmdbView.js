import React from 'react';
import ReactCSS from 'reactcss';
import { connect } from 'react-redux';

import SmmdbFile from './SmmdbFile';
import SmmdbFileDetails from './SmmdbFileDetails';

class SmmdbView extends React.Component {
    constructor (props) {
        super(props);
        this.state = {
            course: null
        };
        this.showSaveDetails = this.showSaveDetails.bind(this);
        this.hideSaveDetails = this.hideSaveDetails.bind(this);
    }
    showSaveDetails (course) {
        this.setState({
            course
        })
    }
    hideSaveDetails () {
        this.setState({
            course: null
        })
    }
    render () {
        const styles = ReactCSS({
            'default': {
                div: {
                    width: '100%',
                    height: '100vh',
                    minHeight: '100vh',
                },
                ul: {
                    margin: 'auto',
                    position: 'absolute',
                    top: '0', right: '0', bottom: '0', left: '0',
                    width: 'calc(100% - 180px)',
                    height: 'calc(100% - 140px)',
                    backgroundColor: '#07070f',
                    color: '#fff',
                    overflowY: 'scroll',
                    border: '12px solid #6e6e85',
                    listStyleType: 'none'
                }
            },
        });
        let self = this;
        let currentDownloads = this.props.currentDownloads;
        let progresses = {};
        if (!!currentDownloads && !!this.props.courses) {
            for (let i = 0; i < this.props.order.length; i++) {
                let course = this.props.courses[this.props.order[i]];
                let progress;
                if (!!currentDownloads[+course.id]) {
                    progress = currentDownloads[+course.id][0] / currentDownloads[+course.id][1];
                    progresses[+course.id] = progress;
                }
            }
        }
        return (
            <div style={styles.div}>
                <SmmdbFileDetails course={this.state.course} onClick={this.hideSaveDetails} progress={
                    !!this.state.course && !!progresses[+this.state.course.id] ? progresses[+this.state.course.id] : null
                } isDownloaded={
                    !!this.state.course && !!this.props.downloads && this.props.downloads.includes(this.state.course.id)
                } isAdded={
                    !!this.state.course && !!this.props.addedToSave && this.props.addedToSave.includes(this.state.course.id)
                } />
                <ul style={styles.ul}>
                    {
                        Array.from((function* () {
                            for (let i = 0; i < self.props.order.length; i++) {
                                let course = self.props.courses[self.props.order[i]];
                                yield <SmmdbFile onClick={self.showSaveDetails} course={course} progress={
                                    !!progresses[+course.id] && progresses[+course.id]
                                } isDownloaded={
                                    !!self.props.downloads && self.props.downloads.includes(course.id)
                                } isAdded={
                                    !!self.props.addedToSave && self.props.addedToSave.includes(course.id)
                                } key={course.id} />
                            }
                        })())
                    }
                </ul>
            </div>
        )
    }
}
export default connect((state) => {
    let currentDownloads = state.get('currentDownloads');
    let downloads = state.get('downloads');
    let addedToSave = state.get('addedToSave');
    return {
        courses: state.get('smmdb').courses,
        order: state.get('smmdb').order,
        currentDownloads: !!currentDownloads ? currentDownloads.toJS() : null,
        downloads: !!downloads ? downloads.toJS() : null,
        addedToSave: !!addedToSave ? addedToSave.toJS() : null
    }
})(SmmdbView);