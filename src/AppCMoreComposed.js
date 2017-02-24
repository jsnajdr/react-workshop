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

const AppComponent = ({ loading, error, commits, onLoad }) => (
    <div className="App">
        <button onClick={onLoad} disabled={loading}>Load</button>
        <ErrorMessage error={error} />
        <LoadingIndicator loading={loading} />
        { commits && <CommitList commits={commits} /> }
    </div>
);

const ErrorMessage = ({ error }) => (
    error ? <div className="alert">{ error }</div> : null
);

const LoadingIndicator = ({ loading }) => (
    loading ? <div className="loading">loading...</div> : null
);

const CommitList = ({ commits }) => (
    <div>
    {
        commits.map(commit => (
            <Commit key={commit.sha} commit={commit} />
        ))
    }
    </div>
);

const Commit = ({ commit }) => (
    <div className="commit">
        <div>SHA: { commit.sha }</div>
        <div>Message: { commit.commit.message }</div>
        <div>Author: {commit.commit.author.name }</div>
    </div>
);

export default AppController;
