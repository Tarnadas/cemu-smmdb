import React from 'react';
import ReactCSS from 'reactcss';
import { remote } from 'electron';
import SaveFile from "./SaveFile";

export default class SaveFolderView extends React.Component {
    constructor (props) {
        super(props);
        this.state = {
            courseNames: []
        };
        for (let i = 0; i < 120; i++) {
            this.state.courseNames.push(`course${i.pad(3)}`);
        }
    }
    render () {
        const courses = this.props.save.courses;
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
                            for (let i = 0; i < 120; i++) {
                                yield <SaveFile course={courses[self.state.courseNames[i]]} key={self.state.courseNames[i]} />
                            }
                        })())
                    }
                </ul>
            </div>
        )
    }
}

Number.prototype.pad = function(size) {
    let s = String(this);
    while (s.length < (size || 2)) {s = "0" + s;}
    return s;
};