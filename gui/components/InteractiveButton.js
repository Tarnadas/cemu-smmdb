import React    from 'react';
import ReactCSS from 'reactcss';
import { connect } from 'react-redux';
import { remote } from 'electron';
import smm from 'cemu-smm';

import setSave from '../actions';

const dialog = remote.dialog;

class InteractiveButton extends React.Component {
    constructor (props) {
        super(props);
        if (props.type === 'loadSave') {
            this.handleClick = this.loadSave.bind(this);
        }
    }
    loadSave () {
        dialog.showOpenDialog({properties: ['openDirectory']}, async (path) => {
            if (!!path) {
                path = path[0];
                try {
                    let cemuSave = await smm.loadSave(path);
                    await cemuSave.reorder();
                    await cemuSave.exportJpeg();
                    this.props.dispatch(setSave(path, cemuSave));
                } catch (err) {
                    console.log(err); // TODO
                }
            }
        });
    }
    render () {
        const styles = ReactCSS({
            'default': {
                button: {
                    position: 'absolute',
                    top: 0, left: 0, bottom: 0, right: 0,
                    margin: 'auto',
                    width: this.props.width,
                    height: '40px',
                    lineHeight: '40px',
                    backgroundColor: '#ffe500',
                    textAlign: 'center',
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