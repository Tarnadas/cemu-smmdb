import React    from 'react';
import ReactCSS from 'reactcss';
import { connect } from 'react-redux';
import { remote } from 'electron';
import smm from 'cemu-smm';

import { addSave, loadSave } from '../actions';

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
    loadSave () {
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
                    cursor: 'pointer',
                    outline: 'none',
                    overflow: 'hidden',
                    whiteSpace: 'nowrap',
                    boxSizing: 'border-box',
                    border: '0px solid #000000',
                    borderRadius: '5px',
                    boxShadow: '1px 4px 13px 0px rgba(0,0,0,0.5)'
                },
                input: {
                    display: 'none'
                }
            },
        });
        return (
            <div style={styles.button} onClick={this.handleClick}>
                {this.props.value}
            </div>
        )
    }
}
export default connect()(InteractiveButton);