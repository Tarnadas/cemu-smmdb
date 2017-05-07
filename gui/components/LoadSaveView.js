import React    from 'react';
import ReactCSS from 'reactcss';

import InteractiveButton from './InteractiveButton';

export default class LoadSaveView extends React.Component {
    render () {
        const styles = ReactCSS({
            'default': {
                center: {
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translateY(-50%) translateX(-50%)',
                    textAlign: 'center'
                }
            },
        });
        let self = this;
        return (
            !this.props.save || this.props.save.length === 0 ? (
                <div style={styles.center}>
                    <InteractiveButton type="addSave" isFLoat value="Please select your Cemu SMM folder" />
                </div>
            ) : (
                <div style={styles.center}>
                    {
                        Array.from((function*() {
                            for (let i = 0; i < self.props.save.length; i++) {
                                yield (
                                    <InteractiveButton type="loadSave" cancelable isFloat value={(() => {
                                        let savePath = self.props.save[i];
                                        let split = savePath.split("\\");
                                        return `Load ${split[split.length - 4]} ${split[split.length - 1]}`;
                                    })()} path={self.props.save[i]} key={i} />
                                )
                            }
                        })())
                    }
                    <InteractiveButton type="addSave" isFloat value="Load another Cemu SMM folder" />
                </div>
            )
        );
    }
}