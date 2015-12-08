'use strict';

import React from 'react';
import CSSModules from 'react-css-modules';
import styles from './index.css';

class App extends React.Component {

    render () {
        return <h1 styleName='title'>hello world!</h1>;
    }

}

export default CSSModules(App, styles);

