import React from 'react';
import ReactCSS, {hover} from 'reactcss';

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
        return !!this.props.course ? (
            <li style={styles.li} onMouseEnter={this.mouseEnter} onMouseLeave={this.mouseLeave}>
                <div style={styles.divCrop}>
                    <img style={styles.img} src={`${this.props.course.path}/thumbnail1.jpg`}/>
                </div>
                <div style={styles.divTitle}>
                    <div style={this.state.hover ? styles.divScroll : styles.divScrollPaused}>
                        {this.props.course.title}
                    </div>
                </div>
            </li>
        ) : (
            <li style={styles.li}>
                <div style={styles.divCrop} />
                <div style={styles.divTitle} />
            </li>
        )

    }
}