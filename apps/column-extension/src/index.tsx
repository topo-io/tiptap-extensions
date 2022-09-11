import React from 'react';
import { render } from 'react-dom';

import { RichTextEditor } from './components';

import { BASIC_CONTENT } from './data';

import './index.scss';

render(
  <div id="Wrapper">
    <RichTextEditor content={BASIC_CONTENT} />
  </div>,
  document.getElementById('root')
);
