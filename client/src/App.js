import React, { Component } from 'react';
import './App.css';
import 'whatwg-fetch';

const SERVER = 'http://127.0.0.1:5678';

const makeGetRequest = () => {
    return fetch(`${SERVER}/`, {
        method: 'GET',
        mode: 'cors',
        headers: {
            'X-BZ-Custom-Header': 'lorem ipsum'
        }
    }).then(res => res.json());
};

const makePostRequest = () => {
    return fetch(`${SERVER}/postable`, {
        method: 'POST',
        mode: 'cors',
        headers: {
            'X-BZ-Custom-Header': 'lorem ipsum'
        }
    }).then(res => res.json());
};

class App extends Component {
    handleGetButtonClick() {
        makeGetRequest().then(response => this.setState({ response }));
    }

    handlePostButtonClick() {
        makePostRequest().then(response => this.setState({ response }));
    }

    render() {
        return (
            <div className="App">
                <button onClick={() => this.handleGetButtonClick()}>GET</button>
                <br />
                <button onClick={() => this.handlePostButtonClick()}>POST</button>
                </div>
        );
    }
}

export default App;
