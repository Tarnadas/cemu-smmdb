import React    from 'react'
import ReactCSS from 'reactcss'
import { connect } from 'react-redux'

import InteractiveButton from './InteractiveButton'
import { addApiKey } from '../actions'

class LoadSaveView extends React.Component {
    constructor (props) {
        super(props);
        this.state = {
            loading: false,
            showApiKey: false
        };
        this.onLoadSuccess = this.onLoadSuccess.bind(this);
        this.showApiKey = this.showApiKey.bind(this);
        this.hideApiKey = this.hideApiKey.bind(this);
        this.addApiKey = this.addApiKey.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }
    componentWillReceiveProps (nextProps) {
        if (!!nextProps.apiKey) {
            this.setState({
                apiKey: nextProps.apiKey
            })
        }
    }
    onLoadSuccess () {
        this.setState({
            loading: true
        });
    }
    showApiKey () {
        this.setState({
            showApiKey: true
        });
    }
    hideApiKey () {
        this.setState({
            showApiKey: false
        });
    }
    addApiKey () {
        if (this.state.apiKey.length === 30) {
            this.props.dispatch(addApiKey(this.state.apiKey));
        }
        this.setState({
            showApiKey: false
        });
    }
    handleChange (e) {
        let value = e.target.value;
        if (value.length > 30) {
            value = value.substr(0, 30);
        }
        this.setState({
            apiKey: value
        });
    }
    render () {
        const styles = ReactCSS({
            'default': {
                center: {
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translateY(-50%) translateX(-50%)',
                    textAlign: 'center'
                },
                text: {
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translateY(+150%) translateX(-50%)',
                    width: '100%',
                    color: '#323245',
                    textAlign: 'center'
                },
                showApiKey: {
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translateY(-350%) translateX(-50%)',
                    width: '200px'
                },
                apiKey: {
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translateY(-50%) translateX(-50%)',
                    textAlign: 'center',
                    zIndex: '100',
                    width: '500px',
                    //height: '200px',
                    backgroundColor: '#0d633d',
                    border: '12px solid #42c074'
                },
                apiKeyExplanation: {
                    width: '400px',
                    lineHeight: '20px',
                    display: 'inline-block',
                    color: '#fff',
                    margin: '10px auto',
                    padding: '0 10px'
                },
                apiKeyExplanationSmall: {
                    width: '400px',
                    lineHeight: '11px',
                    fontSize: '11px',
                    fontFamily: 'Arial, Helvetica, sans-serif',
                    display: 'inline-block',
                    color: '#fff',
                    margin: '10px auto',
                    padding: '0 10px'
                },
                apiKeyInput: {
                    width: '400px',
                    height: '30px',
                    lineHeight: '30px',
                    display: 'inline-block',
                    margin: '10px auto',
                    padding: '0 10px',
                    color: '#323245'
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
                }
            },
        });
        let self = this;
        return (
            <div>
                {
                    !this.props.save || this.props.save.length === 0 ? (
                        <div>
                            <div style={styles.center}>
                                {
                                    !this.props.apiKey && (
                                        <div style={styles.showApiKey}>
                                            <InteractiveButton type="showApiKey" value="Add API Key" onApiKeyClick={this.showApiKey} />
                                        </div>
                                    )
                                }
                                <InteractiveButton type="addSave" isFloat value="Please select your Cemu SMM folder" onLoadSuccess={this.onLoadSuccess} />
                            </div>
                            <div style={styles.text}>
                                Your SMM save folder is located at<br/>'path\to\cemu\mlc01\emulatorSave\#saveID#'
                            </div>
                        </div>
                    ) : (
                        <div style={styles.center}>
                            {
                                !this.props.apiKey && (
                                    <div style={styles.showApiKey}>
                                        <InteractiveButton type="showApiKey" value="Add API Key" onApiKeyClick={this.showApiKey} />
                                    </div>
                                )
                            }
                            {
                                Array.from((function*() {
                                    for (let i = 0; i < self.props.save.length; i++) {
                                        yield (
                                            <InteractiveButton type="loadSave" cancelable isFloat saveId={i} onLoadSuccess={self.onLoadSuccess} value={(() => {
                                                let savePath = self.props.save[i];
                                                let split = savePath.split("\\");
                                                return `Load ${split[split.length - 4]} ${split[split.length - 1]}`;
                                            })()} path={self.props.save[i]} key={i}/>
                                        )
                                    }
                                })())
                            }
                            <InteractiveButton type="addSave" isFloat value="Load another Cemu SMM folder" onLoadSuccess={this.onLoadSuccess} />
                        </div>
                    )
                }
                {
                    (this.state.loading) && (
                        <img style={styles.center} src={'./assets/images/load.gif'} />
                    )
                }
                {
                    (this.state.showApiKey) && (
                        <div style={styles.apiKey}>
                            <div style={styles.cancel} onClick={this.hideApiKey}>
                                <img style={styles.cancelImg} src="./assets/images/cancel.svg" />
                            </div>
                            <div style={styles.apiKeyExplanation}>
                                Go to <a href="http://smmdb.ddns.net" target="_blank">SMMDB</a> > Login > Profile > Show API Key
                            </div>
                            <div style={styles.apiKeyExplanationSmall}>
                                (With an API Key, you will be able to upload courses, star courses, flag courses as completed)
                            </div>
                            <input style={styles.apiKeyInput} type="text" value={!this.state.apiKey ? "" : this.state.apiKey} onChange={this.handleChange} />
                            <InteractiveButton type="addApiKey" width="400px" apiKey={this.state.apiKey} value="Save" onClick={this.addApiKey} />
                        </div>
                    )
                }
            </div>
        );
    }
}
export default connect((state) => {
    let apiKey = state.get('appSaveData').get('apiKey');
    return {
        apiKey: apiKey
    };
})(LoadSaveView);