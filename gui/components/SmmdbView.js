import React from 'react';
import ReactCSS from 'reactcss';
import { connect } from 'react-redux';

import SmmdbFile from './SmmdbFile';

class SmmdbView extends React.Component {
    render () {
        //const courses = this.props.save.courses;
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
                <ul style={styles.ul}>
                    {
                        Array.from((function* () {
                            for (let i = 0; i < self.props.order.length; i++) {
                                let course = self.props.courses[self.props.order[i]];
                                yield <SmmdbFile course={course} key={course.id} />
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