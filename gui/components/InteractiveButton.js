import React    from 'react';
import ReactCSS from 'reactcss';
import { connect } from 'react-redux';
import { remote } from 'electron';
import smm from 'cemu-smm';

import { addSave, removeSave, loadSave } from '../actions';

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
        const styles = ReactCSS({
            'default': {
                button: {
                    display: 'inline-block',
                    float: 'left',
                    clear: 'both',
                    margin: '10px auto',
                    width: '100%',
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
                buttonHover: {
                    display: 'inline-block',
                    float: 'left',
                    clear: 'both',
                    margin: '10px auto',
                    width: '100%',
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
                }
            },
        });
        return (
            <div style={this.state.hover ? styles.buttonHover : styles.button} onClick={this.handleClick} onMouseEnter={this.mouseEnter} onMouseLeave={this.mouseLeave}>
                {this.props.value}
                {
                    this.props.cancelable && (
                        <div style={styles.cancel} onClick={this.removeSave}>
                            <img style={styles.cancelImg} src="../assets/images/cancel_yellow.svg" />
                        </div>
                    )
                }
            </div>
        )
    }
}
export default connect()(InteractiveButton);