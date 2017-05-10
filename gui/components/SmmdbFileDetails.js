import React from 'react';
import ReactCSS from 'reactcss';

import InteractiveButton from './InteractiveButton';

export default class SmmdbFileDetails extends React.Component {
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
                        {`${this.props.course.title} by ${this.props.course.ownername}`}
                    </div>
                    <div style={styles.cancel} onClick={this.props.onClick}>
                        <img style={styles.cancelImg} src="./assets/images/cancel.svg" />
                    </div>
                    <div style={styles.line} />
                    <div style={styles.body}>
                        {
                            this.state.error ? (
                                <div style={styles.bodyImgDiv}>
                                    <img style={styles.bodyImg} src={'./assets/images/icon_large.png'} />
                                </div>
                            ) : (
                                !!this.props.course.videoid ? (
                                    <iframe style={styles.bodyImgDiv} src={`http://www.youtube.com/embed/${this.props.course.videoid}?disablekb=1&amp;iv_load_policy=3&amp;rel=0&amp;showinfo=0`} frameBorder="0" allowFullScreen />
                                ) : (
                                    <div style={styles.bodyImgDiv}>
                                        <img onError={this.onError} style={styles.bodyImg} src={`http://smmdb.ddns.net/img/courses/thumbnails/${this.props.course.id}.pic`} />
                                    </div>
                                )
                            )
                        }
                        <div style={styles.navigation}>
                            <InteractiveButton type="downloadCourse" value="Download" progress={this.props.progress} complete={this.props.isDownloaded} courseId={this.props.course.id} courseName={this.props.course.title} ownerName={this.props.course.ownername} videoId={this.props.course.videoid} />
                            <InteractiveButton type="addCourse" value="Add Course to Save" progress={this.props.progressAdd} courseId={this.props.course.id} isDownloaded={this.props.isDownloaded} isAdded={this.props.isAdded} />
                        </div>
                    </div>
                    <div style={styles.line} />
                    <div style={styles.footer}>
                        <img onError={this.onErrorThumbnail} style={styles.footerImg} src={
                            this.state.errorThumbnail ? (
                                './assets/images/not_found.png'
                            ) : (
                                `http://smmdb.ddns.net/img/courses/thumbnails/${this.props.course.id}.pic`
                            )
                        } />
                    </div>
                </div>
            ) : (
                <div style={styles.divHide} />
            )
        )
    }
}