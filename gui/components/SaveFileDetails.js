import React from 'react';
import ReactCSS from 'reactcss';

export default class SaveFileDetails extends React.Component {
    render() {
        const styles = ReactCSS({
            'default': {
                divHide: {
                    display: 'none'
                },
                div: {
                    margin: 'auto',
                    position: 'absolute',
                    top: '0', right: '0', bottom: '0', left: '0',
                    width: 'calc(100% - 220px)',
                    height: 'calc(100% - 180px)',
                    backgroundColor: '#0d633d',
                    border: '12px solid #42c074',
                    zIndex: '100'
                },
                line: {
                    width: '100%',
                    height: '2px',
                    backgroundColor: '#00452a'
                },
                header: {
                    height: '40px',
                    lineHeight: '40px',
                    color: '#fff',
                    fontSize: '18px',
                    display: 'inline-block',
                    margin: '0 10px'
                },
                cancel: {
                    float: 'right',
                    margin: '4px',
                    width: '32px',
                    height: '32px',
                    boxSizing: 'border-box',
                    borderRadius: '3px',
                    backgroundColor: '#45b46a',
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
            <div style={this.props.display ? styles.div : styles.divHide}>
                <div style={styles.header}>
                    {!!this.props.course && `${this.props.course.title} by ${this.props.course.maker}`}
                </div>
                <div style={styles.cancel} onClick={this.props.onClick}>
                    <img style={styles.cancelImg} src="../assets/images/cancel.svg" />
                </div>
                <div style={styles.line} />
            </div>
        )
    }
}