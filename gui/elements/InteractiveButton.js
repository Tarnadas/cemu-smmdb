import React    from 'react';
import ReactCSS from 'reactcss';

const {dialog} = require('electron').remote;

export default class InteractiveButton extends React.Component {
    constructor (props) {
        super(props);
        if (props.type === 'loadSave') {
            this.handleClick = this.loadSave.bind(this);
            this.isInput = true;
        } else {
            this.isInput = false;
        }
    }
    loadSave () {
        dialog.showOpenDialog({properties: ['openFile']}, (path) => {
            console.log(path);
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