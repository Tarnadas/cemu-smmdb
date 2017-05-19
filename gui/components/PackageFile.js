import React from 'react';
import ReactCSS from 'reactcss';

export default class PackageFile extends React.Component {
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
        this.props.onClick(this.props.course, this.props.courseId)
    }
    render() {
        const styles = ReactCSS({
            'default': {
                li: {
                    display: 'inline-block',
                    margin: '20px 0 0 20px',
                    width: '180px',
                    height: '160px',
                    backgroundColor: '#a0a0af',
                    background: !!this.props.isAdded ? '#33cc33' : '#a0a0af',
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
                },
                img: {
                    width: '160px',
                    height: '120px',
                    backgroundColor: '#323245'
                },
                divTitle: {
                    margin: '10px 0 0 10px',
                    backgroundColor: '#e5e5ef',
                    width: '140px',
                    height: '30px',
                    lineHeight: '30px',
                    overflow: 'hidden',
                    color: '#000',
                    padding: '0 10px'
                },
                divScroll: {
                    animation: 'scroll 4s linear infinite',
                    width: '400px',
                    height: '30px',
                    lineHeight: '30px',
                    display: 'block',
                    position: 'relative'
                },
                divScrollPaused: {
                    width: '400px',
                    height: '30px',
                    lineHeight: '30px',
                    display: 'block',
                    position: 'relative'
                }
            }
        });
        return (
            <li style={styles.li} onMouseEnter={this.mouseEnter} onMouseLeave={this.mouseLeave} onClick={this.onClick}>
                <div style={styles.divCrop}>
                    <img style={styles.img} src={`${this.props.course.path}/thumbnail1.jpg`} />
                </div>
                <div style={styles.divTitle}>
                    <div style={this.state.hover ? styles.divScroll : styles.divScrollPaused}>
                        {this.props.course.title}
                    </div>
                </div>
            </li>
        )
    }
}