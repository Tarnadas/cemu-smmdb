import React    from 'react'
import ReactCSS from 'reactcss'
import { connect } from 'react-redux'
import { remote } from 'electron'
import { loadSave as loadCemuSave } from 'cemu-smm'
import { zip } from 'cross-unzip'

import path from 'path'

import { addSave, removeSave, loadSave, downloadCourse, addCourse, deleteCourse, openPackage } from '../actions'

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
            case 'showApiKey':
                this.handleClick = this.showApiKey.bind(this);
                break;
            case 'addApiKey':
                this.handleClick = this.props.onClick;
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
        dialog.showOpenDialog({properties: ['openDirectory']}, async cemuPath => {
            if (!!cemuPath) {
                cemuPath = cemuPath[0];
                try {
                    let cemuSave = await loadCemuSave(cemuPath);
                    this.props.onLoadSuccess();
                    zip(cemuPath, `${cemuPath}_backup_${(new Date()).toISOString().slice(0,10)}.zip`, async err => {
                        if (err) throw err;
                        await cemuSave.reorder();
                        await cemuSave.loadCourses();
                        await cemuSave.exportJpeg();
                        await cemuSave.unlockAmiibos();
                        this.props.dispatch(addSave(cemuPath, cemuSave));
                    });
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
                let cemuSave = await loadCemuSave(this.props.path);
                this.props.onLoadSuccess();
                await cemuSave.reorder();
                await cemuSave.loadCourses();
                await cemuSave.exportJpeg();
                this.props.dispatch(loadSave(cemuSave, this.props.saveId));
            } catch (err) {
                console.log(err); // TODO
            }
        })();
    }
    downloadCourse () {
        if (this.props.isModified || !this.props.progress && !this.props.complete) {
            this.props.dispatch(downloadCourse(this.props.courseId, this.props.courseName, this.props.ownerName, this.props.videoId, this.props.courseType, this.props.modified));
        }
    }
    addCourse () {
        if (this.props.saveFull) return;
        if (!!this.props.isPackage) {
            this.props.dispatch(openPackage(this.props.courseId));
            this.props.onOpenPackage();
        } else {
            if (!this.props.isAdded) {
                this.props.dispatch(addCourse(this.props.courseId, this.props.packageId));
            }
        }
    }
    deleteCourse () {
        this.props.dispatch(deleteCourse(this.props.smmdbId, this.props.courseId, this.props.saveId));
    }
    showApiKey () {
        this.props.onApiKeyClick();
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
        const isModified = !!this.props.isModified;
        //const progress = !!this.props.complete ? 100 : (!!this.props.progress ? this.props.progress*100 : 0);
        const progress = !!this.props.progress ? this.props.progress*100 : 0;
        const isDisabled = !!this.props.isDownloaded ? false : this.props.isDownloaded === false;
        const isAdded = !!this.props.isAdded;
        const saveFull = this.props.type === 'addCourse' && this.props.saveFull;
        const styles = ReactCSS({
            'default': {
                button: {
                    display: 'inline-block',
                    margin: '0 auto 10px auto',
                    padding: '0 10px',
                    height: '40px',
                    width: !!this.props.width ? this.props.width : '100%',
                    lineHeight: '40px',
                    background: saveFull ? (
                        '#DF4E20'
                    ) : (
                        isModified ? (
                            `linear-gradient(90deg, #99ff66 ${progress}%, #CC7034 ${progress}%)`
                        ) : (
                            isAdded ? (
                                '#33cc33'
                            ) : (
                                !!this.props.complete ? ('#99ff66') : (`linear-gradient(90deg, #99ff66 ${progress}%, #ffe500 ${progress}%)`)
                            )
                        )
                    ),
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
                    width: !!this.props.width ? this.props.width : '100%',
                    lineHeight: '40px',
                    background: saveFull ? (
                        '#DF4E20'
                    ) : (
                        isModified ? (
                            `linear-gradient(90deg, #99ff66 ${progress}%, #323245 ${progress}%)`
                        ) : (
                            isAdded ? (
                                '#33cc33'
                            ) : (
                                !!this.props.complete ? ('#99ff66') : (`linear-gradient(90deg, #99ff66 ${progress}%, #323245 ${progress}%)`)
                            )
                        )
                    ),
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
                    width: !!this.props.width ? this.props.width : '',
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
                    width: !!this.props.width ? this.props.width : '',
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
                {
                    saveFull ? 'Your save is full' : this.props.value
                }
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
                {
                    (isModified && progress === 0) && (
                        <svg style={styles.checked} xmlns="http://www.w3.org/2000/svg" width="439" height="439" viewBox="0 0 438.5 438.5">
                            <path d="M409.1 109.2c-19.6-33.6-46.2-60.2-79.8-79.8C295.7 9.8 259.1 0 219.3 0c-39.8 0-76.5 9.8-110.1 29.4 -33.6 19.6-60.2 46.2-79.8 79.8C9.8 142.8 0 179.5 0 219.3c0 39.8 9.8 76.5 29.4 110.1 19.6 33.6 46.2 60.2 79.8 79.8 33.6 19.6 70.3 29.4 110.1 29.4s76.5-9.8 110.1-29.4c33.6-19.6 60.2-46.2 79.8-79.8 19.6-33.6 29.4-70.3 29.4-110.1C438.5 179.5 428.7 142.8 409.1 109.2zM361.4 231.8l-26 26c-3.6 3.6-7.9 5.4-12.8 5.4 -4.9 0-9.2-1.8-12.8-5.4l-54-54v143.3c0 4.9-1.8 9.2-5.4 12.8 -3.6 3.6-7.9 5.4-12.8 5.4h-36.5c-4.9 0-9.2-1.8-12.8-5.4 -3.6-3.6-5.4-7.9-5.4-12.8v-143.3l-54 54c-3.4 3.4-7.7 5.1-12.8 5.1 -5.1 0-9.4-1.7-12.8-5.1l-26-26c-3.4-3.4-5.1-7.7-5.1-12.9 0-5.1 1.7-9.4 5.1-12.8l103.4-103.4 26-26c3.4-3.4 7.7-5.1 12.8-5.1 5.1 0 9.4 1.7 12.8 5.1l26 26 103.4 103.4c3.4 3.4 5.1 7.7 5.1 12.8C366.6 224.1 364.9 228.4 361.4 231.8z" fill={this.state.hover ? '#fff' : '#323245'}/>
                        </svg>
                    )
                }
            </div>
        )
    }
}
export default connect((state) => {
    let saveFull = !!state.get('saveFull');
    return {
        saveFull
    }
})(InteractiveButton);