import React, { Component } from 'react';
import request from 'superagent';
import './App.css';

const repoUrl = (user, repo) => `https://api.github.com/repos/${user}/${repo}/commits`;

class App extends Component {
    state = {}

    onClick = () => {
        this.setState({ loading: true });

        request.get(repoUrl("mozilla", "gecko-dev"))
            .then(res => {
                this.setState({
                    loading: false,
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
            <div className="App">
                <button onClick={this.onClick} disabled={loading}>Load</button>
                { error && <div className="alert">{ error }</div> }
                { loading && <div className="loading">loading...</div> }
                { commits && <pre>{ JSON.stringify(commits, null, 2) }</pre> }
            </div>
        );
    }
}

export default App;
