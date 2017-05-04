import React from 'react';
import ReactCSS from 'reactcss';
import { connect } from 'react-redux';

import SmmdbFile from './SmmdbFile';
import SmmdbFileDetails from './SmmdbFileDetails';

class SmmdbView extends React.Component {
    constructor (props) {
        super(props);
        this.state = {
            course: null
        };
        this.showSaveDetails = this.showSaveDetails.bind(this);
        this.hideSaveDetails = this.hideSaveDetails.bind(this);
    }
    showSaveDetails (course) {
        this.setState({
            course
        })
    }
    hideSaveDetails () {
        this.setState({
            course: null
        })
    }
    render () {
        const styles = ReactCSS({
            'default': {
                div: {
                    //display: 'flex',
                    //alignItems: 'center',
                    width: '100%',
                    height: '100vh',
                    minHeight: '100vh',
                    //backgroundColor: '#f4f47b'
                },
                ul: {
                    margin: 'auto',
                    position: 'absolute',
                    top: '0', right: '0', bottom: '0', left: '0',
                    width: 'calc(100% - 180px)',
                    height: 'calc(100% - 140px)',
                    backgroundColor: '#07070f',
                    color: '#fff',
                    overflowY: 'scroll',
                    border: '12px solid #6e6e85',
                    listStyleType: 'none'
                }
            },
        });
        let self = this;
        return (
            <div style={styles.div}>
                <SmmdbFileDetails course={this.state.course} onClick={this.hideSaveDetails} />
                <ul style={styles.ul}>
                    {
                        Array.from((function* () {
                            for (let i = 0; i < self.props.order.length; i++) {
                                let course = self.props.courses[self.props.order[i]];
                                yield <SmmdbFile onClick={self.showSaveDetails} course={course} key={course.id} />
                            }
                        })())
                    }
                </ul>
            </div>
        )
    }
}
export default connect((state) => {
    return {
        courses: state.get('smmdb').courses,
        order: state.get('smmdb').order
    }
})(SmmdbView);