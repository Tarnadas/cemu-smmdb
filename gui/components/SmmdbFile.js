import React from 'react';
import ReactCSS from 'reactcss';

export default class SmmdbFile extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            hover: false,
            error: false
        };
        this.mouseEnter = this.mouseEnter.bind(this);
        this.mouseLeave = this.mouseLeave.bind(this);
        this.onError = this.onError.bind(this);
        this.onClick = this.onClick.bind(this);
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
    onError (e) {
        e.preventDefault();
        this.setState({
            error: true
        });
    }
    onClick () {
        this.props.onClick(this.props.course)
    }
    render() {
        const progress = this.props.isDownloaded ? 100 : (!!this.props.progress ? this.props.progress*100 : 0);
        const styles = ReactCSS({
            'default': {
                li: {
                    display: 'inline-block',
                    margin: '20px 0 0 20px',
                    width: '180px',
                    height: '160px',
                    background: !!this.props.isAdded ? ('#33cc33') : (`linear-gradient(90deg, #99ff66 ${progress}%, #a0a0af ${progress}%)`),
                    color: '#fff',
                    overflow: 'hidden',
                    cursor: 'pointer'
                },
                divCrop: {
                    margin: '10px 0 0 10px',
                    width: '160px',
                    height: '90px',
                    overflow: 'hidden',
                    display: 'inline-block',
                    backgroundColor: '#323245',
                    textAlign: 'center'
                },
                img: {
                    width: 'auto',
                    height: '120px',
                    margin: 'auto'
                },
                divTitle: {
                    margin: '5px 0 0 5px',
                    backgroundColor: '#e5e5ef',
                    width: '140px',
                    height: '40px',
                    lineHeight: '20px',
                    overflow: 'hidden',
                    color: '#000',
                    padding: '0 10px'
                },
                divScroll: {
                    animation: 'scroll 4s linear infinite',
                    width: '400px',
                    height: '20px',
                    lineHeight: '20px',
                    display: 'block',
                    position: 'relative',
                    whiteSpace: 'nowrap'
                },
                divScrollPaused: {
                    width: '400px',
                    height: '20px',
                    lineHeight: '20px',
                    display: 'block',
                    position: 'relative',
                    whiteSpace: 'nowrap'
                },
                divDetails: {
                    width: '140px',
                    height: '20px'
                },
                value: {
                    verticalAlign: 'top',
                    display: 'inline-block',
                    height: '20px',
                    lineHeight: '25px',
                    marginLeft: '4px',
                    marginRight: '8px'
                },
                imgDiv: {
                    display: 'inline-block',
                    height: '20px'
                },
                imgDetails: {
                    display: 'inline-block',
                    height: '20px',
                    width: 'auto'
                }
            }
        });
        return (
            <li style={styles.li} onMouseEnter={this.mouseEnter} onMouseLeave={this.mouseLeave} onClick={this.onClick}>
                <div style={styles.divCrop}>
                    <img style={styles.img} onError={this.onError} src={
                        this.state.error ? (
                            !this.props.course.videoid ? './assets/images/icon_large.png' : `https://img.youtube.com/vi/${this.props.course.videoid}/0.jpg`
                        ) : (
                            `http://smmdb.ddns.net/img/courses/thumbnails/${this.props.course.id}.pic`
                        )
                    }/>
                </div>
                <div style={styles.divTitle}>
                    <div style={this.state.hover ? styles.divScroll : styles.divScrollPaused}>
                        {this.props.course.title}
                    </div>
                    <div style={styles.divDetails}>
                        <div style={styles.imgDiv}>
                            <img style={styles.imgDetails} src='./assets/images/starred.png' />
                        </div>
                        <div style={styles.value}>
                            {this.props.course.stars}
                        </div>
                        <div style={styles.imgDiv}>
                            <img style={styles.imgDetails} src='./assets/images/downloads.png' />
                        </div>
                        <div style={styles.value}>
                            {this.props.course.downloads}
                        </div>
                        <div style={styles.imgDiv}>
                            <img style={styles.imgDetails} src='./assets/images/completed.png' />
                        </div>
                        <div style={styles.value}>
                            {this.props.course.completed}
                        </div>
                    </div>
                </div>
            </li>
        )

    }
}