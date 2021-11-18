import React from 'react';
import { AppProps } from 'next/app';
import Head from 'next/head';

import '../styles/global.scss';

import ContextProviders from '../contexts';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>SocketChat</title>
      </Head>

      <ContextProviders>
        <Component {...pageProps} />
      </ContextProviders>
    </>
  );
}

export default MyApp;
