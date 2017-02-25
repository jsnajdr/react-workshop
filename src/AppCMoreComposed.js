import React, { Component } from 'react';
import request from 'superagent';
import './App.css';

const repoUrl = (user, repo) => `https://api.github.com/repos/${user}/${repo}/commits`;

class AppController extends Component {
    state = {}

    onLoad = () => {
        this.startLoad();

        request.get(repoUrl("mozilla", "gecko-dev"))
            .then(res => this.commitsLoaded(res.body))
            .catch(error => this.loadError(error));
    }

    startLoad() {
        this.setState({ loading: true });
    }

    commitsLoaded(commits) {
        this.setState({
            loading: false,
            error: false,
            commits
        });
    }

    loadError(error) {
        this.setState({
            loading: false,
            error: error.message,
            commits: null,
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

const ErrorMessage = ({ error }) => (
    error ? <div className="alert">{ error }</div> : null
);

const LoadingIndicator = ({ loading }) => (
    loading ? <div className="loading">loading...</div> : null
);

const Commit = ({ commit }) => (
    <div className="commit">
        <div>SHA: { commit.sha }</div>
        <div>Message: { commit.commit.message }</div>
        <div>Author: {commit.commit.author.name }</div>
    </div>
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

const AppComponent = ({ loading, error, commits, onLoad }) => (
    <div className="App">
        <button onClick={onLoad} disabled={loading}>Load</button>
        <ErrorMessage error={error} />
        <LoadingIndicator loading={loading} />
        { commits && <CommitList commits={commits} /> }
    </div>
);


export default AppController;
