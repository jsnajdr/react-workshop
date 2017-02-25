import React, { Component } from 'react';
import request from 'superagent';
import './App.css';

const repoUrl = (user, repo) => `https://api.github.com/repos/${user}/${repo}/commits`;

class AppController extends Component {
    state = {}

    onLoad = () => {
        this.setState({ loading: true });

        request.get(repoUrl("mozilla", "gecko-dev"))
            .then(res => {
                this.setState({
                    loading: false,
                    error: false,
                    commits: res.body
                });
            })
            .catch(err => {
                this.setState({
                    loading: false,
                    error: err.message,
                    commits: null,
                });
            });
    }

    render() {
        const { loading, error, commits } = this.state;

        return (
            <AppComponent
                loading={loading}
                error={error}
                commits={commits}
                onLoad={this.onLoad}
            />
        );
    }
}

class AppComponent extends Component {
    render() {
        const { loading, error, commits, onLoad } = this.props;

        return (
            <div className="App">
                <button onClick={onLoad} disabled={loading}>Load</button>
                { error && <div className="alert">{ error }</div> }
                { loading && <div className="loading">loading...</div> }
                { commits && <pre>{ JSON.stringify(commits, null, 2) }</pre> }
            </div>
        );
    }
}

export default AppController;
