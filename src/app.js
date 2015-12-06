'use strict';

import React from 'react';              //eslint-disable-line no-unused-vars
import { render } from 'react-dom';     //eslint-disable-line no-unused-vars

console.log('hello world!');

class App extends React.Component {     //eslint-disable-line no-unused-vars

    render () {
        return <h1>hello world!</h1>;
    }

}

render(<App/>, document.getElementById('app'));
