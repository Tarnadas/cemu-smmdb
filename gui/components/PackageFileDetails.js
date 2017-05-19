import React from 'react';
import ReactCSS from 'reactcss';

import InteractiveButton from './InteractiveButton';

export default class PackageFileDetails extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            error: false
        };
        this.onError = this.onError.bind(this);
        this.onErrorThumbnail = this.onErrorThumbnail.bind(this);
    }
    onError (e) {
        e.preventDefault();
        this.setState({
            error: true
        });
    }
    onErrorThumbnail (e) {
        e.preventDefault();
        this.setState({
            errorThumbnail: true
        });
    }
    componentWillReceiveProps (nextProps) {
        if (nextProps.course !== this.props.course) {
            this.setState({
                error: false,
                errorThumbnail: false
            })
        }
    }
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
                    width: '760px',
                    height: '445px',
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
                    maxWidth: '700px',
                    height: '40px',
                    lineHeight: '40px',
                    color: '#fff',
                    fontSize: '18px',
                    display: 'inline-block',
                    margin: '0 10px',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden'
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
                },
                body: {
                },
                bodyImgDiv: {
                    display: 'inline-block',
                    verticalAlign: 'top',
                    //display: 'table-cell',
                    margin: '20px',
                    width: '320px',
                    height: '240px',
                    overflow: 'hidden',
                    textAlign: 'center'
                },
                bodyImg: {
                    width: 'auto',
                    height: '240px'
                },
                navigation: {
                    display: 'inline-block',
                    verticalAlign: 'top',
                    //display: 'table-cell',
                    textAlign: 'center',
                    height: '240px',
                    margin: '20px',
                    width: 'calc(100% - 400px)'
                },
                footer: {
                    margin: '20px',
                    width: '720px',
                    height: '81px',
                    overflow: 'hidden',
                    textAlign: 'center'
                },
                footerImg: {
                    width: 'auto',
                    height: '81px'
                }
            },
        });
        return (
            !!this.props.course ? (
                <div style={styles.div}>
                    <div style={styles.header}>
                        {`${this.props.course.title} by ${this.props.course.maker}`}
                    </div>
                    <div style={styles.cancel} onClick={this.props.onClick}>
                        <img style={styles.cancelImg} src="./assets/images/cancel.svg" />
                    </div>
                    <div style={styles.line} />
                    <div style={styles.body}>
                        <img style={styles.bodyImg} src={`${this.props.course.path}/thumbnail1.jpg`} />
                        <div style={styles.navigation}>
                            <InteractiveButton type="addCourse" value="Add Course to Save" courseId={this.props.courseId} packageId={this.props.course.id} isAdded={this.props.isAdded} />
                        </div>
                    </div>
                    <div style={styles.line} />
                    <div style={styles.footer}>
                        <img style={styles.footerImg} src={`${this.props.course.path}/thumbnail0.jpg`} />
                    </div>
                </div>
            ) : (
                <div style={styles.divHide} />
            )
        )
    }
}