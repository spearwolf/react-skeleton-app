/* global DEBUG */
'use strict';

import React from 'react';              //eslint-disable-line no-unused-vars
import { render } from 'react-dom';     //eslint-disable-line no-unused-vars
import App from './app';                //eslint-disable-line no-unused-vars

if (DEBUG) console.log('hello world!');

export function run (elemId) {
    render(<App/>, document.getElementById(elemId));
}

