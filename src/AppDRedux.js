import React from 'react';
import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { Provider, connect } from 'react-redux';
import request from 'superagent';
import './App.css';

const repoUrl = (user, repo) => `https://api.github.com/repos/${user}/${repo}/commits`;

const initialState = {
    loading: false,
    error: false,
    commits: null,
};

function reducer(state = initialState, action) {
    switch (action.type) {
        case 'START_LOAD':
            return {
                ...state,
                loading: true
            };

        case 'COMMITS_LOADED':
            return {
                loading: false,
                error: false,
                commits: action.commits
            };

        case 'LOAD_ERROR':
            return {
                loading: false,
                error: action.error.message,
                commits: null
            };

        default:
            return state;
    }
}

const store = createStore(reducer, applyMiddleware(thunk));

function startLoad() {
    return {
        type: 'START_LOAD'
    };
}

function commitsLoaded(commits) {
    return {
        type: 'COMMITS_LOADED',
        commits
    };
}

function loadError(error) {
    return {
        type: 'LOAD_ERROR',
        error
    };
}

function load(user, repo) {
    return dispatch => {
        dispatch(startLoad());
        request.get(repoUrl(user, repo))
            .then(res => dispatch(commitsLoaded(res.body)))
            .catch(err => dispatch(loadError(err)));
    }
}

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

const AppComponent = ({ loading, error, commits, onLoad }) => (
    <div className="App">
        <button onClick={onLoad} disabled={loading}>Load</button>
        <ErrorMessage error={error} />
        <LoadingIndicator loading={loading} />
        { commits && <CommitList commits={commits} /> }
    </div>
);

const ConnectedAppComponent = connect(
    state => state,
    dispatch => ({
        onLoad: () => dispatch(load("mozilla", "gecko-dev"))
    })
)(AppComponent);

const App = () => (
    <Provider store={store}>
        <ConnectedAppComponent />
    </Provider>
);

export default App;
