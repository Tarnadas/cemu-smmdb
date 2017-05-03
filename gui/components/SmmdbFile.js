import React from 'react';
import ReactCSS from 'reactcss';

export default class SaveFile extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            hover: false
        };
        this.mouseEnter = this.mouseEnter.bind(this);
        this.mouseLeave = this.mouseLeave.bind(this);
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
    render() {
        const styles = ReactCSS({
            'default': {
                li: {
                    display: 'inline-block',
                    margin: '20px 0 0 20px',
                    width: '180px',
                    height: '160px',
                    backgroundColor: '#a0a0af',
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
            <li style={styles.li} onMouseEnter={this.mouseEnter} onMouseLeave={this.mouseLeave}>
                <div style={styles.divCrop}>
                    <img style={styles.img} src={`http://smmdb.ddns.net/img/courses/thumbnails/${this.props.course.id}.pic`}/>
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