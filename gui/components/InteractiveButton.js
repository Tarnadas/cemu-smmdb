import React    from 'react';
import ReactCSS from 'reactcss';
import { connect } from 'react-redux';
import { remote } from 'electron';
import smm from 'cemu-smm';

import { addSave, removeSave, loadSave, downloadCourse, addCourse, deleteCourse } from '../actions';

const dialog = remote.dialog;

class InteractiveButton extends React.Component {
    constructor (props) {
        super(props);
        switch (props.type) {
            case 'addSave':
                this.handleClick = this.addSave.bind(this);
                break;
            case 'loadSave':
                this.handleClick = this.loadSave.bind(this);
                break;
            case 'downloadCourse':
                this.handleClick = this.downloadCourse.bind(this);
                break;
            case 'addCourse':
                this.handleClick = this.addCourse.bind(this);
                break;
            case 'deleteCourse':
                this.handleClick = this.deleteCourse.bind(this);
                break;
            default:
        }
        this.state = {
            hover: false
        };
        this.mouseEnter = this.mouseEnter.bind(this);
        this.mouseLeave = this.mouseLeave.bind(this);
        if (this.props.cancelable) {
            this.removeSave = this.removeSave.bind(this);
        }
    }
    addSave () {
        dialog.showOpenDialog({properties: ['openDirectory']}, async (path) => {
            if (!!path) {
                path = path[0];
                try {
                    let cemuSave = await smm.loadSave(path);
                    await cemuSave.reorder();
                    await cemuSave.loadCourses();
                    await cemuSave.exportJpeg();
                    this.props.dispatch(addSave(path, cemuSave));
                } catch (err) {
                    console.log(err); // TODO
                }
            }
        });
    }
    removeSave (e) {
        e.stopPropagation();
        this.props.dispatch(removeSave(this.props.path));
    }
    loadSave (e) {
        e.stopPropagation();
        (async () => {
            try {
                let cemuSave = await smm.loadSave(this.props.path);
                await cemuSave.reorder();
                await cemuSave.loadCourses();
                await cemuSave.exportJpeg();
                this.props.dispatch(loadSave(cemuSave));
            } catch (err) {
                console.log(err); // TODO
            }
        })();
    }
    downloadCourse () {
        this.props.dispatch(downloadCourse(this.props.courseId, this.props.courseName, this.props.ownerName, this.props.videoId));
    }
    addCourse () {
        this.props.dispatch(addCourse(this.props.courseId));
    }
    deleteCourse () {
        this.props.dispatch(deleteCourse(this.props.courseId));
    }
    mouseEnter() {
        this.setState({
            hover: true
        });
    }
    mouseLeave() {
        this.setState({
            hover: false
        });
    }
    render () {
        const progress = !!this.props.progress ? this.props.progress*100 : 0;
        const isDisabled = !!this.props.isDownloaded ? false : this.props.isDownloaded === false;
        const isAdded = !!this.props.isAdded;
        const styles = ReactCSS({
            'default': {
                button: {
                    display: 'inline-block',
                    margin: '0 auto 10px auto',
                    padding: '0 10px',
                    height: '40px',
                    width: '100%',
                    lineHeight: '40px',
                    background: `linear-gradient(90deg, #99ff66 ${progress}%, #ffe500 ${progress}%)`,
                    color: '#323245',
                    outline: 'none',
                    overflow: 'hidden',
                    whiteSpace: 'nowrap',
                    boxSizing: 'border-box',
                    border: '0px solid #000000',
                    borderRadius: '5px',
                    boxShadow: '1px 4px 13px 0px rgba(0,0,0,0.5)'
                },
                buttonHover: {
                    display: 'inline-block',
                    margin: '0 auto 10px auto',
                    padding: '0 10px',
                    height: '40px',
                    width: '100%',
                    lineHeight: '40px',
                    background: `linear-gradient(90deg, #99ff66 ${progress}%, #323245 ${progress}%)`,
                    color: '#fff',
                    outline: 'none',
                    overflow: 'hidden',
                    whiteSpace: 'nowrap',
                    boxSizing: 'border-box',
                    border: '0px solid #000000',
                    borderRadius: '5px',
                    boxShadow: '1px 4px 13px 0px rgba(0,0,0,0.5)',
                    cursor: 'context-menu'
                },
                buttonDisabled: {
                    display: 'inline-block',
                    margin: '0 auto 10px auto',
                    padding: '0 10px',
                    height: '40px',
                    width: '100%',
                    lineHeight: '40px',
                    backgroundColor: '#bfbfbf',
                    color: '#323245',
                    outline: 'none',
                    overflow: 'hidden',
                    whiteSpace: 'nowrap',
                    boxSizing: 'border-box',
                    border: '0px solid #000000',
                    borderRadius: '5px',
                    boxShadow: '1px 4px 13px 0px rgba(0,0,0,0.5)',
                    cursor: 'context-menu'
                },
                buttonFloat: {
                    display: 'inline-block',
                    float: 'left',
                    clear: 'both',
                    margin: '10px auto',
                    padding: '0 10px',
                    height: '40px',
                    lineHeight: '40px',
                    backgroundColor: '#ffe500',
                    color: '#323245',
                    outline: 'none',
                    overflow: 'hidden',
                    whiteSpace: 'nowrap',
                    boxSizing: 'border-box',
                    border: '0px solid #000000',
                    borderRadius: '5px',
                    boxShadow: '1px 4px 13px 0px rgba(0,0,0,0.5)'
                },
                buttonFloatHover: {
                    display: 'inline-block',
                    float: 'left',
                    clear: 'both',
                    margin: '10px auto',
                    padding: '0 10px',
                    height: '40px',
                    lineHeight: '40px',
                    backgroundColor: '#323245',
                    color: '#fff',
                    outline: 'none',
                    overflow: 'hidden',
                    whiteSpace: 'nowrap',
                    boxSizing: 'border-box',
                    border: '0px solid #000000',
                    borderRadius: '5px',
                    boxShadow: '1px 4px 13px 0px rgba(0,0,0,0.5)',
                    cursor: 'context-menu'
                },
                input: {
                    display: 'none'
                },
                cancel: {
                    float: 'right',
                    margin: '4px -6px 4px 10px',
                    width: '32px',
                    height: '32px',
                    boxSizing: 'border-box',
                    borderRadius: '3px',
                    backgroundColor: '#f4f47b',
                    cursor: 'pointer'
                },
                cancelImg: {
                    width: '24px',
                    height: '24px',
                    margin: '4px'
                },
                checked: {
                    float: 'right',
                    width: '32px',
                    height: '32px',
                    margin: '4px',
                },
                load: {
                    //display: 'inline-block',
                    float: 'left',
                    width: '32px',
                    height: '32px',
                    margin: '4px auto',
                }
            },
        });
        return (
            <div style={
                this.props.isFloat ? (
                    this.state.hover ? styles.buttonFloatHover : styles.buttonFloat
                ) : (
                    isDisabled ? (
                        styles.buttonDisabled
                    ) : (
                        this.state.hover ? styles.buttonHover : styles.button
                    )
                )
            } onClick={isDisabled ? null : this.handleClick} onMouseEnter={this.mouseEnter} onMouseLeave={this.mouseLeave}>
                {this.props.value}
                {
                    this.props.cancelable && (
                        <div style={styles.cancel} onClick={this.removeSave}>
                            <img style={styles.cancelImg} src="./assets/images/cancel_yellow.svg" />
                        </div>
                    )
                }
                {
                    (!!this.props.complete || isAdded) && (
                        <svg style={styles.checked} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 426.7 426.7">
                            <path d="M213.3 0C95.5 0 0 95.5 0 213.3s95.5 213.3 213.3 213.3c117.8 0 213.3-95.5 213.3-213.3S331.2 0 213.3 0zM174.2 322.9l-93.9-93.9 31.3-31.3 62.6 62.6 140.9-140.9 31.3 31.3L174.2 322.9z" fill={this.state.hover ? '#fff' : '#323245'} />
                        </svg>
                    )
                }
                {
                    (!this.props.complete && progress === 100) && (
                        <img style={styles.checked} src={'./assets/images/load.gif'} />
                    )
                }
            </div>
        )
    }
}
export default connect()(InteractiveButton);//{this.state.hover ? '#fff' : '#323245'}