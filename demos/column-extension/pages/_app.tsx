import '../styles/globals.css';
import type { AppProps } from 'next/app';

import '../styles/index.scss';
import '../styles/Toolbar.scss';
import '../styles/Popover.scss';
import '../styles/RichTextEditor.scss';
import '@gocapsule/column-extension/src/index.css';

function MyApp({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}

export default MyApp;
