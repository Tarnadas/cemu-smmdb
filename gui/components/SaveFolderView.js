import React from 'react';
import ReactCSS from 'reactcss';
import { connect } from 'react-redux';
import { remote } from 'electron';

import SaveFile from "./SaveFile";
import SaveFileDetails from "./SaveFileDetails";

class SaveFolderView extends React.Component {
    constructor (props) {
        super(props);
        this.state = {
            courseNames: [],
            course: null
        };
        for (let i = 0; i < 120; i++) {
            this.state.courseNames.push(`course${i.pad(3)}`);
        }
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
    componentWillReceiveProps (nextProps) {
        if (!!this.state.course && !nextProps.courses[`course${this.state.course.id.pad(3)}`]) {
            this.setState({
                course: null
            })
        }
    }
    componentWillMount () {
        if (!!this.props.save) {
            this.props.editor.setCemuSave(this.props.save);
        }
    }
    render () {
        const courses = this.props.courses;
        const styles = ReactCSS({
            'default': {
                div: {
                    width: '100%',
                    height: '100vh',
                    minHeight: '100vh'
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
                <SaveFileDetails course={this.state.course} onClick={this.hideSaveDetails} />
                <ul style={styles.ul}>
                    {
                        Array.from((function* () {
                            for (let i = 0; i < 120; i++) {
                                let course = courses[self.state.courseNames[i]];
                                yield <SaveFile onClick={self.showSaveDetails} course={course} key={self.state.courseNames[i]} />
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
        //save: !!state.get('cemuSave') ? state.get('cemuSave').toJS() : null
        save: state.get('cemuSave'),
        courses: JSON.parse(JSON.stringify(state.get('cemuSave').courses))
    };
})(SaveFolderView);

Number.prototype.pad = function(size) {
    let s = String(this);
    while (s.length < (size || 2)) {s = "0" + s;}
    return s;
};