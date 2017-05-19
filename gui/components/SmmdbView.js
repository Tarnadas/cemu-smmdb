import React from 'react';
import ReactCSS from 'reactcss';
import { connect } from 'react-redux';
import request from 'request-promise';

import SmmdbFile from './SmmdbFile';
import SmmdbFileDetails from './SmmdbFileDetails';
import PackageFile from "./PackageFile";
import PackageFileDetails from "./PackageFileDetails";

import { closePackage, smmdbResult } from '../actions'

class SmmdbView extends React.Component {
    constructor (props) {
        super(props);
        this.state = {
            course: null,
            slider: false
        };
        this.showSaveDetails = this.showSaveDetails.bind(this);
        this.hideSaveDetails = this.hideSaveDetails.bind(this);
        this.onOpenPackage = this.onOpenPackage.bind(this);
        this.onClosePackage = this.onClosePackage.bind(this);
        this.onSliderClick = this.onSliderClick.bind(this);
    }
    showSaveDetails (course, courseId) {
        this.setState({
            course,
            courseId
        });
    }
    hideSaveDetails () {
        this.setState({
            course: null
        });
    }
    onOpenPackage () {
        this.setState({
            course: null
        });
    }
    onClosePackage () {
        this.setState({
            course: null
        });
        this.props.dispatch(closePackage());
    }
    onSliderClick () {
        this.setState((prevState) => ({
            slider: !prevState.slider
        }));
        (async () => {
            try {
                let courses = null;
                if (this.state.slider) {
                    courses = JSON.parse(await request('http://smmdb.ddns.net/api/getcourses'));
                } else {
                    courses = JSON.parse(await request('http://smmdb.ddns.net/api/getcourses?ispackage=1'));
                }
                this.props.dispatch(smmdbResult(courses));
            } catch (err) {}
        })();
    }
    render () {
        const styles = ReactCSS({
            'default': {
                div: {
                    width: '100%',
                    height: '100vh',
                    minHeight: '100vh',
                    overflow: 'hidden',
                    //position: 'absolute',
                    //top: '0', right: '0', bottom: '0', left: '0'
                },
                ul: {
                    margin: 'auto',
                    position: 'absolute',
                    top: '60px', right: '0', bottom: '0', left: '0',
                    width: 'calc(100% - 180px)',
                    height: 'calc(100% - 140px)',
                    backgroundColor: '#07070f',
                    color: '#fff',
                    overflowY: 'scroll',
                    border: '12px solid #6e6e85',
                    listStyleType: 'none'
                },
                close: {
                    display: 'block',
                    position: 'absolute',
                    top: '20px', right: '20px',
                    width: '48px',
                    height: '48px',
                    cursor: 'pointer',
                    backgroundColor: '#ffcf00',
                    boxSizing: 'border-box',
                    border: '5px solid #fff',
                    borderRadius: '8px'
                },
                closeImg: {
                    width: '32px',
                    height: '32px',
                    margin: '4px'
                },
                switchDiv: {
                    display: 'inline-block',
                    position: 'absolute',
                    top: '20px', left: '250px',
                    fontSize: '18px',
                    height: '36px',
                    //zIndex: '11'
                },
                switchText: {
                    height: '36px',
                    lineHeight: '36px',
                    verticalAlign: 'top',
                    display: 'inline-block'
                },
                switch: {
                    width: '60px',
                    height: '34px',
                    backgroundColor: '#4252ff',
                    cursor: 'pointer',
                    borderRadius: '17px',
                    display: 'inline-block',
                    margin: '0px 10px'
                },
                sliderLeft: {
                    width: '26px',
                    height: '26px',
                    borderRadius: '13px',
                    margin: '4px',
                    backgroundColor: '#fff',
                    transition: '.4s'
                },
                sliderRight: {
                    width: '26px',
                    height: '26px',
                    borderRadius: '13px',
                    marginTop: '4px',
                    marginLeft: '30px',
                    backgroundColor: '#fff',
                    transition: '.4s'
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
                if (!!currentDownloads[course.id]) {
                    progress = currentDownloads[course.id][0] / currentDownloads[course.id][1];
                    progresses[course.id] = progress;
                }
            }
        }
        return (
            <div style={styles.div}>
                {
                    !!this.props.currentPackage ? (
                        <div>
                            <PackageFileDetails course={this.state.course} courseId={this.state.courseId} onClick={this.hideSaveDetails} isAdded={
                                !!this.state.course && !!this.props.currentSave && !!this.props.currentSave[this.state.course.id] && !!this.props.currentSave[this.state.course.id][this.state.courseId] && !!this.props.currentSave[this.state.course.id][this.state.courseId].addedToSave
                            } />
                            <ul style={styles.ul}>
                                {
                                    Array.from((function* () {
                                        for (let i = 0; i < self.props.currentPackage.length; i++) {
                                            let course = self.props.currentPackage[i];
                                            yield <PackageFile onClick={self.showSaveDetails} course={course} courseId={i} isAdded={
                                                !!self.props.currentSave && !!self.props.currentSave[course.id] && !!self.props.currentSave[course.id][i] && !!self.props.currentSave[course.id][i].addedToSave
                                            } key={i} />
                                        }
                                    })())
                                }
                            </ul>
                            <div style={styles.close} onClick={this.onClosePackage}>
                                <img style={styles.closeImg} src="./assets/images/return.svg" />
                            </div>
                        </div>
                    ) : (
                        <div>
                            <div style={styles.switchDiv}>
                                <div style={styles.switchText}>Courses</div>
                                <div style={styles.switch} onClick={this.onSliderClick}>
                                    <div style={this.state.slider ? styles.sliderRight : styles.sliderLeft} />
                                </div>
                                <div style={styles.switchText}>Packages</div>
                            </div>
                            <SmmdbFileDetails course={this.state.course} onClick={this.hideSaveDetails} onOpenPackage={this.onOpenPackage} progress={
                                !!this.state.course && !!progresses[this.state.course.id] ? progresses[this.state.course.id] : null
                            } isDownloaded={
                                !!this.state.course && !!this.props.downloads && !!this.props.downloads[this.state.course.id]
                            } isAdded={
                                !!this.state.course && !!this.props.currentSave && !!this.props.currentSave[this.state.course.id] && !!this.props.currentSave[this.state.course.id].addedToSave
                            } isPackage={
                                !!this.state.course && !!this.props.downloads && !!this.props.downloads[this.state.course.id] && this.props.downloads[this.state.course.id].isPackage
                            } modified={
                                !!this.state.course && !!this.props.downloads && !!this.props.downloads[this.state.course.id] && this.props.downloads[this.state.course.id].modified
                            } />
                            <ul style={styles.ul}>
                                {
                                    Array.from((function* () {
                                        for (let i = 0; i < self.props.order.length; i++) {
                                            let course = self.props.courses[self.props.order[i]];
                                            yield <SmmdbFile onClick={self.showSaveDetails} course={course} progress={
                                                !!progresses[course.id] && progresses[course.id]
                                            } isDownloaded={
                                                !!self.props.downloads && !!self.props.downloads[course.id]
                                            } isAdded={
                                                !!self.props.currentSave && !!self.props.currentSave[course.id] && !!self.props.currentSave[course.id].addedToSave
                                            } modified={
                                                !!self.props.downloads && !!self.props.downloads[course.id] && self.props.downloads[course.id].modified
                                            } key={course.id} />
                                        }
                                    })())
                                }
                            </ul>
                        </div>
                    )
                }
            </div>
        )
    }
}
export default connect((state) => {
    let currentDownloads = state.get('currentDownloads');
    let downloads = state.getIn(['appSaveData', 'downloads']);
    let currentSave = state.getIn(['appSaveData', 'cemuSaveData', state.get('currentSave'), 'smmdb']);
    let currentPackage = state.get('currentPackage');
    return {
        courses: state.get('smmdb').courses,
        order: state.get('smmdb').order,
        currentDownloads: !!currentDownloads ? currentDownloads.toJS() : null,
        downloads: !!downloads ? downloads.toJS() : null,
        currentSave: !!currentSave ? currentSave.toJS() : null,
        currentPackage
    }
})(SmmdbView);